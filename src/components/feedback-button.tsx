"use client";

import React from "react";
import Link from "next/link";
import { ChatDots } from "@phosphor-icons/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const FeedbackButton: React.FC = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg transition duration-300 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            aria-label="Feedback"
          >
            <Link
              href="https://spireo.canny.io/feature-requests"
              target="_blank"
            >
              <ChatDots size={24} />
            </Link>
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" align="end">
          <p className="text-sm font-medium">Give Feedback</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FeedbackButton;
