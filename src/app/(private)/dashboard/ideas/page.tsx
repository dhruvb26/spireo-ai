"use client";

import { useState } from "react";
import { IdeaForm } from "@/components/forms/idea-form";
import MoonLoader from "react-spinners/MoonLoader";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { BookmarkSimple, HardDrive } from "@phosphor-icons/react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { saveIdea } from "@/app/actions/idea";
import { v4 as uuid } from "uuid";
import { PaperPlaneTilt } from "@phosphor-icons/react/dist/ssr";

export default function IdeasPage() {
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
    <>
      <div className="max-w-6xl">
        <div className="container space-y-2 px-4 text-left md:px-6">
          <h1 className="text-3xl font-bold tracking-tighter text-brand-gray-900 ">
            Out of Ideas? We've Got You Covered
          </h1>
          <p className="text-md mx-auto text-brand-gray-500 ">
            Generate fresh ideas for your next blog post, social media campaign,
            or marketing strategy. Our AI-powered idea generator will help you
            break through writer's block and get your creative juices flowing.
          </p>
        </div>

        <section className="py-12">
          <div className="container flex w-full flex-col items-start justify-center space-x-4 md:flex-row">
            <div className="md:w-1/2">
              <IdeaForm
                onIdeasGenerated={handleIdeasGenerated}
                onLoading={handleLoading}
              />
            </div>
            <div className="flex h-[400px] items-center justify-center rounded-lg border border-brand-gray-200 bg-white p-6 shadow-md md:w-1/2">
              {isLoading ? (
                <MoonLoader size={"50"} color="#333333" loading={isLoading} />
              ) : ideas.length === 0 ? (
                <div className="text-center">
                  <HardDrive className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <p className="text-gray-500">No ideas generated yet.</p>
                </div>
              ) : (
                <ScrollArea className="h-full w-full  pr-4">
                  {ideas.map((idea, index) => (
                    <div
                      key={index}
                      className="group relative mb-6 rounded-lg border border-brand-gray-200 bg-brand-gray-25 p-4 shadow-sm"
                    >
                      <p className="mb-4 text-left italic">{idea}</p>
                      <div className="icon-container hidden space-x-2 group-hover:flex">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                href={`post/scratch-story?idea=${encodeURIComponent(idea)}`}
                                className="text-brand-purple-500 transition-colors hover:text-brand-purple-700"
                              >
                                <PaperPlaneTilt className="h-5 w-5" />
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
                                className="text-brand-purple-500 transition-colors hover:text-brand-purple-700"
                              >
                                <BookmarkSimple className="h-5 w-5" />
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
        </section>
      </div>
    </>
  );
}
