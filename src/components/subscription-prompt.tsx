// components/SubscriptionPrompt.tsx
"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react";

const SubscriptionPrompt: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <div className="mb-6 flex w-full flex-row items-center justify-center space-x-2">
          <Image
            src="/Spireo Logo Symbol Custom.png"
            height={50}
            width={50}
            alt="Spireo Logo"
            className="mb-2"
          />
          <span className="text-3xl font-bold tracking-tighter">Spireo</span>
        </div>

        <p className="mb-6 text-sm">
          To continue using our service, please subscribe to our launch plan &
          continue growing on LinkedIn.
        </p>

        <div className="flex flex-col items-center space-y-4">
          <Link
            target="_blank"
            href="https://buy.stripe.com/eVa7uTcgf4YP0kU8ww"
            className="bg-gradient-animation text-md flex w-full max-w-xs items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-brand-purple-700 via-brand-purple-500 to-brand-purple-400 px-4 py-2 text-center text-white transition-all hover:scale-105"
          >
            Subscribe
            <ArrowUpRight size={16} />
          </Link>

          <Link
            className="flex items-center text-xs text-blue-500 hover:text-blue-700 hover:underline"
            href="/pricing"
          >
            View Pricing
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPrompt;
