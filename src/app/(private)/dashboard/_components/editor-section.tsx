"use client";
import React, { useCallback, useRef } from "react";
import {
  Descendant,
  BaseEditor,
  Element as SlateElement,
  Editor,
  Text,
  Transforms,
} from "slate";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Slate, Editable, ReactEditor, useSlate } from "slate-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import ScheduleDialog from "./schedule-dialog";
import { toast } from "sonner";
import { getUserId } from "@/app/actions/user";
import {
  Paperclip,
  Sparkle,
  TextB,
  TextItalic,
  TextUnderline,
  X,
} from "@phosphor-icons/react";
import { updateDraftPublishedStatus } from "@/app/actions/draft";
import FileAttachmentButton from "./file-attachment-button";

export type ParagraphElement = {
  type: "paragraph";
  children: CustomText[];
};

export type HeadingElement = {
  type: "heading";
  level: number;
  children: CustomText[];
};

export type CustomElement = ParagraphElement | HeadingElement;
type FormattedText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};
type CustomText = FormattedText;
export type CustomEditor = BaseEditor & ReactEditor;

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const CustomEditor = {
  isBoldMarkActive(editor: CustomEditor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => Text.isText(n) && n.bold === true,
      universal: true,
    });
    return !!match;
  },

  toggleBoldMark(editor: CustomEditor) {
    const isActive = CustomEditor.isBoldMarkActive(editor);
    Transforms.setNodes(
      editor,
      { bold: isActive ? undefined : true },
      { match: (n) => Text.isText(n), split: true },
    );
  },
  isItalicMarkActive(editor: CustomEditor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => Text.isText(n) && n.italic === true,
      universal: true,
    });
    return !!match;
  },
  toggleItalicMark(editor: CustomEditor) {
    const isActive = CustomEditor.isItalicMarkActive(editor);
    Transforms.setNodes(
      editor,
      { italic: isActive ? undefined : true },
      { match: (n) => Text.isText(n), split: true },
    );
  },
  isUnderlineMarkActive(editor: CustomEditor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => Text.isText(n) && n.underline === true,
      universal: true,
    });
    return !!match;
  },
  toggleUnderlineMark(editor: CustomEditor) {
    const isActive = CustomEditor.isUnderlineMarkActive(editor);
    Transforms.setNodes(
      editor,
      { underline: isActive ? undefined : true },
      { match: (n) => Text.isText(n), split: true },
    );
  },
};

export const extractContent = (value: Descendant[]): string => {
  return value
    .map((n) =>
      SlateElement.isElement(n) ? n.children.map((c) => c.text).join("") : "",
    )
    .join("");
};

interface EditorSectionProps {
  value: Descendant[];
  id: string;
  setValue: (value: Descendant[]) => void;
  editor: CustomEditor;
  handleSave: () => void;
}

