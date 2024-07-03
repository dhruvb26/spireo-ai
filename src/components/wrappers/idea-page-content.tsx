// File: components/IdeasPageContent.tsx
"use client";

import { useState } from "react";
import { IdeaForm } from "@/components/forms/idea-form";
import MoonLoader from "react-spinners/MoonLoader";
import FadeSeparator from "../ui/fade-separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Bookmark, HardDrive, SendIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { saveIdea } from "@/app/actions/idea";
import { v4 as uuid } from "uuid";

export function IdeasPageContent() {
  const [ideas, setIdeas] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleIdeasGenerated = (newIdeas: string[]) => {
    setIdeas(newIdeas);
  };

  const handleLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const handleSaveIdea = async (idea: string) => {
    try {
      const content = idea;
      const id = uuid();
      const result = await saveIdea(id, content);
      if (result.success) {
        toast.success(result.message);
      }
    } catch (error) {
      toast.error("Failed to save idea");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-2 text-3xl font-bold">Generate Post Ideas</h1>
      <p className="text-sm text-slate-500">
        Don't know what to post? Generate some ideas here. Stop overthinking and
        start creating.
      </p>
      <FadeSeparator />

      <div className="mt-8 flex flex-col gap-8 md:flex-row">
        <div className="w-full md:w-1/2">
          <IdeaForm
            onIdeasGenerated={handleIdeasGenerated}
            onLoading={handleLoading}
          />
        </div>

        <div className="w-full md:w-1/2">
          <div className="flex h-[400px] items-center justify-center rounded-lg bg-white p-6 shadow-md">
            {isLoading ? (
              <MoonLoader size={"50"} color="#333333" loading={isLoading} />
            ) : ideas.length === 0 ? (
              <div className="text-center">
                <HardDrive className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-gray-500">No ideas generated yet.</p>
              </div>
            ) : (
              <ScrollArea className="h-full w-full pr-4">
                {ideas.map((idea, index) => (
                  <div
                    key={index}
                    className="mb-6 rounded-lg bg-gray-50 p-4 shadow-sm"
                  >
                    <p className="mb-4 text-center italic">
                      &ldquo;{idea}&rdquo;
                    </p>
                    <div className="flex justify-end space-x-4">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              href={`post/scratch-story?idea=${encodeURIComponent(idea)}`}
                              className="text-primary-blue transition-colors hover:text-darker-blue"
                            >
                              <SendIcon className="h-5 w-5" />
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Create post</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => handleSaveIdea(idea)}
                              className="text-primary-blue transition-colors hover:text-darker-blue"
                            >
                              <Bookmark className="h-5 w-5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Save idea</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="mb-4 text-2xl font-bold">Trending Topics</h2>
        <div className="flex flex-wrap gap-2">
          {[
            "#SummerVibes",
            "#TechTrends",
            "#HealthyLiving",
            "#TravelDreams",
          ].map((topic) => (
            <span
              key={topic}
              className="cursor-pointer rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 transition-colors hover:bg-blue-200"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
      <FadeSeparator />
    </div>
  );
}
