"use client";
import React, { useState, useEffect } from "react";
import { getDrafts, deleteDraft, Draft } from "@/actions/draft";
import { toast } from "sonner";
import { ArrowUpRight } from "@phosphor-icons/react";
import Link from "next/link";
import { ParallaxScroll } from "@/components/ui/parallax-scroll";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const SavedDraftsPage = () => {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "saved" | "scheduled" | "published"
  >("saved");
  const [draftToDelete, setDraftToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchDrafts(activeTab);
  }, [activeTab]);

  const fetchDrafts = async (status: "saved" | "scheduled" | "published") => {
    setIsLoading(true);
    try {
      const result = await getDrafts(status);
      if (result.success) {
        const deserializedDrafts = result.data?.map((draft) => ({
          ...draft,
          content: JSON.parse(draft.content),
        }));
        setDrafts(deserializedDrafts || []);
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      console.error(err.message);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDraft = async () => {
    if (!draftToDelete) return;
    try {
      const result = await deleteDraft(draftToDelete);
      if (result.success) {
        toast.success(result.message);
        setDrafts((prevDrafts) =>
          prevDrafts.filter((draft) => draft.id !== draftToDelete),
        );
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the draft");
    } finally {
      setDraftToDelete(null);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-[30vw] items-center justify-center">
          <Loader2 className="ml-1 inline-block h-12 w-12 animate-spin text-blue-600" />
        </div>
      );
    }

    if (error) {
      return <p className="text-red-500">{error}</p>;
    }

    if (drafts.length === 0) {
      return (
        <div className="flex h-[30vw] flex-col items-center justify-center space-y-4">
          <span className="text-sm text-brand-gray-500">
            No {activeTab} drafts yet. Start generating now!
          </span>
          <Link
            href="/dashboard/post"
            className="flex items-center text-sm text-brand-purple-600 hover:text-brand-purple-700 hover:underline"
          >
            Generate Posts
            <ArrowUpRight className="ml-1" size={14} />
          </Link>
        </div>
      );
    }

    return (
      <ParallaxScroll
        posts={drafts.map((draft) => ({
          ...draft,
          status: draft.status,
          updatedAt: new Date(draft.updatedAt),
        }))}
        onDeleteDraft={(draftId) => setDraftToDelete(draftId)}
      />
    );
  };

  return (
    <main>
      <div className="mb-2 text-left">
        <h1 className="text-xl font-semibold tracking-tight text-brand-gray-900">
          Drafts
        </h1>
        <p className="mx-auto text-sm text-brand-gray-500">
          Manage your drafts here.
        </p>
      </div>

      <Tabs
        defaultValue="saved"
        className="mt-4 rounded-lg"
        onValueChange={(value) =>
          setActiveTab(value as "saved" | "scheduled" | "published")
        }
      >
        <TabsList>
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
        </TabsList>
        <TabsContent value="saved">{renderContent()}</TabsContent>
        <TabsContent value="scheduled">{renderContent()}</TabsContent>
        <TabsContent value="published">{renderContent()}</TabsContent>
      </Tabs>

      <AlertDialog
        open={!!draftToDelete}
        onOpenChange={() => setDraftToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold tracking-tight">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              draft.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg text-sm">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-lg bg-blue-600 text-sm hover:bg-blue-700"
              onClick={handleDeleteDraft}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};

export default SavedDraftsPage;
