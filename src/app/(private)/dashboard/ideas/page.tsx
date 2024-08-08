"use client";

import { useState } from "react";
import { IdeaForm } from "@/components/forms/idea-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { BookmarkSimple, HardDrive, ShareFat } from "@phosphor-icons/react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { saveIdea } from "@/actions/idea";
import { v4 as uuid } from "uuid";
import { PaperPlaneTilt } from "@phosphor-icons/react/dist/ssr";
import { Loader2 } from "lucide-react";

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
    <main>
      <div className="mb-2 text-left ">
        <h1 className="text-xl font-semibold tracking-tight text-brand-gray-900 ">
          Out of Ideas? We've Got You Covered
        </h1>
        <p className="text-sm  text-brand-gray-500 ">
          Generate fresh ideas for your next blog post, social media campaign,
          or marketing strategy. Our AI-powered idea generator will help you
          break through writer's block and get your creative juices flowing.
        </p>
      </div>

      <section className="py-12">
        <div className=" flex w-full flex-col items-start justify-center gap-8 md:flex-row">
          <div className="md:w-1/2">
            <IdeaForm
              onIdeasGenerated={handleIdeasGenerated}
              onLoading={handleLoading}
            />
          </div>
          <div className="flex h-[500px] items-center justify-center rounded-lg border border-brand-gray-200 bg-white p-6  md:w-1/2">
            {isLoading ? (
              <Loader2 className="ml-1 inline-block h-12 w-12 animate-spin text-blue-600" />
            ) : ideas.length === 0 ? (
              <div className="text-center">
                <HardDrive
                  weight="duotone"
                  className="mx-auto text-brand-gray-500"
                  size={42}
                />
                <p className="text-sm text-brand-gray-500">
                  Nothing to see here yet.
                </p>
              </div>
            ) : (
              <ScrollArea className="h-full w-full  pr-4">
                {ideas.map((idea, index) => (
                  <div
                    key={index}
                    className="group relative mb-6 rounded-lg border border-brand-gray-200 bg-brand-gray-25 p-4 shadow-sm"
                  >
                    <p className="mb-4 text-left text-sm italic">{idea}</p>
                    <div className="icon-container hidden space-x-2 group-hover:flex">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              href={`post/scratch-story?idea=${encodeURIComponent(idea)}`}
                              className="text-brand-purple-600 transition-colors hover:text-brand-purple-700"
                            >
                              <ShareFat className="h-5 w-5" />
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
                              className="text-brand-purple-600 transition-colors hover:text-brand-purple-700"
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
    </main>
  );
}
