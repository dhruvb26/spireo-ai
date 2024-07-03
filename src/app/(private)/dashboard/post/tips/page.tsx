"use client";

import React, { useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { TipsForm } from "@/components/forms/tips-form";
import { GeneratedContent } from "@/components/generated-content";
import { tipsFormSchema } from "@/components/forms/tips-form";
import FadeSeparator from "@/components/ui/fade-separator";

type StoryContent = z.infer<typeof tipsFormSchema>;

const TipsPage = () => {
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

    fetch("/api/ai/share-tips", {
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
              return;
            }
            const chunkText = decoder.current.decode(value);
            if (chunkText.includes("FINAL_RESPONSE:")) {
              const [_, finalResponse] = chunkText.split("FINAL_RESPONSE:");
              setLinkedInPost(finalResponse || "");
              setIsStreamComplete(true);
            } else {
              setLinkedInPost((prev) => prev + chunkText);
              readStream();
            }
          });
        };

        readStream();
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error submitting story:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-2 text-3xl font-bold">Share some tips</h1>
      <p className="text-sm text-slate-500">
        Share any tips with the world. Anything from life hacks to professional
        tips.
      </p>
      <FadeSeparator />
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <TipsForm onSubmit={handleSubmit} isLoading={isLoading} />
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
export default TipsPage;
