"use client";
import React, { useState, useEffect } from "react";
import { getIdeas, deleteIdea, Idea } from "@/actions/idea";
import { toast } from "sonner";
import Link from "next/link";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  ArrowUpRight,
  PaperPlaneTilt,
  ShareFat,
  Trash,
  TrashSimple,
} from "@phosphor-icons/react";
import { Loader2 } from "lucide-react";

const SavedIdeasPage = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    setIsLoading(true);
    try {
      const result = await getIdeas();
      if (result.success) {
        setIdeas(result.data || []);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteIdea = async (ideaId: string) => {
    try {
      const result = await deleteIdea(ideaId);
      if (result.success) {
        toast.success(result.message);
        setIdeas((prevIdeas) => prevIdeas.filter((idea) => idea.id !== ideaId));
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the idea");
    }
  };

  return (
    <main>
      <div className="mb-2 text-left">
        <h1 className="text-xl font-semibold tracking-tight text-brand-gray-900">
          Saved Ideas
        </h1>
        <p className="mx-auto text-sm text-brand-gray-500">
          Manage your saved ideas here.
        </p>
      </div>

      <div className="mt-4">
        {isLoading ? (
          <div className="flex h-[30vw] items-center justify-center">
            <Loader2 className="ml-1 inline-block h-12 w-12 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : ideas.length === 0 ? (
          <div className="flex h-[30vw] flex-col items-center justify-center space-y-4">
            <span className="text-sm text-brand-gray-500">
              No ideas yet. Start generating now!
            </span>
            <Link
              href="/dashboard/ideas"
              className="flex items-center text-sm text-brand-purple-600 hover:text-brand-purple-700 hover:underline"
            >
              Generate Ideas
              <ArrowUpRight className="ml-1" size={14} />
            </Link>
          </div>
        ) : (
          <ul className="mt-4 space-y-4">
            {ideas.map((idea) => (
              <li
                key={idea.id}
                className="flex max-w-3xl items-center justify-between rounded-lg border border-brand-gray-200 p-4"
              >
                <div className="flex flex-col">
                  <p className="mb-2 text-sm text-brand-gray-900">
                    {idea.content}
                  </p>
                  <p className="text-sm text-brand-gray-500">
                    Created • {new Date(idea.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={`/dashboard/post/scratch-story?idea=${encodeURIComponent(idea.content)}`}
                          className="text-brand-purple-600 transition-colors hover:text-brand-purple-700"
                        >
                          <ShareFat className="h-5 w-5" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Create post</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleDeleteIdea(idea.id)}
                          className="text-brand-purple-600 transition-colors hover:text-brand-purple-700"
                        >
                          <TrashSimple className="h-5 w-5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete idea</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default SavedIdeasPage;
