"use client";

import React from "react";
import { HardDrive } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePostStore } from "@/store/postStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import MoonLoader from "react-spinners/MoonLoader";
import { saveDraft } from "@/app/actions/draft";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";

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

  const handleEdit = async () => {
    try {
      const id = uuid();
      // Add the post to the Zustand store
      addPost(content, id);
      // Navigate to the draft page
      router.push(`/dashboard/draft/${id}`);
    } catch (error) {
      console.error("Error creating draft:", error);
      toast.error("An unexpected error occurred while creating the draft");
    }
  };

  if (isLoading || content) {
    return (
      <div className="flex h-[600px] flex-col rounded-lg  bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-semibold">Your LinkedIn Post</h2>

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
        {isStreamComplete && (
          <div className="mt-6">
            <button
              onClick={handleEdit}
              className="rounded-full bg-primary-blue px-4 py-2 text-sm text-white hover:bg-darker-blue"
            >
              Edit Post
            </button>
            <p className="mt-2 text-sm text-gray-500">
              This post is ready to be shared on LinkedIn. You can edit it or
              copy the content to post it to your profile.
            </p>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[600px] items-center justify-center rounded-lg bg-red-100 p-6 shadow-lg">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-[600px] flex-col items-center justify-center rounded-lg bg-white p-6 shadow-lg">
      <HardDrive className="mx-auto mb-4 h-12 w-12 text-gray-400" />
      <p className="text-lg text-gray-500">Nothing to see here yet.</p>
    </div>
  );
}
