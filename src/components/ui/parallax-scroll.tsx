"use client";
import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { PencilSimpleLine, TrashSimple } from "@phosphor-icons/react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Badge } from "./badge";

export const ParallaxScroll = ({
  posts,
  className,
  onDeleteDraft,
}: {
  posts: {
    id: string;
    content: any;
    status: string;
    updatedAt: Date;
  }[];
  className?: string;
  onDeleteDraft: (id: string) => void;
}) => {
  const gridRef = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    container: gridRef,
    offset: ["start start", "end start"],
  });

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const third = Math.ceil(posts.length / 3);

  const firstPart = posts.slice(0, third);
  const secondPart = posts.slice(third, 2 * third);
  const thirdPart = posts.slice(2 * third);

  const renderContent = (content: any) => {
    const maxLength = 100; // Adjust this value to change the cutoff point
    let totalLength = 0;
    let truncatedContent = [];

    for (let node of content) {
      if (node.type === "paragraph") {
        for (let child of node.children) {
          if (totalLength + child.text.length <= maxLength) {
            truncatedContent.push(child.text);
            totalLength += child.text.length;
          } else {
            const remainingSpace = maxLength - totalLength;
            truncatedContent.push(child.text.slice(0, remainingSpace));
            truncatedContent.push("...");
            return truncatedContent.join(" ");
          }
        }
      }
    }

    return truncatedContent.join(" ");
  };

  const PostCard = ({ post, translateY }: { post: any; translateY: any }) => (
    <motion.div
      style={{ y: translateY }}
      className="mb-6 rounded-lg border border-brand-gray-200 bg-white p-4 shadow-sm"
    >
      <div className="mb-3 flex items-center">
        <div>
          <p className="text-xs text-brand-gray-500">
            Updated • {post.updatedAt.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mb-4 text-sm text-brand-gray-900">
        {renderContent(post.content)}
      </div>

      <div className="mb-3 flex items-center justify-between">
        <Badge
          className={
            post.status === "published"
              ? "bg-green-50 text-xs font-normal text-green-600 hover:bg-green-100"
              : "bg-blue-50 text-xs font-normal text-blue-600 hover:bg-blue-100"
          }
        >
          {post.status}
        </Badge>
        {post.status !== "published" && (
          <div className="flex space-x-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/dashboard/draft/${post.id}`}
                    className="text-brand-purple-600 transition-colors hover:text-brand-purple-700"
                  >
                    <PencilSimpleLine className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onDeleteDraft(post.id)}
                    className="text-brand-purple-600 transition-colors hover:text-brand-purple-700"
                  >
                    <TrashSimple className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div
      className={cn("h-[40rem] w-full overflow-y-auto", className)}
      ref={gridRef}
    >
      <div className="grid grid-cols-1 items-start gap-6  py-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="grid gap-6">
          {firstPart.map((post, idx) => (
            <PostCard
              key={`grid-1-${idx}`}
              post={post}
              translateY={translateFirst}
            />
          ))}
        </div>
        <div className="grid gap-6">
          {secondPart.map((post, idx) => (
            <PostCard
              key={`grid-2-${idx}`}
              post={post}
              translateY={translateSecond}
            />
          ))}
        </div>
        <div className="grid gap-6">
          {thirdPart.map((post, idx) => (
            <PostCard
              key={`grid-3-${idx}`}
              post={post}
              translateY={translateThird}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
