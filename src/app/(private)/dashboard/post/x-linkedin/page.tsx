"use client";

import React, { useState, useRef } from "react";
import { XForm } from "@/components/forms/x-form";
import { GeneratedContent } from "@/components/generated-content";
import FadeSeparator from "@/components/ui/fade-separator";
import { z } from "zod";
import { RepurposeFormSchema } from "@/components/forms/youtube-form";

type formContent = z.infer<typeof RepurposeFormSchema>;

const XLinkedInPage = () => {
  const [linkedInPost, setLinkedInPost] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStreamComplete, setIsStreamComplete] = useState(false);
  const decoder = useRef(new TextDecoder());

  const handleSubmit = async (data: formContent) => {
    setIsLoading(true);
    setLinkedInPost("");
    setError(null);
    setIsStreamComplete(false);

    try {
      const response = await fetch("/api/ai/repurpose-content/x", {
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
        setLinkedInPost((prev) => prev + chunkText);
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
      <h1 className="mb-2 text-3xl font-bold">Repurpose Content</h1>
      <p className="text-sm text-slate-500">
        Convert your content from one platform to another.
      </p>
      <FadeSeparator />
      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <XForm onSubmit={handleSubmit} isLoading={isLoading} />
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
export default XLinkedInPage;
