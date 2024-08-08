"use client";
import React, { useCallback, useEffect } from "react";
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
import { Slate, Editable, ReactEditor, useSlate, withReact } from "slate-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import ScheduleDialog from "./schedule-dialog";
import { toast } from "sonner";
import EmojiPicker, { SkinTonePickerLocation } from "emoji-picker-react";
import { getUserId } from "@/actions/user";
import Router from "next/router";
import {
  Brain,
  Smiley,
  Sparkle,
  TextB,
  TextItalic,
  TextUnderline,
  X,
} from "@phosphor-icons/react";
import {
  updateDraft,
  updateDraftDocumentUrn,
  removeDraftDocumentUrn,
  deleteDownloadUrl,
} from "@/actions/draft";
import FileAttachmentButton from "./file-attachment-button";
import { Loader2, Send } from "lucide-react";
import { withHistory } from "slate-history";
import { HistoryEditor } from "slate-history";

export const serializeContent = (nodes: Descendant[]): string => {
  return JSON.stringify(nodes);
};

const deserializeContent = (content: string): Descendant[] => {
  return JSON.parse(content) as Descendant[];
};

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
export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

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
  initialValue: string | Descendant[];
  id: string;
  setValue: (value: Descendant[]) => void;
  editor: CustomEditor;
  handleSave: () => void;

  initialDocumentUrn: string | null;
}

