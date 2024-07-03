import React, { useRef, useEffect, useState } from "react";
import { Descendant, Element as SlateElement, Text } from "slate";

interface ContentViewerProps {
  value: Descendant[];
}

type FormattedText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

const ContentViewer: React.FC<ContentViewerProps> = ({ value }) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const renderNode = (node: Descendant): string => {
    if (Text.isText(node)) {
      const formattedText = node as FormattedText;
      let formattedString = node.text;
      if (formattedText.bold) {
        formattedString = `<strong>${formattedString}</strong>`;
      }
      if (formattedText.italic) {
        formattedString = `<em>${formattedString}</em>`;
      }
      if (formattedText.underline) {
        formattedString = `<u>${formattedString}</u>`;
      }
      return formattedString;
    } else if (SlateElement.isElement(node)) {
      const childContent = node.children.map(renderNode).join("");
      if (node.type === "paragraph") {
        return `<p>${childContent}</p>`;
      }
      return childContent;
    }
    return "";
  };

  const content = value.map(renderNode).join("");

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        setIsOverflowing(
          contentRef.current.scrollHeight > contentRef.current.clientHeight,
        );
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => window.removeEventListener("resize", checkOverflow);
  }, [content]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mb-4">
      <div
        ref={contentRef}
        className={`whitespace-pre-wrap break-words py-2 font-sans text-sm ${
          isExpanded ? "" : "max-h-[100px] overflow-hidden"
        }`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {isOverflowing && !isExpanded && (
        <button
          onClick={toggleExpand}
          className="mt-2 text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          ...see more
        </button>
      )}
      {isExpanded && (
        <button
          onClick={toggleExpand}
          className="mt-2 text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          See less
        </button>
      )}
    </div>
  );
};

export default ContentViewer;
