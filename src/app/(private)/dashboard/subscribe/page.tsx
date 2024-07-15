"use client";
import React from "react";
import { env } from "@/env";
import FadeSeparator from "@/components/ui/fade-separator";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const SubscribePage = () => {
  const environment = env.NEXT_PUBLIC_NODE_ENV;

  const handleClick = () => {
    const subscriptionUrl =
      environment === "development"
        ? "https://buy.stripe.com/test_3cs16B3DI68Ycve001"
        : "";

    window.location.href = subscriptionUrl;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-2 text-3xl font-bold">Subscribe</h1>
      <p className="text-sm text-slate-500">
        Subscribe to get full access. Free for first 7 days! Cancel anytime.
        Then $29/month.
      </p>
      <FadeSeparator />
      <Button
        className="h-fit w-fit rounded-full bg-primary-blue text-xl hover:bg-darker-blue"
        onClick={handleClick}
      >
        Subscribe
        <ArrowRight className="ml-2" />
      </Button>
      {environment !== "production" && (
        <p className="mt-2 text-sm text-red-500">
          Note: This is a test environment. Subscriptions here will not be real.
        </p>
      )}
    </div>
  );
};

export default SubscribePage;
