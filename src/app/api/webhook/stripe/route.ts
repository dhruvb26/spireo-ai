import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { headers } from "next/headers";
import Stripe from "stripe";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { env } from "@/env";
import { plans } from "@/components/navigation/fixed-pricing";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20", // Use the latest API version
});
const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();

  const signature = headers().get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No Stripe Signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  // Verify Stripe Event
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

        if (!session.customer || typeof session.customer !== "string") {
          return NextResponse.json(
            { error: "Invalid customer ID" },
            { status: 400 },
          );
        }

        const customerId = session.customer;
        const customer = await stripe.customers.retrieve(customerId);

        if (!session.line_items) {
          session = await stripe.checkout.sessions.retrieve(session.id, {
            expand: ["line_items"],
          });
        }

        const priceId = session.line_items?.data[0]?.price?.id;
        if (!priceId) {
          return NextResponse.json(
            { error: "Price ID not found" },
            { status: 400 },
          );
        }

        const plan = plans.find((p) => p.priceId === priceId);

        if (!plan) {
          return NextResponse.json(
            { error: "Plan not found" },
            { status: 404 },
          );
        }

        if ("deleted" in customer && customer.deleted) {
          return NextResponse.json(
            { error: "Customer not found" },
            { status: 404 },
          );
        }

        if ("email" in customer && customer.email) {
          const user = await db.query.users.findFirst({
            where: eq(users.email, customer.email),
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
              stripeCustomerId: customerId,
              priceId: priceId,
              hasAccess: true,
            })
            .where(eq(users.id, user.id));
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
            hasAccess: false,
          })
          .where(eq(users.id, user.id));
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
