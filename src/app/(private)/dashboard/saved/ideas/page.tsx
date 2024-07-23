"use client";
import React, { useState, useEffect } from "react";
import { getIdeas, deleteIdea, Idea } from "@/app/actions/idea";
import { toast } from "sonner";
import MoonLoader from "react-spinners/MoonLoader";
import { Trash2Icon, SendIcon } from "lucide-react";
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
  Trash,
  TrashSimple,
} from "@phosphor-icons/react";

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
    <div className="max-w-6xl lg:max-w-[85rem]">
      <div className="container space-y-2 text-left">
        <h1 className="text-3xl font-bold tracking-tighter text-brand-gray-900">
          Saved Ideas
        </h1>
        <p className="text-md mx-auto text-brand-gray-500">
          Manage your saved ideas here.
        </p>
      </div>

      <div className="mt-4 ">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <MoonLoader size={50} color="#333333" loading={isLoading} />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : ideas.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <span className=" text-brand-gray-500">
              No ideas yet. Start generating now!
            </span>
            <Link
              href="/dashboard/ideas"
              className="flex items-center text-brand-purple-600 hover:text-brand-purple-700"
            >
              Generate Ideas
              <ArrowUpRight className="ml-1" size={14} />
            </Link>
          </div>
        ) : (
          <ul className="mt-4 space-y-4 px-8">
            {ideas.map((idea) => (
              <li
                key={idea.id}
                className="flex items-center justify-between rounded-lg border border-brand-gray-200 bg-brand-gray-25 p-4 shadow-sm"
              >
                <div className="flex flex-col">
                  <p className="mb-2 text-brand-gray-900">{idea.content}</p>
                  <p className="text-sm text-brand-gray-500">
                    Created: {new Date(idea.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={`/dashboard/post/scratch-story?idea=${encodeURIComponent(idea.content)}`}
                          className="text-brand-purple-500 transition-colors hover:text-brand-purple-700"
                        >
                          <PaperPlaneTilt className="h-5 w-5" />
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
                          className="text-brand-purple-500 transition-colors hover:text-brand-purple-700"
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
    </div>
  );
};

export default SavedIdeasPage;
