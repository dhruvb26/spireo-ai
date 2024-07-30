"use client";

import React, { useEffect, useState, useMemo } from "react";
import { createEditor, Descendant, Element as SlateElement, Text } from "slate";
import { withReact } from "slate-react";
import { usePostStore } from "@/store/postStore";
import { getDraft, saveDraft } from "@/app/actions/draft";
import { MdSmartphone, MdTablet, MdLaptop } from "react-icons/md";
import LinkedInPostPreview from "../../_components/linkedin-post";
import { toast } from "sonner";
import { MoonLoader } from "react-spinners";
import EditorSection, {
  extractContent,
} from "../../_components/editor-section";
import { useParams } from "next/navigation";

const serializeContent = (nodes: Descendant[]): string => {
  return JSON.stringify(nodes);
};

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
  const params = useParams();
  const id = params.id as string;
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Descendant[]>(initialValue);
  const [documentUrn, setDocumentUrn] = useState<string | null>(null);
  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop">(
    "mobile",
  );
  const [isLoading, setIsLoading] = useState(true);
  const { updatePost } = usePostStore();

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
              // If deserialization fails, treat it as plain text
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
    const serializedContent = serializeContent(value);

    try {
      const result = await saveDraft(id, serializedContent);
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
    <div className="m-0 flex max-w-6xl px-4">
      {isLoading ? (
        <div className="flex h-screen w-full items-center justify-center">
          <MoonLoader size={50} color="#333333" loading={isLoading} />
        </div>
      ) : (
        <div className="flex w-full flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
          <div className="w-full lg:w-1/2">
            <div className="rounded-lg border border-gray-200 shadow-sm">
              <EditorSection
                id={id}
                initialValue={value}
                setValue={setValue}
                editor={editor}
                handleSave={handleSave}
                initialDocumentUrn={documentUrn} // Add this line
              />
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="mb-4 flex items-center justify-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => setDevice("mobile")}
                    className={`rounded-full p-2 ${device === "mobile" ? "text-brand-purple-500" : "text-brand-gray-500"}`}
                  >
                    <MdSmartphone size={24} />
                  </button>
                  <button
                    onClick={() => setDevice("tablet")}
                    className={`rounded-full p-2 ${device === "tablet" ? "text-brand-purple-500" : "text-brand-gray-500"}`}
                  >
                    <MdTablet size={24} />
                  </button>
                  <button
                    onClick={() => setDevice("desktop")}
                    className={`rounded-full p-2 ${device === "desktop" ? "text-brand-purple-500" : "text-brand-gray-500"}`}
                  >
                    <MdLaptop size={24} />
                  </button>
                </div>
              </div>
              <LinkedInPostPreview content={value} device={device} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
