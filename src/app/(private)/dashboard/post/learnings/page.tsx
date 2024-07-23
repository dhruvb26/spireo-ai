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
    <div className="max-w-6xl lg:max-w-[85rem]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tighter text-brand-gray-900">
          Develop Your Learning-Focused Post
        </h1>
        <p className="text-md text-brand-gray-500">
          Share valuable insights with your network by creating a
          learning-focused post.
        </p>
      </div>
      <div className="flex flex-grow flex-col gap-8 lg:flex-row">
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
