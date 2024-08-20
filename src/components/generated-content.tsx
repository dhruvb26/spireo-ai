"use client";

import React, { useState } from "react";
import {
  HardDrive,
  Copy,
  DownloadSimple,
  PencilSimpleLine,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
import { Button } from "./ui/button";
import { saveDraft } from "@/actions/draft";
import { Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [copied, setCopied] = useState(false);

  const handleSave = async () => {
    try {
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
      <div className="flex flex-col rounded-lg border border-brand-gray-200">
        <div className="flex items-center justify-end border-brand-gray-200 p-2 py-1">
          <div className="flex w-full items-center justify-between space-x-1 py-1">
            <div className="flex items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={"sm"}
                      onClick={handleCopy}
                      className="rounded-lg bg-white text-brand-gray-500 hover:bg-white hover:text-brand-gray-900"
                      disabled={!isStreamComplete || copied}
                    >
                      {copied ? (
                        "Copied!"
                      ) : (
                        <Copy weight="duotone" className="h-5 w-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{copied ? "Copied!" : "Copy"}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={"sm"}
                      onClick={handleSave}
                      className="rounded-lg bg-white text-brand-gray-500 hover:bg-white hover:text-brand-gray-900"
                      disabled={!isStreamComplete || copied}
                    >
                      {<DownloadSimple className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <Button
              size={"sm"}
              onClick={handleEdit}
              className="rounded-md bg-blue-600 text-xs hover:bg-blue-700 "
              disabled={!isStreamComplete || copied}
            >
              Edit Post
              {/* <PencilSimpleLine className="ml-1" size={16} /> */}
            </Button>
          </div>
        </div>
        <div className="flex h-[550px] flex-col p-4">
          <ScrollArea className="flex-grow">
            <div className="whitespace-pre-wrap pr-4 text-sm text-gray-700">
              {parseContent(content)}
            </div>
          </ScrollArea>
          {!isStreamComplete && (
            <div className="flex h-full w-full items-center justify-center">
              <Loader2 className="ml-1 inline-block h-12 w-12 animate-spin text-blue-600" />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[600px] items-center justify-center rounded-lg border border-brand-gray-200 bg-white p-6">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-[600px] flex-col items-center justify-center rounded-lg border border-brand-gray-200 bg-white p-6">
      <HardDrive
        weight="duotone"
        className="mx-auto text-brand-gray-500"
        size={42}
      />
      <p className="text-sm text-brand-gray-500">Nothing to see here yet.</p>
    </div>
  );
}
