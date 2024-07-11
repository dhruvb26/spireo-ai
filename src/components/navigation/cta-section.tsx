"use client";
import { ArrowUpRight } from "lucide-react";
import React from "react";
import { CoolMode } from "../ui/cool-mode";

const CTASection = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-left sm:text-center">
        <div className="mx-auto mb-4 inline-flex rounded-full bg-gradient-to-r from-primary-blue to-darker-blue px-4 py-1.5">
          <p className="text-xs font-semibold uppercase tracking-widest text-white">
            GET SPIREO
          </p>
        </div>
        <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
          Write your first post with Spireo and never look back
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600">
          Transform your LinkedIn presence with Spireo's AI-powered tools.
          Create engaging, professional content in minutes, boost your
          visibility, and grow your network effortlessly.
        </p>
      </div>

      <div className="mt-8 space-y-8 sm:mt-12 sm:flex sm:items-start sm:justify-center sm:space-x-12 sm:space-y-0 md:space-x-20 lg:mt-20">
        <div className="flex items-start">
          <svg
            className="h-7 w-7 flex-shrink-0 text-black"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <div className="ml-4">
            <h3 className="text-xl font-semibold text-black">Intiutive UI</h3>
            <p className="mt-1.5 text-base text-gray-600">Easy to use</p>
          </div>
        </div>

        <div className="flex items-start">
          <svg
            className="h-7 w-7 flex-shrink-0 text-black"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <div className="ml-4">
            <h3 className="text-xl font-semibold text-black">AI Powered</h3>
            <p className="mt-1.5 text-base text-gray-600">Make it better</p>
          </div>
        </div>

        <div className="flex items-start">
          <svg
            className="h-7 w-7 flex-shrink-0 text-black"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <div className="ml-4">
            <h3 className="text-xl font-semibold text-black">Easy Access</h3>
            <p className="mt-1.5 text-base text-gray-600">Anyone can use</p>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center py-6">
        <CoolMode
          duration={1000}
          particleCount={10}
          colors={["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"]}
        >
          <button className="rounded-full bg-gradient-to-b from-primary-blue to-darker-blue px-6 py-2 text-lg text-white transition duration-200 hover:shadow-xl focus:ring-2 focus:ring-sky-400">
            Get Started for Free
            <ArrowUpRight className="ml-2 inline-block h-4 w-4" />
          </button>
        </CoolMode>
      </div>

      <div className="mt-8 flex items-center justify-start sm:justify-center sm:px-0">
        <svg
          className="h-5 w-5 flex-shrink-0 text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          ></path>
        </svg>
        <span className="ml-2 text-sm text-gray-600">
          {" "}
          Your data is complely secured with us. We don’t share with anyone.{" "}
        </span>
      </div>
    </div>
  );
};

export default CTASection;
