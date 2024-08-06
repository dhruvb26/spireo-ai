"use client";

import React, { useState } from "react";
import {
  HardDrive,
  Copy,
  PencilSimple,
  DownloadSimple,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { usePostStore } from "@/store/postStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import MoonLoader from "react-spinners/MoonLoader";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
import { Button } from "./ui/button";
import { saveDraft, updateDraftPublishedStatus } from "@/app/actions/draft";
import { getUserId } from "@/app/actions/user";

interface GeneratedContentProps {
  isLoading: boolean;
  content: string;
  error: string | null;
  isStreamComplete: boolean;
}

const parseContent = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    } else if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
};

export function GeneratedContent({
  isLoading,
  content,
  error,
  isStreamComplete,
}: GeneratedContentProps) {
  const router = useRouter();
  const { addPost } = usePostStore();
  const [copied, setCopied] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const userId = await getUserId();
      if (!userId) {
        toast.error("User not authenticated");
        return;
      }

      const postContent = content;
      const id = uuid();

      const publishData: any = {
        userId: userId,
        postId: id,
        content: postContent,
      };

      const response = await fetch("/api/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(publishData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to publish post");
      }

      const result = await response.json();
      await updateDraftPublishedStatus(id);
      toast.success("Post published successfully");
    } catch (error: any) {
      if (error.name === "AbortError") {
        toast.info("Publishing cancelled");
      } else {
        console.error("Error publishing post:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to publish post",
        );
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSave = async () => {
    setIsPublishing(true);
    try {
      const savedContent = content;
      const id = uuid();
      const result = await saveDraft(id, content);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("An unexpected error occurred while saving the draft");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleEdit = async () => {
    try {
      const id = uuid();
      const result = await saveDraft(id, content);
      if (result.success) {
        toast.success(result.message);
        router.push(`/dashboard/draft/${id}`);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error creating draft:", error);
      toast.error("An unexpected error occurred while creating the draft");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      toast.success("Content copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (isLoading || content) {
    return (
      <div className="flex flex-col rounded-lg border border-brand-gray-200 bg-white shadow-lg">
        <div className="flex items-center justify-between border-b  border-brand-gray-200 p-2">
          <div className="flex flex-col px-2">
            <h2 className="text-xl font-bold tracking-tighter text-brand-gray-900">
              Generated Post
            </h2>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Button
              size={"sm"}
              onClick={handleCopy}
              className="rounded-lg bg-brand-gray-100 text-brand-gray-700 hover:bg-brand-gray-200"
              disabled={!isStreamComplete || copied || isPublishing}
            >
              {copied ? "Copied!" : <Copy className="h-4 w-4" />}
            </Button>
            {/* <Button
              size={"sm"}
              onClick={handleSave}
              className="rounded-lg bg-brand-gray-100 text-brand-gray-700 hover:bg-brand-gray-200"
              disabled={!isStreamComplete || copied || isPublishing}
            >
              {<DownloadSimple className="h-4 w-4" />}
            </Button> */}
            <Button
              size={"sm"}
              onClick={handlePublish}
              className="rounded-lg bg-brand-purple-500 text-white hover:bg-brand-purple-700"
              disabled={!isStreamComplete || isPublishing}
            >
              {isPublishing ? "Publishing..." : "Publish"}
            </Button>
            <Button
              size={"sm"}
              onClick={handleEdit}
              className="rounded-lg bg-brand-purple-500 text-white hover:bg-brand-purple-700"
              disabled={!isStreamComplete || isPublishing}
            >
              Edit
            </Button>
          </div>
        </div>
        <div className="flex h-[550px] flex-col p-6">
          <ScrollArea className="flex-grow">
            <div className="whitespace-pre-wrap text-gray-700">
              {parseContent(content)}
            </div>
          </ScrollArea>
          {!isStreamComplete && (
            <div className="flex h-full w-full items-center justify-center">
              <MoonLoader size={"50"} color="#333333" loading={isLoading} />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[600px] items-center justify-center rounded-lg bg-red-100 p-6 shadow-lg">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-[600px] flex-col items-center justify-center rounded-lg border border-brand-gray-200 bg-white p-6 shadow-lg">
      <HardDrive className="mx-auto mb-4 h-12 w-12 text-gray-400" />
      <p className="text-lg text-gray-500">Nothing to see here yet.</p>
    </div>
  );
}
