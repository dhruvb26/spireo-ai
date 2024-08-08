"use client";
import { signIn } from "next-auth/react";
import GradientButton from "../ui/rounded-border-button";
import { ArrowRight } from "lucide-react";

export function SignIn() {
  return (
    <GradientButton
      onClick={() => signIn()}
      gradientColors={[
        "from-primary-blue",
        "via-primary-blue",
        "to-darker-blue",
      ]}
      className="mt-4 w-fit py-8 text-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
    >
      Get Started for Free
      <span className="ml-2 flex-shrink-0 rounded-full bg-white p-[0.5rem]">
        <ArrowRight className="h-4 w-4 text-primary-blue" />
      </span>
    </GradientButton>
  );
}
