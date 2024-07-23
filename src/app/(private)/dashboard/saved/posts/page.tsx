"use client";
import React, { useState, useEffect } from "react";
import { getDrafts, deleteDraft, Draft } from "@/app/actions/draft";
import { toast } from "sonner";
import MoonLoader from "react-spinners/MoonLoader";
import { ArrowUpRight } from "@phosphor-icons/react";
import Link from "next/link";
import { ParallaxScroll } from "@/components/ui/parallax-scroll";

const SavedDraftsPage = () => {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    setIsLoading(true);
    try {
      const result = await getDrafts();
      if (result.success) {
        setDrafts(result.data || []);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
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
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the draft");
    }
  };

  return (
    <div className="max-w-6xl lg:max-w-[85rem]">
      <div className="container space-y-2 text-left">
        <h1 className="text-3xl font-bold tracking-tighter text-brand-gray-900">
          Saved Drafts
        </h1>
        <p className="text-md mx-auto text-brand-gray-500">
          Manage your saved drafts here.
        </p>
      </div>

      <div className="mt-4">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <MoonLoader size={50} color="#333333" loading={isLoading} />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : drafts.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <span className="text-brand-gray-500">
              No drafts yet. Start generating now!
            </span>
            <Link
              href="/dashboard/post"
              className="flex items-center text-brand-purple-600 hover:text-brand-purple-700"
            >
              Generate Posts
              <ArrowUpRight className="ml-1" size={14} />
            </Link>
          </div>
        ) : (
          <ParallaxScroll
            posts={drafts.map((draft) => ({
              ...draft,
              status: draft.status,
              updatedAt: new Date(draft.updatedAt), // Ensure updatedAt is a Date object
            }))}
            onDeleteDraft={handleDeleteDraft}
          />
        )}
      </div>
    </div>
  );
};

export default SavedDraftsPage;
