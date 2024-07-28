"use client";
import React, { useState } from "react";

const MarketingTip = () => {
  const [title, setTitle] = useState("Marketing Tips");
  const [mainText, setMainText] = useState(
    "Find this useful? like and share this post with your friends.",
  );
  const [author, setAuthor] = useState("Matt Zhang");
  const [handle, setHandle] = useState("@reallygreatsite");

  return (
    <div className="relative h-96 w-80 overflow-hidden bg-green-200 p-6 font-sans">
      {/* Star icon */}
      <svg
        className="absolute right-4 top-4"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="12" fill="#1E40AF" />
        <path
          d="M12 3L14.5 8.5L20 9.5L16 14L17 20L12 17L7 20L8 14L4 9.5L9.5 8.5L12 3Z"
          fill="#E5E7EB"
        />
      </svg>

      <input
        className="w-full border-none bg-transparent text-2xl font-bold text-blue-900 focus:outline-none"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="mt-4 h-40 w-full resize-none border-none bg-transparent text-3xl font-bold text-blue-900 focus:outline-none"
        value={mainText}
        onChange={(e) => setMainText(e.target.value)}
      />
      <div className="absolute bottom-12 left-6">
        <input
          className="border-none bg-transparent text-sm text-blue-900 focus:outline-none"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <br />
        <input
          className="border-none bg-transparent text-sm text-blue-900 focus:outline-none"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
        />
      </div>
      <button className="absolute bottom-6 right-6 rounded bg-blue-900 px-4 py-2 text-white">
        Save
      </button>

      {/* Background lines */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        height="50"
        viewBox="0 0 320 50"
        preserveAspectRatio="none"
      >
        <g stroke="#A3E635" strokeWidth="0.5" opacity="0.5">
          {[...Array(16)].map((_, i) => (
            <line key={i} x1={i * 20} y1="0" x2={i * 20} y2="50" />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default MarketingTip;
