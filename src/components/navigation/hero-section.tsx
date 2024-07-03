"use client";
import {
  ArrowRight,
  ArrowRightCircle,
  ArrowUpRight,
  Check,
  UsersRound,
  Wand2,
} from "lucide-react";
import React from "react";
import GradientButton from "../ui/rounded-border-button";
import { PenIcon } from "lucide-react";
import { AnimatedTooltip } from "./animated-tooltip";
import { DotPattern } from "../ui/dot-pattern";
import { cn } from "@/lib/utils";
import { SignIn } from "../auth/signin-button";
import Link from "next/link";

const HeroSection = () => {
  return (
    <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl text-center">
        <div className="py-6">
          <button className="relative inline-flex h-fit overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-blue-50">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#2563EB_0%,#1E3A8A_50%,#1E3A8A_100%)]" />
            <span className=" inline-flex h-fit w-full cursor-pointer items-center justify-center rounded-full bg-black px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              <svg
                className="mr-2"
                xmlns="http://www.w3.org/2000/svg"
                width="1.75em"
                height="1.2em"
                viewBox="0 0 256 176"
              >
                <path
                  fill="white"
                  d="m147.487 0l70.081 175.78H256L185.919 0zM66.183 106.221l23.98-61.774l23.98 61.774zM70.07 0L0 175.78h39.18l14.33-36.914h73.308l14.328 36.914h39.179L110.255 0z"
                ></path>
              </svg>
              Powered by Claude 3.5 Sonnet
            </span>
          </button>
        </div>
        <h1 className="text-4xl font-semibold sm:text-6xl">
          <span className="">
            {" "}
            Grow your personal brand on
            <span className="inline text-primary-blue"> LinkedIn </span>
            within minutes.
          </span>
        </h1>
        <p className="mt-5 text-base  sm:text-xl">
          Find inspiration, create posts using AI, and easily schedule out
          content on LinkedIn. Grow faster, boost engagement, save money and
          time.
        </p>
        <SignIn />
        <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-8 px-20 text-left sm:grid-cols-3 sm:px-0">
          <div className="flex items-center">
            <UsersRound className="flex-shrink-0" />
            <p className="ml-3 text-sm ">Trusted by 2000+ professionals</p>
          </div>

          <div className="flex items-center">
            <Check className="flex-shrink-0" />
            <p className="ml-3 text-sm ">No recurring charges, pay once</p>
          </div>

          <div className="flex items-center">
            <Wand2 className="flex-shrink-0" />
            <p className="ml-3 text-sm ">
              Best content for your personal brand
            </p>
          </div>
        </div>
      </div>
      <DotPattern
        width={50}
        height={30}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:radial-gradient(600px_circle_at_center,transparent,white)]",
          "fill-neutral-400/80",
        )}
      />
    </div>
  );
};

export default HeroSection;
