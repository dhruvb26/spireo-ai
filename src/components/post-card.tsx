"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  GlobeHemisphereWest,
  DotsThree,
  CaretDown,
  CaretUp,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ReactionGrid from "./reaction-grid";
import { v4 as uuid } from "uuid";
import ContentViewer from "@/app/(private)/dashboard/_components/content-viewer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { saveDraft } from "@/actions/draft";

const PdfViewerComponent = dynamic(
  () => import("../app/(private)/dashboard/_components/PdfViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center">
        <Loader2 className="mb-2 h-4 w-4 animate-spin text-blue-600" />
      </div>
    ),
  },
);

interface PostCardProps {
  post: {
    id: string;
    creatorId: string;
    images?: { url: string }[];
    document?: Record<string, any> | null;
    video?: Record<string, any> | null;
    numAppreciations: number;
    numComments: number;
    numEmpathy: number;
    numInterests: number;
    numLikes: number;
    numReposts: number;
    postUrl: string;
    reshared: boolean;
    text: string;
    time: string;
    urn: string;
    createdAt: string;
    updatedAt: string;
    creator: {
      id: string;
      profile_url: string;
      full_name: string;
      profile_image_url: string;
      headline: string;
    };
  };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop">(
    "desktop",
  );
  const [showContent, setShowContent] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
    if (post.images && post.images.length > 0) {
      return (
        <img
          src={post.images[0]?.url}
          alt="Post image"
          className="h-auto w-full object-contain"
        />
      );
    } else if (post.document) {
      return (
        <PdfViewerComponent
          title="PDF Document"
          file={post.document.url}
          device={device}
        />
      );
    } else if (post.video) {
      return (
        <video src={post.video.stream_url} controls className="h-auto w-full">
          Your browser does not support the video tag.
        </video>
      );
    }
    return null;
  };

  const handleClick = async () => {
    const id = uuid();
    try {
      const result = await saveDraft(id, post.text);
      if (result.success) {
        window.location.href = `/dashboard/draft/${id}`;
      } else {
        console.error("Failed to save draft:", result.message);
      }
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div ref={containerRef} className="w-full rounded bg-white shadow">
        <div className="flex items-center justify-between p-4 py-2">
          <div className="flex items-center">
            <div className="relative mr-2 h-12 w-12 flex-shrink-0">
              <Image
                height={48}
                width={48}
                src={post.creator.profile_image_url || "/placeholder.svg"}
                alt="Profile"
                className="h-full w-full rounded-full object-cover"
                quality={100}
              />
            </div>
            <div className="min-w-0 flex-grow">
              <p className="truncate text-sm font-semibold text-black">
                {post.creator.full_name}
              </p>
              {post.creator.headline && (
                <p className="line-clamp-2 w-full overflow-hidden text-ellipsis text-xs font-normal text-brand-gray-500">
                  {post.creator.headline}
                </p>
              )}
              <p className="flex items-center text-xs text-gray-500">
                {post.time} •
                <span className="ml-1">
                  <GlobeHemisphereWest weight="fill" />
                </span>
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <DotsThree size={24} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <a
                  href={post.creator.profile_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Profile
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a
                  href={post.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Post
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="px-4">
          <ContentViewer
            postId={post.id}
            value={[{ type: "paragraph", children: [{ text: post.text }] }]}
          />
        </div>

        {(post.images || post.document || post.video) && (
          <div className="mt-2 px-4">
            <Button
              variant="ghost"
              onClick={() => setShowContent(!showContent)}
              className="flex items-center text-blue-600"
            >
              {showContent ? "See less" : "See more"}
              {showContent ? (
                <CaretUp className="ml-1" />
              ) : (
                <CaretDown className="ml-1" />
              )}
            </Button>
          </div>
        )}

        {showContent && renderContent()}
        <ReactionGrid
          numLikes={post.numLikes}
          numEmpathy={post.numEmpathy}
          numInterests={post.numInterests}
          numAppreciations={post.numAppreciations}
          numComments={post.numComments}
          numReposts={post.numReposts}
        />
        <div className="mx-4 border-t border-gray-200 py-4">
          <div className="flex items-center justify-between">
            <Button onClick={handleClick}>Edit this Post</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
