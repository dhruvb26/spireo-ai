import React from "react";
import { Button } from "@/components/ui/button";
import { getServerAuthSession } from "@/server/auth";
import FadeSeparator from "@/components/ui/fade-separator";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

const SetupPage = async () => {
  const customerPortalLink =
    "https://billing.stripe.com/p/login/test_bIYcPt7RJcPs3vicMM";
  const session = await getServerAuthSession();

  const formatDate = (date: Date) => {
    return date ? format(new Date(date), "MMMM d, yyyy") : "Not available";
  };

  return (
    <div className="container mx-auto flex flex-col p-4">
      <h1 className="mb-2 text-3xl font-bold">Manage your Account</h1>
      <p className="text-sm text-slate-500">
        Billing, Settings or anything else you need to manage.
      </p>
      <FadeSeparator />

      {session?.user && (
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center">
            {session.user.image && (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={40}
                height={40}
                className="mr-4 rounded-full"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold">{session.user.name}</h2>
              <p className="text-slate-600">{session.user.email}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-slate-500">Trial Ends At:</p>
            <p className="text-lg font-medium">
              {formatDate(session.user.trialEndsAt || new Date())}
            </p>
          </div>
        </div>
      )}

      <Link
        href={customerPortalLink + "?prefilled_email=" + session?.user.email}
      >
        <Button className="mt-4 w-full rounded-full bg-primary-blue px-8 hover:bg-darker-blue sm:w-auto">
          Manage Billing
        </Button>
      </Link>
    </div>
  );
};

export default SetupPage;
