"use client";

import React, { useEffect, useState, useMemo } from "react";
import { createEditor, Descendant } from "slate";
import { withReact } from "slate-react";
import { usePostStore } from "@/store/postStore";
import { getDraft, saveDraft } from "@/actions/draft";
import { MdSmartphone, MdTablet, MdLaptop } from "react-icons/md";
import LinkedInPostPreview from "../../_components/linkedin-post";
import { toast } from "sonner";
import EditorSection from "../../_components/editor-section";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { withHistory } from "slate-history";

const deserializeContent = (content: string): Descendant[] => {
  return JSON.parse(content) as Descendant[];
};

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

export default function EditDraft() {
  const { updatePost } = usePostStore();
  const params = useParams();
  const id = params.id as string;
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [value, setValue] = useState<Descendant[]>(initialValue);
  const [documentUrn, setDocumentUrn] = useState<string | null>(null);
  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop">(
    "mobile",
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDraft = async () => {
      setIsLoading(true);
      try {
        const draft = await getDraft(id);
        if (draft.success && draft.data) {
          let newValue: Descendant[];
          if (typeof draft.data.content === "string") {
            try {
              newValue = deserializeContent(draft.data.content);
            } catch (e) {
              newValue = [
                { type: "paragraph", children: [{ text: draft.data.content }] },
              ];
            }
          } else {
            newValue = draft.data.content || initialValue;
          }

          editor.children = newValue;
          editor.onChange();
          setValue(newValue);
          updatePost(id, draft.data.content || "");

          setDocumentUrn(draft.data.documentUrn || null);
        } else {
          setValue(initialValue);
          updatePost(id, "");
          setDocumentUrn(null);
        }
      } catch (error) {
        console.error("Error fetching draft:", error);
        toast.error("An unexpected error occurred while loading the draft");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDraft();
  }, [id, updatePost, editor]);

  const handleSave = async () => {
    try {
      const result = await saveDraft(id, value);
      if (result.success) {
        toast.success("Draft saved successfully");
      } else {
        toast.error("Failed to save draft");
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("An error occurred while saving the draft");
    }
  };
  return (
    <main className="flex">
      {isLoading ? (
        <div className="flex h-screen w-screen items-center justify-center">
          <Loader2 className="ml-1 inline-block h-12 w-12 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="flex w-full flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
          <div className="w-full lg:w-1/2">
            <div className="">
              <EditorSection
                id={id}
                initialValue={value}
                setValue={setValue}
                editor={editor}
                handleSave={handleSave}
                initialDocumentUrn={documentUrn}
              />
            </div>
          </div>
          <div className="w-full rounded bg-blue-50 pb-4 lg:w-1/2">
            <div className="mb-4 mt-7 flex items-center justify-center">
              <div className="flex gap-2">
                <button
                  onClick={() => setDevice("mobile")}
                  className={`rounded-full p-2 ${device === "mobile" ? "text-brand-purple-600" : "text-brand-gray-500"}`}
                >
                  <MdSmartphone size={24} />
                </button>
                <button
                  onClick={() => setDevice("tablet")}
                  className={`rounded-full p-2 ${device === "tablet" ? "text-brand-purple-600" : "text-brand-gray-500"}`}
                >
                  <MdTablet size={24} />
                </button>
                <button
                  onClick={() => setDevice("desktop")}
                  className={`rounded-full p-2 ${device === "desktop" ? "text-brand-purple-600" : "text-brand-gray-500"}`}
                >
                  <MdLaptop size={24} />
                </button>
              </div>
            </div>
            <LinkedInPostPreview postId={id} content={value} device={device} />
          </div>
        </div>
      )}
    </main>
  );
}
