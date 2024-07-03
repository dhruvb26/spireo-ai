"use client";

import React, { useState, useRef } from "react";
import { GeneratedContent } from "@/components/generated-content";
import { ShareStoryForm } from "@/components/forms/share-story-form";
import { shareStoryFormSchema } from "@/components/forms/share-story-form";
import { z } from "zod";
import FadeSeparator from "@/components/ui/fade-separator";

type StoryContent = z.infer<typeof shareStoryFormSchema>;

const ShareStoryPage = () => {
  const [linkedInPost, setLinkedInPost] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStreamComplete, setIsStreamComplete] = useState(false);
  const decoder = useRef(new TextDecoder());

  const handleSubmit = async (data: StoryContent) => {
    setIsLoading(true);
    setError(null);
    setLinkedInPost("");
    setIsStreamComplete(false);

    try {
      const response = await fetch("/api/ai/share-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit story");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to read response");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          setIsStreamComplete(true);
          break;
        }
        const chunkText = decoder.current.decode(value);
        if (chunkText.includes("FINAL_RESPONSE:")) {
          const [_, finalResponse] = chunkText.split("FINAL_RESPONSE:");
          setLinkedInPost(finalResponse || "");
          setIsStreamComplete(true);
          break;
        } else {
          setLinkedInPost((prev) => prev + chunkText);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error submitting story:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-2 text-3xl font-bold">Share your story</h1>
      <p className="text-sm text-slate-500">
        Share your story with the world. Be it personal or professional.
      </p>
      <FadeSeparator />
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <ShareStoryForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        <div className="w-full lg:w-1/2">
          <GeneratedContent
            isLoading={isLoading}
            content={linkedInPost}
            error={error}
            isStreamComplete={isStreamComplete}
          />
        </div>
      </div>
    </div>
  );
};
export default ShareStoryPage;