function EditorSection({
  initialValue,
  id,
  setValue,
  editor,
  handleSave,
  initialDocumentUrn,
}: EditorSectionProps) {
  const [value, setInternalValue] = useState<Descendant[]>(() => {
    if (typeof initialValue === "string") {
      try {
        return deserializeContent(initialValue);
      } catch (e) {
        // If deserialization fails, treat it as plain text
        return [{ type: "paragraph", children: [{ text: initialValue }] }];
      }
    }
    return initialValue;
  });

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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiSelect = useCallback(
    (emoji: any) => {
      const { selection } = editor;
      if (selection) {
        Transforms.insertText(editor, emoji.emoji, { at: selection });
      } else {
        Transforms.insertText(editor, emoji.emoji, {
          at: Editor.end(editor, []),
        });
      }
      setShowEmojiPicker(false);
    },
    [editor],
  );

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
        setInternalValue(newValue);
        setValue(newValue);
        setCharCount(newCharCount);
      } else {
        // If the new content exceeds 3000 characters, truncate it
        const truncatedContent = content.slice(0, 3000);
        const truncatedValue = [
          { type: "paragraph", children: [{ text: truncatedContent }] },
        ];
        setInternalValue(truncatedValue as Descendant[]);
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
  const [isRewriting, setIsRewriting] = useState(false);
  const [documentUrn, setDocumentUrn] = useState<string | null>(
    initialDocumentUrn,
  );
  const [documentStatus, setDocumentStatus] = useState<string | null>(
    initialDocumentUrn ? "Processing" : null,
  );

  const handleDocumentUploaded = async (urn: string, fileType: string) => {
    setDocumentUrn(urn);
    setDocumentStatus("Processing");

    handleSave();
    const result = await updateDraftDocumentUrn(id, urn);
    if (result.success) {
      if (fileType == "pdf") {
        toast.success(`${fileType.toUpperCase()} uploaded successfully`);
      } else {
        toast.success(`Image uploaded successfully`);
        window.location.reload();
      }
    } else {
      toast.error("Failed to update draft with document URN");
    }
  };

  const handleRemoveDocument = async () => {
    const result = await removeDraftDocumentUrn(id);
    await deleteDownloadUrl(id);
    if (result.success) {
      setDocumentUrn(null);
      setDocumentStatus(null);

      toast.success("Document removed successfully");
      window.location.reload();
    } else {
      toast.error("Failed to remove document from draft");
    }
  };

  const customStyles = {
    "--epr-emoji-size": "24px",
    "--epr-picker-border-radius": "4px",
    "--epr-emoji-gap": "8px",
    "--epr-hover-bg-color": "#f0f0f0",
    "--epr-bg-color": "#ffffff",
    "--epr-category-label-bg-color": "#ffffff",
    "--epr-text-color": "#101828",
    "--epr-category-icon-active-color": "#ffffff",
    "--epr-search-input-bg-color": "#dbeafe",
    "--epr-search-input-text-color": "#1d4ed8",
    "--epr-search-input-placeholder-color": "#2563eb",
    "--epr-category-navigation-button-size": "0px",
    "--epr-preview-height": "50px",
  } as React.CSSProperties;

  const handlePublish = async () => {
    setIsPublishing(true);

    try {
      const userId = await getUserId();
      if (!userId) {
        toast.error("User not authenticated");
        return;
      }

      const postContent = serializeContent(value);

      const publishData: any = {
        userId: userId,
        postId: id,
        content: postContent,
      };

      if (documentUrn) {
        publishData.documentUrn = documentUrn;
      }

      const response = await fetch("/api/linkedin/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(publishData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to publish post");
      }

      const result = await response.json();
      await updateDraft(id, "published");
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
    }
  };

  const handleRewrite = useCallback(async () => {
    const { selection } = editor;
    if (!selection || Editor.string(editor, selection) === '') {
      toast.error("Please select some text to rewrite.");
      return;
    }

    setIsRewriting(true);

    const selectedText = Editor.string(editor, selection);
    const fullContent = extractContent(value);

    try {
      const response = await fetch("/api/ai/rewrite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedText,
          fullContent,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to rewrite text");
      }

      const { rewrittenText } = await response.json();

      // Replace the selected text with the rewritten text
      Transforms.delete(editor, { at: selection });
      Transforms.insertText(editor, rewrittenText, { at: selection.anchor });

      toast.success("Text rewritten successfully");
    } catch (error) {
      console.error("Error rewriting text:", error);
      toast.error("Failed to rewrite text");
    } finally {
      setIsRewriting(false);
    }
  }, [editor, value]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!event.ctrlKey && !event.metaKey) return;

      switch (event.key) {
        case "b":
          event.preventDefault();
          CustomEditor.toggleBoldMark(editor);
          break;
        case "i":
          event.preventDefault();
          CustomEditor.toggleItalicMark(editor);
          break;
        case "u":
          event.preventDefault();
          CustomEditor.toggleUnderlineMark(editor);
          break;
        case "z":
          event.preventDefault();
          if (event.shiftKey) {
            editor.redo();
          } else {
            editor.undo();
          }
          break;
        case "y":
          if (event.ctrlKey) {
            event.preventDefault();
            editor.redo();
          }
          break;
      }
    },
    [editor],
  );

  return (
    <>
      <div className="relative">
        <h1 className="text-xl font-semibold tracking-tight text-brand-gray-900">
          Write Post
        </h1>
        <p className="text-sm  text-brand-gray-500 ">
          Craft your new post using our advanced text editor. Utilize our
          AI-powered rewrite feature for assistance when needed.
        </p>
        {documentUrn && (
          <div className="mt-2 flex items-center justify-between rounded-md bg-blue-100 p-2 py-1 text-blue-600">
            <span className="text-xs">
              Your file has been attached to the post.
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    onClick={handleRemoveDocument}
                    className="bg-blue-100 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Remove File</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
        <Slate editor={editor} initialValue={value} onChange={handleChange}>
          <div className="my-2 flex space-x-2">
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

            <FileAttachmentButton
              postId={id}
              onFileUploaded={handleDocumentUploaded}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-600"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Smiley weight="duotone" className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add Emoji</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-600"
                    onClick={handleRewrite}
                    disabled={isRewriting}
                  >
                    <Brain weight="duotone" className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isRewriting ? "Rewriting" : "Rewrite w/ AI"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {showEmojiPicker && (
            <div className="absolute z-10">
              <EmojiPicker
                style={customStyles}
                width={450}
                skinTonePickerLocation={SkinTonePickerLocation.PREVIEW}
                height={450}
                onEmojiClick={handleEmojiSelect}
              />
            </div>
          )}

          <div className="h-[500px] overflow-y-auto">
            <Editable
              onKeyDown={handleKeyDown}
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              className="min-h-full w-full resize-none whitespace-pre-wrap rounded border border-brand-gray-200 p-2 text-sm focus:outline-none focus:ring-0"
            />
          </div>
        </Slate>
        <div className="mt-2 w-full text-right text-xs text-gray-500">
          {charCount}/3000 characters
        </div>
      </div>
      <div className="flex items-center justify-between border-gray-200 py-4">
        <Button
          className="rounded-lg bg-brand-gray-800 px-[1rem] hover:bg-brand-gray-900"
          onClick={handleSave}
          disabled={isPublishing}
        >
          Save Draft
        </Button>
        <div className="flex space-x-2">
          <ScheduleDialog
            documentUrn={documentUrn}
            id={id}
            content={value}
            disabled={isPublishing}
          />
          <Button
            className="rounded-lg bg-brand-purple-600 font-light hover:bg-brand-purple-700"
            onClick={handlePublish}
            disabled={isPublishing}
          >
            {isPublishing ? "Publishing" : "Publish"}
            {isPublishing ? (
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="ml-2 h-4 w-4" />
            )}
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
