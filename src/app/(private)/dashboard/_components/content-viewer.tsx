"use client";
import React, { useRef, useEffect, useState } from "react";
import { Descendant, Element as SlateElement, Text } from "slate";

interface ContentViewerProps {
  value: Descendant[];
}

const ContentViewer: React.FC<ContentViewerProps> = ({ value }) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const renderNode = (node: Descendant): JSX.Element => {
    if (Text.isText(node)) {
      let style: React.CSSProperties = {};
      if (node.bold) style.fontWeight = "bold";
      if (node.italic) style.fontStyle = "italic";
      if (node.underline) style.textDecoration = "underline";

      return <span style={style}>{node.text}</span>;
    } else if (SlateElement.isElement(node)) {
      if (node.type === "paragraph") {
        return (
          <p>
            {node.children.map((child, index) => (
              <React.Fragment key={index}>{renderNode(child)}</React.Fragment>
            ))}
          </p>
        );
      }
    }
    return <></>;
  };

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
  }, [value]);

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
      >
        {value.map((node, index) => (
          <React.Fragment key={index}>{renderNode(node)}</React.Fragment>
        ))}
      </div>
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
