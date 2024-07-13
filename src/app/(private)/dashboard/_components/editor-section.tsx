"use client";
import React, { useCallback } from "react";
import {
  Descendant,
  BaseEditor,
  Element as SlateElement,
  Editor,
  Text,
  Transforms,
} from "slate";
import { Slate, Editable, ReactEditor, useSlate } from "slate-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bold, Italic, Smile, Sparkles } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DatePicker } from "./date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import ContentViewer from "./content-viewer";
import PrimaryButton from "@/components/ui/primary-button";
import { getDraft, saveDraft, scheduleDraft } from "@/app/actions/draft";
import { toast } from "sonner";
import { getUserId } from "@/app/actions/user";

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
};

const extractContent = (value: Descendant[]): string => {
  return value
    .map((n) =>
      SlateElement.isElement(n) ? n.children.map((c) => c.text).join("") : "",
    )
    .join("\n");
};

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

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
        }}
      >
        {props.children}
      </span>
    );
  }, []);

  const [charCount, setCharCount] = useState(0);

  const handleChange = (newValue: Descendant[]) => {
    setValue(newValue);
    const content = newValue
      .map((n) =>
        SlateElement.isElement(n) ? n.children.map((c) => c.text).join("") : "",
      )
      .join("\n");

    setCharCount(content.length);
    if (content.length > 3000) {
      const truncatedContent = content.slice(0, 3000);
      setValue([
        {
          type: "paragraph",
          children: [{ text: truncatedContent }],
        },
      ]);
    }
  };

  const handlePublish = async () => {
    try {
      const userId = await getUserId();
      if (!userId) {
        toast.error("User not authenticated");
        return;
      }

      const postContent = extractContent(value);

      const response = await fetch("api/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          postId: id,
          content: postContent,
          scheduledTime: new Date(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to publish post");
      }

      // const result = await response.json();
      // toast.success("Post published successfully");
    } catch (error) {
      console.error("Error publishing post:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to publish post",
      );
    }
  };

  return (
    <>
      <div className="p-4">
        <h1 className="mb-4 text-xl font-semibold">Write Post</h1>
        <Slate editor={editor} initialValue={value} onChange={handleChange}>
          <div className="flex space-x-2">
            <ToolbarButton format="bold" icon={<Bold className="h-4 w-4" />} />
            <ToolbarButton
              format="italic"
              icon={<Italic className="h-4 w-4" />}
            />

            <Button variant="ghost" size="icon">
              <Smile className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-10" />
            <Button variant="ghost" size="icon">
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-[400px] overflow-y-auto rounded-md border border-gray-200">
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              className="min-h-full w-full resize-none whitespace-pre-wrap p-2 focus:outline-none focus:ring-0"
            />
          </div>
        </Slate>
        <div className="mt-2 text-sm text-gray-500">
          {charCount}/3000 characters
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-gray-200 p-4">
        <PrimaryButton
          className="bg-custom-gray px-[1rem] text-sm hover:bg-slate-500"
          onClick={handleSave}
        >
          Save Draft
        </PrimaryButton>
        <div className="flex space-x-2">
          <ScheduleDialog id={id} content={value} />
          <PrimaryButton
            className="bg-darker-blue px-[1rem] text-sm"
            onClick={handlePublish}
          >
            Publish
          </PrimaryButton>
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
        }
      }}
    >
      {icon}
    </Button>
  );
};

const ScheduleDialog = ({ content, id }: { content: any; id: string }) => {
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined);
  const [postName, setPostName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSchedule = async () => {
    if (!scheduleDate) {
      console.error("Please select both date and time");
      return;
    }

    const postContent = extractContent(content);

    setIsLoading(true);

    try {
      const response = await scheduleDraft(id, postContent, scheduleDate);

      if (response.success) {
        toast.success("Draft scheduled successfully");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error scheduling draft:", error);
    } finally {
      setIsLoading(true);
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date);
      if (scheduleDate) {
        newDate.setHours(scheduleDate.getHours());
        newDate.setMinutes(scheduleDate.getMinutes());
      }
      setScheduleDate(newDate);
    } else {
      setScheduleDate(undefined);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(":").map(Number);
    if (scheduleDate) {
      const newDate = new Date(scheduleDate);
      newDate.setHours(hours || 0);
      newDate.setMinutes(minutes || 0);
      setScheduleDate(newDate);
    } else {
      const newDate = new Date();
      newDate.setHours(hours || 0);
      newDate.setMinutes(minutes || 0);
      setScheduleDate(newDate);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-custom-gray px-[1rem] text-sm font-normal hover:bg-slate-500">
          Schedule
        </Button>
      </DialogTrigger>
      <DialogContent aria-description="schedule" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Schedule Post</DialogTitle>
        </DialogHeader>
        <div className="grid w-fit gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="postName" className="text-right">
              Post Name
            </Label>
            <Input
              id="postName"
              value={postName}
              onChange={(e) => setPostName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <DatePicker selected={scheduleDate} onSelect={handleDateChange} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Time
            </Label>
            <Input
              id="time"
              type="time"
              value={
                scheduleDate ? scheduleDate.toTimeString().slice(0, 5) : ""
              }
              onChange={handleTimeChange}
              className="col-span-3"
            />
          </div>
        </div>
        <Button
          className="rounded-full bg-custom-gray hover:bg-gray-400"
          disabled={isLoading}
          onClick={handleSchedule}
        >
          Schedule Post
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default EditorSection;
