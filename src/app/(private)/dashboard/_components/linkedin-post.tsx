"use client";
import React, { useState, useEffect } from "react";
import { FaThumbsUp, FaComment, FaShare, FaPaperPlane } from "react-icons/fa";
import { getUser } from "@/app/actions/user";
import { Descendant } from "slate";
import ContentViewer from "@/app/(private)/dashboard/_components/content-viewer";
import { getDownloadUrl } from "@/app/actions/draft";
import { useRouter } from "next/navigation";
import { revalidatePost } from "@/app/actions/revalidate";

interface LinkedInPostPreviewProps {
  content: Descendant[];
  device: "mobile" | "tablet" | "desktop";
  postId: string;
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
  postId,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userData = await getUser();
        setUser(userData as User);

        // Fetch download URL
        const result = await getDownloadUrl(postId);

        if (result.success) {
          console.log("Getting download URL: ", result.data);
          setDownloadUrl(result.data || "");
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("An error occurred while fetching data");
        console.error(err);
      }
    };

    fetchData();
  }, [postId]);

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

        <ContentViewer postId={postId} value={content} />

        {downloadUrl && (
          <div className="mt-2 flex h-fit items-center justify-center">
            <img src={downloadUrl} alt="Image" className="" />
          </div>
        )}

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
                <span className="text-sm text-brand-gray-500">
                  {action.icon}
                </span>
                <span className="mt-1 text-xs font-medium text-brand-gray-500">
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
