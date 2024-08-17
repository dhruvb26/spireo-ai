import React from "react";
import Link from "next/link";
import {
  UserCircleCheck,
  ClockCounterClockwise,
  ArrowUpRight,
} from "@phosphor-icons/react/dist/ssr";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { checkValidity, getUserFromDb } from "@/actions/user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { eq } from "drizzle-orm";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LinkedInSignInButton from "@/components/auth/linkedin-signin-button";
import { db } from "@/server/db";
import { accounts } from "@/server/db/schema";
import DeleteAccountButton from "@/components/auth/delete-button";

const SettingsPage = async () => {
  const user = await getUserFromDb();
  const endsAt = (await checkValidity()) as Date;
  if (!user) return null;

  const account = await db.query.accounts.findFirst({
    where: eq(accounts.userId, user.id),
  });

  const provider = account?.provider;

  const specialAccess = user.specialAccess;
  const customerPortalLink =
    "https://billing.stripe.com/p/login/test_bIYcPt7RJcPs3vicMM";

  const formatDate = (date: Date) =>
    date ? format(new Date(date), "MMMM d, yyyy") : "Not available";

  const validityInfo = specialAccess ? (
    <Badge className="ml-auto space-x-1 bg-purple-50 font-normal text-purple-600 hover:bg-purple-100">
      <span>Special</span>
      <UserCircleCheck />
    </Badge>
  ) : (
    <Badge className="ml-auto space-x-1 bg-purple-50 font-normal text-purple-600 hover:bg-purple-100">
      <span>{formatDate(endsAt)}</span>
      <ClockCounterClockwise />
    </Badge>
  );

  return (
    <main>
      <div className="space-y-16">
        <div className="text-left">
          <h1 className="text-xl font-semibold tracking-tight text-brand-gray-900">
            Account Settings
          </h1>
          <p className="text-sm text-brand-gray-500">
            See the information we gather about you and manage your
            subscription.
          </p>
        </div>
        <section className="flex space-x-4">
          <div className="w-1/3">
            <h2 className="text-md font-semibold tracking-tight text-brand-gray-900">
              Personal
            </h2>
            <p className="text-sm text-brand-gray-500">
              We have obtained your name and email through LinkedIn.
            </p>
          </div>
          <div className="w-2/3 space-y-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium">
                Name
              </label>
              <Input
                disabled
                type="text"
                id="name"
                defaultValue={user.name || ""}
                className="text-sm"
                placeholder="example.com/janesmith"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium">
                Email
              </label>
              <Input
                disabled
                type="email"
                id="email"
                defaultValue={user.email || ""}
                className="text-sm"
              />
            </div>
          </div>
        </section>

        <section className="flex space-x-4">
          <div className="w-1/3">
            <h2 className="text-md font-semibold tracking-tight text-brand-gray-900">
              Account
            </h2>
            <p className="text-sm text-brand-gray-500">
              Manage your account settings and billing details.
            </p>
            <div className="pr-8">
              <div className="mt-2 rounded-lg bg-blue-100 p-4 text-left text-xs text-blue-600">
                <span>
                  Our subscriptions are managed through Stripe. To update your
                  card, cancel your subscription, or make other changes, please
                  visit the{" "}
                  <Link
                    target="_blank"
                    className="hover:text-blue-700 hover:underline"
                    href={`${customerPortalLink}?prefilled_email=${user.email}`}
                  >
                    {" "}
                    customer portal here{" "}
                    <ArrowUpRight className="inline h-3 w-3" />
                  </Link>
                </span>
              </div>
            </div>
          </div>
          <div className="w-2/3 space-y-4">
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-brand-gray-900">
                Access
              </h2>
              <Select disabled defaultValue="active">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select access" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2">
              <h2 className="text-sm font-medium text-brand-gray-900">
                Validity
              </h2>
              <div className="text-sm text-gray-400">{validityInfo}</div>
            </div>
          </div>
        </section>
        <section className="flex space-x-4">
          <div className="w-1/3">
            <h2 className="text-md font-semibold tracking-tight text-brand-gray-900">
              LinkedIn
            </h2>
            <p className="text-sm text-brand-gray-500">
              Connect your LinkedIn account to continue.
            </p>
          </div>
          <div className="flex w-2/3 items-center justify-start">
            {provider === "linkedin" ? (
              <Button
                disabled
                className="flex items-center justify-center rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-2 text-sm text-brand-gray-900 shadow hover:bg-neutral-100"
              >
                <Image
                  src="/icons8-linkedin (1).svg"
                  width={20}
                  height={20}
                  alt="LinkedIn Logo"
                  className="mr-2"
                />
                Connected
              </Button>
            ) : (
              <LinkedInSignInButton buttonText="Connect LinkedIn" />
            )}
          </div>
        </section>
        <section className="flex space-x-4">
          <div className="w-1/3">
            <h2 className="text-md font-semibold tracking-tight text-brand-gray-900">
              Delete Account
            </h2>
            <p className="text-sm text-brand-gray-500">
              Permanently remove account and all associated data.
            </p>
          </div>
          <div className="flex w-2/3 items-center justify-start">
            <DeleteAccountButton />
          </div>
        </section>
      </div>
    </main>
  );
};

export default SettingsPage;
