"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import Image from "next/image";

interface LinkedInSignInButtonProps {
  buttonText: string;
}

export default function LinkedInSignInButton({
  buttonText,
}: LinkedInSignInButtonProps) {
  const handleLinkedInSignIn = () => {
    try {
      signIn("linkedin", {
        callbackUrl: `/dashboard/post`,
        redirect: true,
      });
    } catch (error) {
      console.error("Error signing in with LinkedIn", error);
    }
  };

  return (
    <Button
      onClick={handleLinkedInSignIn}
      className="flex items-center justify-center rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-2 text-sm text-brand-gray-900 shadow hover:bg-neutral-100"
    >
      <Image
        src="/icons8-linkedin (1).svg"
        width={20}
        height={20}
        alt="LinkedIn Logo"
        className="mr-2"
      />
      {buttonText}
    </Button>
  );
}
