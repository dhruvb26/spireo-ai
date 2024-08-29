"use client";
import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { getUser } from "@/actions/user";
import { Descendant } from "slate";
import ContentViewer from "@/app/(private)/dashboard/_components/content-viewer";
import { getDownloadUrl, getDraftDocumentTitle } from "@/actions/draft";
import { MdSmartphone, MdTablet, MdLaptop } from "react-icons/md";
import {
  ChatCircleText,
  GlobeHemisphereWest,
  PaperPlaneTilt,
  Repeat,
  ThumbsUp,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import LikeIcon from "./like-icon";
import CommentIcon from "./comment-icon";
import RepostIcon from "./repost-icon";
import SendIcon from "./send-icon";

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
  headline?: string | null;
}

const LinkedInPostPreview: React.FC<LinkedInPostPreviewProps> = ({
  content,
  device: initialDevice,
  postId,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [contentType, setContentType] = useState<string | null>(null);
  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop">(
    "mobile",
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [documentTitle, setDocumentTitle] = useState<string | null>(null);

  useEffect(() => {
    const updateDeviceBasedOnSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        if (containerWidth <= 320) {
          setDevice("mobile");
        } else if (containerWidth <= 480) {
          setDevice("tablet");
        } else {
          setDevice("desktop");
        }
      }
    };

    updateDeviceBasedOnSize();
    window.addEventListener("resize", updateDeviceBasedOnSize);

    return () => {
      window.removeEventListener("resize", updateDeviceBasedOnSize);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUser();
        setUser(userData as User);

        const titleResult = await getDraftDocumentTitle(postId);

        if (titleResult.success) {
          setDocumentTitle(titleResult.data || "");
        }

        const result = await getDownloadUrl(postId);

        if (result.success) {
          console.log("Getting download URL: ", result.data);
          setDownloadUrl(result.data as string);

          const response = await fetch(result.data as string, {
            method: "GET",
          });
          const type = response.headers.get("Content-Type");
          if (type) {
            setContentType(type);
            console.log("Content type: ", type);
          } else {
            console.error("Content-Type header is missing");
            setContentType("unknown");
          }
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

  useEffect(() => {
    const updateDeviceBasedOnSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        if (containerWidth <= 320) {
          setDevice("mobile");
        } else if (containerWidth <= 480) {
          setDevice("tablet");
        } else {
          setDevice("desktop");
        }
      }
    };

    updateDeviceBasedOnSize();
    window.addEventListener("resize", updateDeviceBasedOnSize);

    return () => {
      window.removeEventListener("resize", updateDeviceBasedOnSize);
    };
  }, []);

  const renderContent = () => {
    if (!downloadUrl) return null;

    console.log("Rendering content. Content type:", contentType);

    if (contentType?.startsWith("image/")) {
      return (
        <img
          src={downloadUrl}
          alt="Content"
          className="h-auto w-full object-contain"
        />
      );
    } else if (contentType === "application/pdf") {
      return (
        <PdfViewerComponent
          title={documentTitle || "PDF Document"}
          file={downloadUrl}
          device={device}
        />
      );
    } else if (contentType?.startsWith("video/")) {
      return (
        <video src={downloadUrl} controls className="h-auto w-full">
          Your browser does not support the video tag.
        </video>
      );
    } else {
      console.log("Unhandled content type:", contentType);
      return null;
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="mb-4 flex items-center justify-center">
        <div className="flex gap-2">
          <button
            onClick={() => setDevice("mobile")}
            className={`rounded-full p-2 ${device === "mobile" ? "text-brand-purple-600" : "text-brand-gray-500"}`}
          >
            <MdSmartphone size={24} />
          </button>
          <button
            onClick={() => setDevice("tablet")}
            className={`rounded-full p-2 ${device === "tablet" ? "text-brand-purple-600" : "text-brand-gray-500"}`}
          >
            <MdTablet size={24} />
          </button>
          <button
            onClick={() => setDevice("desktop")}
            className={`rounded-full p-2 ${device === "desktop" ? "text-brand-purple-600" : "text-brand-gray-500"}`}
          >
            <MdLaptop size={24} />
          </button>
        </div>
      </div>
      <div
        ref={containerRef}
        className={`w-full rounded bg-white shadow ${
          device === "mobile"
            ? "max-w-[320px]"
            : device === "tablet"
              ? "max-w-[480px]"
              : "max-w-[560px]"
        }`}
      >
        <div className="mb-2 flex items-center p-4">
          <div className="relative mr-2 h-12 w-12 flex-shrink-0">
            <Image
              height={48}
              width={48}
              src={user?.image || "/placeholder.svg"}
              alt="Profile"
              className="h-full w-full rounded-full object-cover"
              quality={100}
            />
          </div>
          <div className="min-w-0 flex-grow">
            <p className="text-sm font-semibold text-black">
              {user?.name || ""}
            </p>
            {user?.headline && (
              <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs font-normal text-brand-gray-500">
                {user.headline}
              </p>
            )}
            <p className="flex items-center text-xs text-gray-500">
              Now •
              <span className="ml-1">
                <GlobeHemisphereWest weight="fill" />
              </span>
            </p>
          </div>
        </div>

        <div className="px-4">
          <ContentViewer postId={postId} value={content} />
        </div>

        {downloadUrl && (
          <div className="mt-2 flex items-center justify-center">
            {renderContent()}
          </div>
        )}

        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            {[
              {
                name: "Like",
                icon: <LikeIcon width={20} height={20} />,
              },
              {
                name: "Comment",
                icon: <CommentIcon width={20} height={20} />,
              },
              { name: "Repost", icon: <RepostIcon width={14} height={14} /> },
              {
                name: "Send",
                icon: <SendIcon width={20} height={20} />,
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
