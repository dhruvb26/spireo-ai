"use client";
import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Pencil, TrashSimple } from "@phosphor-icons/react";
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
    content: string;
    status: string;
    updatedAt: Date; // Changed from string to Date
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

  const PostCard = ({ post, translateY }: { post: any; translateY: any }) => (
    <motion.div
      style={{ y: translateY }}
      className="rounded-lg border border-brand-gray-200 bg-brand-gray-25 p-4 shadow-sm"
    >
      <div className="flex flex-col">
        <p className="mb-2 line-clamp-3">{post.content}</p>
        <p className="text-sm text-gray-500">
          Last updated: {post.updatedAt.toLocaleString()}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-end space-x-4">
        {post.status === "published" ? (
          <Badge className="bg-green-500 hover:bg-green-500">published</Badge>
        ) : (
          <Badge className="bg-blue-700 hover:bg-blue-700">{post.status}</Badge>
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/dashboard/draft/${post.id}`}
                className="text-brand-purple-600 transition-colors hover:text-brand-purple-700"
              >
                <Pencil className="h-5 w-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit draft</p>
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
              <p>Delete draft</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  );

  return (
    <div
      className={cn("h-[40rem] w-full items-start overflow-y-auto", className)}
      ref={gridRef}
    >
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-10 px-2 py-2 md:grid-cols-2 lg:grid-cols-3">
        <div className="grid gap-10">
          {firstPart.map((post, idx) => (
            <PostCard
              key={`grid-1-${idx}`}
              post={post}
              translateY={translateFirst}
            />
          ))}
        </div>
        <div className="grid gap-10">
          {secondPart.map((post, idx) => (
            <PostCard
              key={`grid-2-${idx}`}
              post={post}
              translateY={translateSecond}
            />
          ))}
        </div>
        <div className="grid gap-10">
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
