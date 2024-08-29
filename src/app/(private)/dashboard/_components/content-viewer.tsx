"use client";
import React, { useRef, useEffect, useState } from "react";
import { Descendant, Element as SlateElement, Text } from "slate";

interface ContentViewerProps {
  postId: string;
  value: Descendant[];
}

const ContentViewer: React.FC<ContentViewerProps> = ({ value, postId }) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const renderElement = (props: any) => {
    switch (props.element.type) {
      case "paragraph":
        const isEmpty =
          props.element.children.length === 1 &&
          props.element.children[0].text === "";
        return (
          <p className={`${isEmpty ? "h-4" : "mb-0"}`}>{props.children}</p>
        );
      default:
        return <p className="mb-4">{props.children}</p>;
    }
  };

  const renderLeaf = (props: any) => {
    return (
      <span
        style={{
          fontWeight: props.leaf.bold ? "bold" : "normal",
          fontStyle: props.leaf.italic ? "italic" : "normal",
          textDecoration: props.leaf.underline ? "underline" : "none",
        }}
      >
        {props.leaf.text}
      </span>
    );
  };

  const renderNode = (node: Descendant): JSX.Element => {
    if (Text.isText(node)) {
      return renderLeaf({ leaf: node });
    } else if (SlateElement.isElement(node)) {
      return renderElement({
        element: node,
        children: node.children.map((child, index) => (
          <React.Fragment key={index}>{renderNode(child)}</React.Fragment>
        )),
      });
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
    <div className="mb-2">
      <div
        ref={contentRef}
        className={`whitespace-pre-wrap break-words py-2 text-sm text-black ${
          isExpanded ? "" : "max-h-[90px] overflow-hidden"
        }`}
      >
        {value.map((node, index) => (
          <React.Fragment key={index}>{renderNode(node)}</React.Fragment>
        ))}
      </div>
      {isOverflowing && !isExpanded && (
        <button
          onClick={toggleExpand}
          className=" text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          ...more
        </button>
      )}
      {isExpanded && (
        <button
          onClick={toggleExpand}
          className=" text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          See less
        </button>
      )}
    </div>
  );
};

export default ContentViewer;
