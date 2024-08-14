"use client";

import React from "react";
import Link from "next/link";
import { ChatCentered } from "@phosphor-icons/react";

const FeedbackButton: React.FC = () => {
  return (
    <Link
      className="fixed bottom-6 right-6 z-50 rounded-full bg-blue-600 px-4 py-4 transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-700"
      href="https://spireo.canny.io/feature-requests"
      target="_blank"
    >
      <ChatCentered weight="fill" className="text-white" size={24} />
    </Link>
  );
};

export default FeedbackButton;
