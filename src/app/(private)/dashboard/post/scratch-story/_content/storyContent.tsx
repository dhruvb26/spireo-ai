"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { ScratchStoryForm } from "@/components/forms/scratch-story-form";
import { GeneratedContent } from "@/components/generated-content";
import { scratchStoryFormSchema } from "@/components/forms/scratch-story-form";

type StoryContent = z.infer<typeof scratchStoryFormSchema>;

const ScratchStoryContent = () => {
  const searchParams = useSearchParams();
  const [idea, setIdea] = useState<string | null>(null);
  const [linkedInPost, setLinkedInPost] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStreamComplete, setIsStreamComplete] = useState(false);
  const decoder = useRef(new TextDecoder());

  useEffect(() => {
    setIdea(searchParams.get("idea"));
  }, [searchParams]);

  const handleSubmit = (data: StoryContent) => {
    setIsLoading(true);
    setError(null);
    setLinkedInPost("");
    setIsStreamComplete(false);

    fetch("/api/ai/scratch-story", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to submit story");
        }
        return response.body?.getReader();
      })
      .then((reader) => {
        if (!reader) {
          throw new Error("Failed to read response");
        }

        const readStream = () => {
          reader.read().then(({ done, value }) => {
            if (done) {
              setIsStreamComplete(true);
              setIsLoading(false);
              return;
            }
            const chunkText = decoder.current.decode(value);
            setLinkedInPost((prev) => prev + chunkText);
            readStream();
          });
        };

        readStream();
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error submitting story:", err);
        setIsLoading(false);
      });
  };

  return (
    <main>
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-brand-gray-900">
          Craft Your Original Post
        </h1>
        <p className="text-sm text-brand-gray-500">
          Let AI inspire your creativity from a blank canvas.
        </p>
      </div>
      <div className="flex w-full flex-grow flex-col gap-8 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <ScratchStoryForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            initialPostContent={idea || ""}
          />
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
    </main>
  );
};

export default ScratchStoryContent;