function EditorSection({
  value,
  id,
  setValue,
  editor,
  handleSave,
}: EditorSectionProps) {
  const renderElement = useCallback((props: any) => {
    switch (props.element.type) {
      case "paragraph":
        return <p {...props.attributes}>{props.children}</p>;
      default:
        return <p {...props.attributes}>{props.children}</p>;
    }
  }, []);

  const renderLeaf = useCallback((props: any) => {
    return (
      <span
        {...props.attributes}
        style={{
          fontWeight: props.leaf.bold ? "bold" : "normal",
          fontStyle: props.leaf.italic ? "italic" : "normal",
          textDecoration: props.leaf.underline ? "underline" : "none",
        }}
      >
        {props.children}
      </span>
    );
  }, []);

  const [charCount, setCharCount] = useState(0);

  const handleChange = useCallback(
    (newValue: Descendant[]) => {
      const content = newValue
        .map((n) =>
          SlateElement.isElement(n)
            ? n.children.map((c) => c.text).join("")
            : "",
        )
        .join("");
      const newCharCount = content.length;

      if (newCharCount <= 3000) {
        setValue(newValue);
        setCharCount(newCharCount);
      } else {
        // If the new content exceeds 3000 characters, truncate it
        const truncatedContent = content.slice(0, 3000);
        const truncatedValue = [
          { type: "paragraph", children: [{ text: truncatedContent }] },
        ];
        setValue(truncatedValue as Descendant[]);
        setCharCount(3000);

        // Optionally, you can show a toast only when the limit is first reached
        if (charCount < 3000) {
          toast.error(
            "Character limit reached. Maximum 3000 characters allowed.",
          );
        }
      }
    },
    [setValue, charCount],
  );

  const [isPublishing, setIsPublishing] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [documentUrn, setDocumentUrn] = useState<string | null>(null);
  const [documentStatus, setDocumentStatus] = useState<string | null>(null);

  const handleDocumentUploaded = (urn: string, fileType: string) => {
    setDocumentUrn(urn);
    setDocumentStatus("Processing");
    if (fileType == "pdf") {
      toast.success(`${fileType.toUpperCase()} uploaded successfully`);
    }
    toast.success(`${fileType} uploaded successfully`);
  };

  const handleRemoveDocument = () => {
    setDocumentUrn(null);
    setDocumentStatus(null);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    abortControllerRef.current = new AbortController();

    try {
      const userId = await getUserId();
      if (!userId) {
        toast.error("User not authenticated");
        return;
      }

      const postContent = extractContent(value);

      const publishData: any = {
        userId: userId,
        postId: id,
        content: postContent,
      };

      if (documentUrn) {
        publishData.documentUrn = documentUrn;
      }

      const response = await fetch("/api/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(publishData),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to publish post");
      }

      const result = await response.json();
      await updateDraftPublishedStatus(id);
      toast.success("Post published successfully");
    } catch (error: any) {
      if (error.name === "AbortError") {
        toast.info("Publishing cancelled");
      } else {
        console.error("Error publishing post:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to publish post",
        );
      }
    } finally {
      setIsPublishing(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancelPublish = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };
  return (
    <>
      <div className="relative p-4">
        <h1 className="mb-4 text-2xl font-bold tracking-tighter">Write Post</h1>
        {documentUrn && (
          <div className="mb-4 flex items-center justify-between rounded-md bg-blue-200 p-2 text-blue-700">
            <span className="text-sm">
              Your file has been attached to the post. We're working on adding
              it to the preview.
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveDocument}
                    className="bg-blue-200 text-blue-700 hover:bg-blue-200 hover:text-blue-900"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remove file</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
        <Slate editor={editor} initialValue={value} onChange={handleChange}>
          <div className="mb-2 flex space-x-2">
            <ToolbarButton format="bold" icon={<TextB className="h-4 w-4" />} />
            <ToolbarButton
              format="italic"
              icon={<TextItalic className="h-4 w-4" />}
            />
            <ToolbarButton
              format="underline"
              icon={<TextUnderline className="h-4 w-4" />}
            />

            <Separator orientation="vertical" className="h-8" />

            <FileAttachmentButton onFileUploaded={handleDocumentUploaded} />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-blue-500 text-white hover:bg-blue-700 hover:text-white"
                  >
                    <Sparkle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {" "}
                  <p>Rewrite with AI</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="h-[500px] overflow-y-auto rounded-md border border-gray-200">
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              className="min-h-full w-full resize-none whitespace-pre-wrap p-2 focus:outline-none focus:ring-0"
            />
          </div>
        </Slate>
        <div className="mt-2 w-full text-right text-sm text-gray-500">
          {charCount}/3000 characters
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-gray-200 p-4">
        <Button
          className="bg-brand-purple-500 font-light hover:bg-brand-purple-700"
          onClick={handlePublish}
          disabled={isPublishing}
        >
          {isPublishing ? "Publishing..." : "Publish"}
        </Button>
        <div className="flex space-x-2">
          <ScheduleDialog id={id} content={value} disabled={isPublishing} />

          <Button
            className="bg-brand-gray-800 px-[1rem] font-light hover:bg-brand-gray-900"
            onClick={handleSave}
            disabled={isPublishing}
          >
            Save Draft
          </Button>
        </div>
      </div>
    </>
  );
}

const ToolbarButton = ({
  format,

  icon,
}: {
  format: string;
  icon: React.ReactNode;
}) => {
  const editor = useSlate();
  return (
    <Button
      variant="ghost"
      size="icon"
      onMouseDown={(event) => {
        event.preventDefault();
        if (format === "bold") {
          CustomEditor.toggleBoldMark(editor);
        } else if (format === "italic") {
          CustomEditor.toggleItalicMark(editor);
        } else if (format === "underline") {
          CustomEditor.toggleUnderlineMark(editor);
        }
      }}
    >
      {icon}
    </Button>
  );
};

export default EditorSection;
