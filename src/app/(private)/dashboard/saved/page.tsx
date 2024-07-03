"use client";
import React, { useState, useEffect } from "react";
import FadeSeparator from "@/components/ui/fade-separator";
import { getIdeas, deleteIdea, Idea } from "@/app/actions/idea";
import { getDrafts, deleteDraft, Draft } from "@/app/actions/draft";
import { toast } from "sonner";
import MoonLoader from "react-spinners/MoonLoader";
import { Trash2Icon, PenIcon } from "lucide-react";
import Link from "next/link";
import { SendIcon } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { usePostStore } from "@/store/postStore";

const SavedContentPage = () => {
  const [activeTab, setActiveTab] = useState("ideas");
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleTabChange = (tab: string) => {
    setIsLoading(true);
    setActiveTab(tab);
  };

  const { addPost, updatePost, clearPosts } = usePostStore();

  useEffect(() => {
    if (activeTab === "ideas") {
      fetchIdeas();
    } else {
      fetchDrafts();
    }
  }, [activeTab]);

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

  const fetchDrafts = async () => {
    setIsLoading(true);
    try {
      const result = await getDrafts();
      if (result.success) {
        setDrafts(result.data || []);
        clearPosts();
        result.data?.forEach((draft) => {
          addPost(draft.content, draft.id);
        });
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

  const handleDeleteDraft = async (draftId: string) => {
    try {
      const result = await deleteDraft(draftId);
      if (result.success) {
        toast.success(result.message);
        setDrafts((prevDrafts) =>
          prevDrafts.filter((draft) => draft.id !== draftId),
        );
        updatePost(draftId, "");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the draft");
    }
  };

  return (
    <div className="container mx-auto flex flex-col p-4">
      <h1 className="mb-2 text-3xl font-bold">Saved Content</h1>
      <p className="mb-4 text-sm text-slate-500">
        Here is a list of all the content you have saved.
      </p>

      <div className="mb-4 flex">
        <button
          className={`mr-2 rounded-full px-4 py-2 ${
            activeTab === "ideas"
              ? "bg-primary-blue text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => handleTabChange("ideas")}
        >
          Saved Ideas
        </button>
        <button
          className={`rounded-full px-4 py-2 ${
            activeTab === "posts"
              ? "bg-primary-blue text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => handleTabChange("posts")}
        >
          Saved Posts
        </button>
      </div>

      <FadeSeparator />
      <div className="mt-4">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <MoonLoader size={50} color="#333333" loading={isLoading} />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : activeTab === "ideas" ? (
          ideas.length === 0 ? (
            <div className="flex justify-center">
              <p className="text-custom-gray">No saved ideas yet.</p>
            </div>
          ) : (
            <ul className="mt-4 space-y-4">
              {ideas.map((idea) => (
                <li
                  key={idea.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-4 shadow-sm"
                >
                  <div className="flex flex-col">
                    <p className="mb-2">{idea.content}</p>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(idea.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={`post/scratch-story?idea=${encodeURIComponent(idea.content)}`}
                            className="text-primary-blue transition-colors hover:text-darker-blue"
                          >
                            <SendIcon className="h-5 w-5" />
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
                            className="text-primary-blue transition-colors hover:text-darker-blue"
                          >
                            <Trash2Icon className="h-5 w-5" />
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
          )
        ) : drafts.length === 0 ? (
          <div className="flex justify-center">
            <p className="text-custom-gray">No saved posts yet.</p>
          </div>
        ) : (
          <ul className="mt-4 space-y-4">
            {drafts.map((draft) => (
              <li
                key={draft.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-4 shadow-sm"
              >
                <div className="flex flex-col">
                  <p className="mb-2">{draft.content.substring(0, 100)}...</p>
                  <p className="text-sm text-gray-500">
                    Last updated:{" "}
                    {new Date(draft.updatedAt).toLocaleTimeString()}{" "}
                    {new Date(draft.updatedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={`/dashboard/draft/${draft.id}`}
                          className="text-primary-blue transition-colors hover:text-darker-blue"
                        >
                          <PenIcon className="h-5 w-5" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit draft</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleDeleteDraft(draft.id)}
                          className="text-primary-blue transition-colors hover:text-darker-blue"
                        >
                          <Trash2Icon className="h-5 w-5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete draft</p>
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

export default SavedContentPage;
