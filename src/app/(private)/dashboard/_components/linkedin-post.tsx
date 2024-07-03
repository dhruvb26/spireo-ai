"use client";
import React, { useState, useEffect } from "react";
import { FaThumbsUp, FaComment, FaShare, FaPaperPlane } from "react-icons/fa";
import { getUser } from "@/app/actions/user";
import { Descendant } from "slate";
import ContentViewer from "@/app/(private)/dashboard/_components/content-viewer";

interface LinkedInPostPreviewProps {
  content: Descendant[];
  device: "mobile" | "tablet" | "desktop";
}

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

const LinkedInPostPreview: React.FC<LinkedInPostPreviewProps> = ({
  content,
  device,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      setUser(userData as User);
    };
    fetchUser();
  }, []);

  return (
    <div className="flex w-full justify-center">
      <div
        className={`w-full rounded bg-white p-4 shadow ${
          device === "mobile"
            ? "max-w-[320px]"
            : device === "tablet"
              ? "max-w-[480px]"
              : "max-w-[560px]"
        }`}
      >
        <div className="mb-2 flex items-center">
          <div className="relative mr-2 h-12 w-12">
            <img
              src={user?.image || "https://i.pravatar.cc/300"}
              alt="Profile"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-grow">
            <p className="text-sm text-black">{user?.name || "..."}</p>
            <p className="text-sm text-gray-500">
              Now • <span>🌐</span>
            </p>
          </div>
          <button className="ml-2 text-gray-500">•••</button>
        </div>

        <ContentViewer value={content} />

        <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <div className="mr-2 flex -space-x-1">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                👍
              </span>
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-xs text-white">
                👏
              </span>
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                ❤️
              </span>
            </div>
            <span>267</span>
          </div>
          <div>
            <span>22 comments • 5 reposts</span>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-1">
          <div className="flex items-center justify-between">
            {[
              { name: "Like", icon: <FaThumbsUp /> },
              { name: "Comment", icon: <FaComment /> },
              { name: "Repost", icon: <FaShare /> },
              { name: "Send", icon: <FaPaperPlane /> },
            ].map((action) => (
              <button
                key={action.name}
                className="flex flex-1 flex-col items-center justify-center rounded-lg px-1 py-2 transition-colors duration-200 ease-in-out hover:bg-gray-100"
              >
                <span className="text-sm text-gray-600">{action.icon}</span>
                <span className="mt-1 text-xs font-medium text-gray-600">
                  {action.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInPostPreview;
