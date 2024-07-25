"use client";
import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUpRight } from "@phosphor-icons/react";
import { format } from "date-fns";

interface User {
  id: string;
  name?: string | null;
  image?: string | null;
  email?: string | null;
}

interface SettingsProps {
  user: User;
  hasAccess: boolean;
  endsAt: Date;
}

const Settings: React.FC<SettingsProps> = ({ user, hasAccess, endsAt }) => {
  const customerPortalLink =
    "https://billing.stripe.com/p/login/test_bIYcPt7RJcPs3vicMM";

  const formatDate = (date: Date) => {
    return date ? format(new Date(date), "MMMM d, yyyy") : "Not available";
  };

  const trialEndsAt = formatDate(endsAt as Date);

  return (
    <div className="max-w-6xl">
      <div className="container space-y-2 text-left">
        <h1 className="text-3xl font-bold tracking-tighter text-brand-gray-900">
          Settings
        </h1>
        <p className="text-md text-brand-gray-500">
          Manage your account settings and billing information.
        </p>
      </div>

      <div className="mt-8 px-8">
        <Card className="max-w-md">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={user.image || ""} />
                <AvatarFallback>
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="text-lg font-semibold">{user.name}</h4>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-brand-gray-500">{user.email}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Access</p>
              <p className="text-sm text-brand-gray-500">
                {hasAccess ? "Active" : "Inactive"}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Validity</p>
              <p className="text-sm text-brand-gray-500">{trialEndsAt}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Billing</p>
              <Link
                target="_blank"
                className="text-sm font-light text-brand-gray-500 hover:text-brand-gray-900 hover:underline"
                href={`${customerPortalLink}?prefilled_email=${user.email}`}
              >
                Manage Billing <ArrowUpRight className="inline" size={14} />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
