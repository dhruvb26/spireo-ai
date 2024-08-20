"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

interface LinkedInSignInButtonProps {
  buttonText: string;
}

export default function LinkedInSignInButton({
  buttonText,
}: LinkedInSignInButtonProps) {
  const id = uuidv4();
  const handleLinkedInSignIn = () => {
    try {
      signIn("linkedin", {
        callbackUrl: `/dashboard/draft/${id}`,
        redirect: true,
      });
    } catch (error) {
      console.error("Error signing in with LinkedIn", error);
    }
  };

  return (
    <Button
      onClick={handleLinkedInSignIn}
      className="group flex w-full select-none items-center justify-center rounded-lg border border-zinc-50 bg-white leading-8 text-zinc-950 shadow-[0_-1px_0_0px_#d4d4d8_inset,0_0_0_1px_#f4f4f5_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-50 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]"
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
