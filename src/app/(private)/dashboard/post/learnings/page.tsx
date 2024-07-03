"use client";

import React, { useState, useRef } from "react";
import { z } from "zod";
import { LearningForm } from "@/components/forms/learnings-form";
import { GeneratedContent } from "@/components/generated-content";
import { learningFormSchema } from "@/components/forms/learnings-form";
import FadeSeparator from "@/components/ui/fade-separator";

type StoryContent = z.infer<typeof learningFormSchema>;

const LearningPage = () => {
  const [linkedInPost, setLinkedInPost] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStreamComplete, setIsStreamComplete] = useState(false);
  const decoder = useRef(new TextDecoder());

  const handleSubmit = (data: StoryContent) => {
    setIsLoading(true);
    setError(null);
    setLinkedInPost("");
    setIsStreamComplete(false);

    fetch("/api/ai/learning-story", {
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
      <h1 className="mb-2 text-3xl font-bold">Share your learnings</h1>
      <p className="text-sm text-slate-500">
        Share your learnings with the world. Knowledge grows when shared.
      </p>
      <FadeSeparator />
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <LearningForm onSubmit={handleSubmit} isLoading={isLoading} />
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

export default LearningPage;
