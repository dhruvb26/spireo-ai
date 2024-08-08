"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Timer } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";

const PostsPage = () => {
  return (
    <main>
      <div className="mb-8 text-left">
        <h1 className="text-xl font-semibold tracking-tight text-brand-gray-900 ">
          Craft Engaging Posts with AI Assistance
        </h1>
        <p className="text-sm text-brand-gray-500 ">
          Choose Your Template Select from our range of AI-powered templates to
          kickstart your post creation process. Whether you're repurposing
          content or starting from scratch, we've got you covered.
        </p>
      </div>

      <div className="container grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/post/youtube-linkedin">
          <div className="group h-full overflow-hidden rounded-lg border border-brand-gray-200 transition-all">
            <img
              src="/YouTube.svg"
              alt="YouTube to LinkedIn"
              className="h-36 w-full p-10 transition-transform group-hover:scale-110"
            />
            <div className="flex h-[calc(100%-144px)] flex-col bg-card p-4 text-brand-gray-900">
              <h3 className="text-md font-semibold tracking-tight">
                YouTube{" "}
                <ArrowRight size={12} className="inline text-brand-gray-900" />{" "}
                LinkedIn
              </h3>
              <p className="mt-2 flex-grow text-sm text-brand-gray-500">
                Transform YouTube content into LinkedIn gold. Just drop the
                video link and watch the magic happen.
              </p>
            </div>
          </div>
        </Link>
        <Link href="">
          <div className="group h-full overflow-hidden rounded-lg border border-brand-gray-200 transition-all">
            <img
              src="/Transcript.svg"
              alt="Transcript to LinkedIn"
              className="h-36 w-full p-10 transition-transform group-hover:scale-110"
            />
            <div className="flex h-[calc(100%-144px)] flex-col bg-card p-4 text-brand-gray-900">
              <h3 className="text-md font-semibold tracking-tight">
                Transcript{" "}
                <ArrowRight size={12} className="inline text-brand-gray-900" />{" "}
                LinkedIn
              </h3>
              <p className="mt-2 flex-grow text-sm text-brand-gray-500">
                Our platform helps you distill key points and create compelling
                content from any transcript.
              </p>
              <Badge
                className={`mr-auto mt-1 space-x-1 bg-blue-50 font-normal text-blue-600 hover:bg-blue-100`}
              >
                <span>Soon</span>
                <Timer weight="duotone" size={16} />
              </Badge>
            </div>
          </div>
        </Link>
        <Link href={"/dashboard/post/scratch-story"}>
          <div className="group h-full overflow-hidden rounded-lg border border-brand-gray-200 transition-all">
            <img
              src="/Writing.svg"
              alt="Write from Scratch"
              className="h-36 w-full p-10 transition-transform group-hover:scale-110"
            />
            <div className="flex h-[calc(100%-144px)] flex-col bg-card p-4 text-brand-gray-900">
              <h3 className="text-md font-semibold tracking-tight">
                Write from Scratch
              </h3>
              <p className="mt-2 flex-grow text-sm text-brand-gray-500">
                Start with a blank canvas and let AI polish your prose for a
                standout post.
              </p>
            </div>
          </div>
        </Link>
        <Link href={"/dashboard/post/share-story"}>
          <div className="group h-full overflow-hidden rounded-lg border border-brand-gray-200 transition-all">
            <img
              src="/Typewriter.svg"
              alt="Share a Story"
              className="h-36 w-full p-10 transition-transform group-hover:scale-110"
            />
            <div className="flex h-[calc(100%-144px)] flex-col bg-card p-4 text-brand-gray-900">
              <h3 className="text-md font-semibold tracking-tight">
                Share a Story
              </h3>
              <p className="mt-2 flex-grow text-sm text-brand-gray-500">
                Turn your experiences personal triumphs or professional
                milestones into captivating narratives.
              </p>
            </div>
          </div>
        </Link>
        <Link href={"/dashboard/post/learnings"}>
          <div className="group h-full overflow-hidden rounded-lg border border-brand-gray-200 transition-all">
            <img
              src="/Learnings.svg"
              alt="Share some Learnings"
              className="h-36 w-full p-10 transition-transform group-hover:scale-110"
            />
            <div className="flex h-[calc(100%-144px)] flex-col bg-card p-4 text-brand-gray-900">
              <h3 className="text-md font-semibold tracking-tight">
                Share some Learnings
              </h3>
              <p className="mt-2 flex-grow text-sm text-brand-gray-500">
                Our AI helps distill complex concepts into clear, engaging posts
                that educate and inspire your followers.
              </p>
            </div>
          </div>
        </Link>
        <Link href={"/dashboard/post/tips"}>
          <div className="group h-full overflow-hidden rounded-lg border border-brand-gray-200 transition-all">
            <img
              src="/Tips.svg"
              alt="Share a few tips"
              className="h-36 w-full p-10 transition-transform group-hover:scale-110"
            />
            <div className="flex h-[calc(100%-144px)] flex-col bg-card p-4 text-brand-gray-900">
              <h3 className="text-md font-semibold tracking-tight">
                Share a few tips
              </h3>
              <p className="mt-2 flex-grow text-sm text-brand-gray-500">
                Craft concise, powerful tips that provide immediate value to
                your audience, boosting engagement.
              </p>
            </div>
          </div>
        </Link>
      </div>
    </main>
  );
};

export default PostsPage;
