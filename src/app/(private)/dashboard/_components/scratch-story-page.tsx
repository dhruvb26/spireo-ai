"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { ScratchStoryForm } from "@/components/forms/scratch-story-form";
import { GeneratedContent } from "@/components/generated-content";
import { scratchStoryFormSchema } from "@/components/forms/scratch-story-form";
import FadeSeparator from "@/components/ui/fade-separator";

type StoryContent = z.infer<typeof scratchStoryFormSchema>;

const ScratchStoryPage = () => {
  const searchParamsHook = useSearchParams();
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(
    null,
  );
  const [idea, setIdea] = useState<string | null>(null);
  const [linkedInPost, setLinkedInPost] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStreamComplete, setIsStreamComplete] = useState(false);
  const decoder = useRef(new TextDecoder());

  useEffect(() => {
    if (searchParamsHook) {
      setSearchParams(searchParamsHook);
      setIdea(searchParamsHook.get("idea"));
    }
  }, [searchParamsHook]);

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
    <div className="container mx-auto p-4">
      <h1 className="mb-2 text-3xl font-bold">Post from scratch</h1>
      <p className="text-sm text-slate-500">
        Create a post without any help. Use your creativity with AI's help.
      </p>
      <FadeSeparator />
      <div className="flex flex-col gap-8 lg:flex-row">
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
    </div>
  );
};

export default ScratchStoryPage;
