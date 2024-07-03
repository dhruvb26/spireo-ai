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
import PrimaryButton from "@/components/ui/primary-button";

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

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

interface EditorSectionProps {
  value: Descendant[];
  setValue: (value: Descendant[]) => void;
  editor: CustomEditor;
  handleSave: () => void;
}

function EditorSection({
  value,
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
          <PrimaryButton
            className="bg-custom-gray px-[1rem] text-sm hover:bg-slate-500"
            onClick={handleSave}
          >
            Schedule
          </PrimaryButton>
          <PrimaryButton
            className="bg-darker-blue px-[1rem] text-sm"
            onClick={handleSave}
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

export default EditorSection;
