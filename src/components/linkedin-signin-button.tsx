"use client";

import { signIn } from "next-auth/react";
import { FaLinkedin } from "react-icons/fa";

export default function LinkedInSignInButton() {
  const handleLinkedInSignIn = () => {
    try {
      signIn("linkedin", {
        callbackUrl: `/dashboard`,
        redirect: true,
      });
    } catch (error) {
      console.error("Error signing in with LinkedIn", error);
    }
  };

  return (
    <button
      onClick={handleLinkedInSignIn}
      className="mb-4 flex w-full items-center justify-center rounded-full bg-white px-4 py-2 text-sm text-custom-gray transition duration-300 hover:bg-custom-gray hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 sm:text-base"
    >
      <FaLinkedin className="mr-2" />
      Log in with LinkedIn
    </button>
  );
}
