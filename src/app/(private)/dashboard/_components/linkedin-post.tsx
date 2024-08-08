"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { getUser } from "@/actions/user";
import { Descendant } from "slate";
import ContentViewer from "@/app/(private)/dashboard/_components/content-viewer";
import { getDownloadUrl } from "@/actions/draft";
import {
  ChatCircleText,
  GlobeHemisphereWest,
  PaperPlaneTilt,
  Repeat,
  ThumbsUp,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const PdfViewerComponent = dynamic(() => import("./PdfViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center">
      <Loader2 className="mb-2 h-4 w-4 animate-spin text-blue-600" />
    </div>
  ),
});

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
  const [contentType, setContentType] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUser();
        setUser(userData as User);

        const result = await getDownloadUrl(postId);

        if (result.success) {
          console.log("Getting download URL: ", result.data);
          setDownloadUrl(result.data as string);

          const response = await fetch(result.data as string, {
            method: "HEAD",
          });
          const type = response.headers.get("Content-Type");
          setContentType(type);
          console.log("Content type: ", type);
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
            <p className="text-sm font-semibold text-black">
              {user?.name || "..."}
            </p>
            <p className="flex items-center text-xs text-gray-500">
              Now •
              <span className="ml-1">
                <GlobeHemisphereWest weight="fill" />
              </span>
            </p>
          </div>
        </div>

        <ContentViewer postId={postId} value={content} />

        {downloadUrl && (
          <div className="mt-2 flex items-center justify-center">
            <img
              src={downloadUrl}
              alt="Content"
              className={`h-auto ${
                device === "mobile"
                  ? "max-w-[320px]"
                  : device === "tablet"
                    ? "max-w-[480px]"
                    : "max-w-[560px]"
              }`}
            />
            {/* // (
            //   <PdfViewerComponent file={downloadUrl} device={device} />
            // ) */}
          </div>
        )}

        <div className="border-t border-gray-200 pt-1">
          <div className="flex items-center justify-between">
            {[
              {
                name: "Like",
                icon: (
                  <ThumbsUp
                    className="scale-x-[-1] transform"
                    weight="fill"
                    size={20}
                  />
                ),
              },
              {
                name: "Comment",
                icon: <ChatCircleText weight="fill" size={20} />,
              },
              { name: "Repost", icon: <Repeat weight="bold" size={20} /> },
              {
                name: "Send",
                icon: <PaperPlaneTilt weight="fill" size={20} />,
              },
            ].map((action) => (
              <Button
                size={"sm"}
                key={action.name}
                className="flex flex-1 flex-row items-center justify-center space-x-1 rounded-lg bg-white px-1 py-2 transition-colors duration-200 ease-in-out hover:bg-white"
              >
                <span className="text-sm text-brand-gray-500">
                  {action.icon}
                </span>
                <span className="mt-1 text-xs font-medium text-brand-gray-500">
                  {action.name}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInPostPreview;
