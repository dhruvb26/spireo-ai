import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { headers } from "next/headers";
import Stripe from "stripe";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { env } from "@/env";

const plans = [
  {
    link:
      env.NEXT_PUBLIC_NODE_ENV === "development"
        ? "https://buy.stripe.com/test_3cs16B3DI68Ycve001"
        : "",
    priceId: "price_1PaxYyRvU50syM0ABpRUVw3R",
    price: 29,
    duration: "/month",
  },
];

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});
const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No Stripe Signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const data = event.data.object;
  const eventType = event.type;

  try {
    switch (eventType) {
      case "checkout.session.completed": {
        let session = data as Stripe.Checkout.Session;
        console.log("Checkout session completed:", session.id);

        if (!session.customer || typeof session.customer !== "string") {
          console.log("Invalid customer ID");
          return NextResponse.json(
            { error: "Invalid customer ID" },
            { status: 400 },
          );
        }

        const customerId = session.customer;
        console.log("Customer ID:", customerId);

        const customer = await stripe.customers.retrieve(customerId);
        console.log("Customer retrieved:", customer.id);

        if (!session.line_items) {
          session = await stripe.checkout.sessions.retrieve(session.id, {
            expand: ["line_items"],
          });
          console.log("Session retrieved with line items");
        }

        const priceId = session.line_items?.data[0]?.price?.id;
        if (!priceId) {
          console.log("Price ID not found");
          return NextResponse.json(
            { error: "Price ID not found" },
            { status: 400 },
          );
        }
        console.log("Price ID:", priceId);

        const plan = plans.find((p) => p.priceId === priceId);
        if (!plan) {
          console.log("Plan not found");
          return NextResponse.json(
            { error: "Plan not found" },
            { status: 404 },
          );
        }
        console.log("Plan found:", plan.priceId);

        if ("deleted" in customer && customer.deleted) {
          console.log("Customer has been deleted");
          return NextResponse.json(
            { error: "Customer not found" },
            { status: 404 },
          );
        }

        if ("email" in customer && customer.email) {
          console.log("Searching for user with email:", customer.email);
          const user = await db.query.users.findFirst({
            where: eq(users.email, customer.email),
          });

          if (!user) {
            console.log("User not found in database");
            return NextResponse.json(
              { error: "User not found" },
              { status: 404 },
            );
          }
          console.log("User found:", user.id);

          const subscriptionId = session.subscription as string;
          console.log("Subscription ID from session:", subscriptionId);

          const subscription =
            await stripe.subscriptions.retrieve(subscriptionId);
          console.log("Subscription retrieved:", subscription.id);

          try {
            await db
              .update(users)
              .set({
                stripeCustomerId: customerId,
                priceId: priceId,
                trialEndsAt: null,
                hasAccess: true,
                stripeSubscriptionId: subscription.id,
              })
              .where(eq(users.id, user.id));
            console.log("Database updated successfully");
          } catch (error) {
            console.error("Error updating database:", error);
            return NextResponse.json(
              { error: "Database update failed" },
              { status: 500 },
            );
          }
        } else {
          console.log("Customer email not found");
        }
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = data as Stripe.Subscription;

        if (
          !subscription.customer ||
          typeof subscription.customer !== "string"
        ) {
          return NextResponse.json(
            { error: "Invalid customer ID" },
            { status: 400 },
          );
        }

        const user = await db.query.users.findFirst({
          where: eq(users.stripeCustomerId, subscription.customer),
        });

        if (!user) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 },
          );
        }

        await db
          .update(users)
          .set({
            stripeCustomerId: null,
            priceId: null,
            hasAccess: false,
            stripeSubscriptionId: null,
          })
          .where(eq(users.id, user.id));

        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = data as Stripe.Invoice;
        if (invoice.billing_reason === "subscription_cycle") {
          const subscriptionId = invoice.subscription as string;
          const subscription =
            await stripe.subscriptions.retrieve(subscriptionId);

          const user = await db.query.users.findFirst({
            where: eq(users.stripeCustomerId, subscription.customer as string),
          });

          if (user) {
            await db
              .update(users)
              .set({
                trialEndsAt: null,
                hasAccess: true,
              })
              .where(eq(users.id, user.id));
          }
        }
        break;
      }
      case "customer.subscription.updated": {
        const subscription = data as Stripe.Subscription;

        if (
          !subscription.customer ||
          typeof subscription.customer !== "string"
        ) {
          return NextResponse.json(
            { error: "Invalid customer ID" },
            { status: 400 },
          );
        }

        const user = await db.query.users.findFirst({
          where: eq(users.stripeCustomerId, subscription.customer),
        });

        if (!user) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 },
          );
        }

        // Update user access based on subscription status
        await db
          .update(users)
          .set({
            hasAccess: subscription.status === "active",
          })
          .where(eq(users.id, user.id));

        console.log(`Updated user ${user.id} access`);

        break;
      }
      case "invoice.payment_failed": {
        const invoice = data as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;
        const subscription =
          await stripe.subscriptions.retrieve(subscriptionId);

        const user = await db.query.users.findFirst({
          where: eq(users.stripeCustomerId, subscription.customer as string),
        });

        if (user) {
          await db
            .update(users)
            .set({
              hasAccess: false,
            })
            .where(eq(users.id, user.id));
        }
        break;
      }
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }
  } catch (err: any) {
    console.error("Webhook event processing error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  return NextResponse.json({ received: true });
}
