"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Timer } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const PostsPage = () => {
  return (
    <main>
      <div className="mb-8 text-left">
        <h1 className="text-xl font-semibold tracking-tight text-brand-gray-900 ">
          Craft Engaging Posts with AI Assistance
        </h1>
        <p className="text-sm text-brand-gray-500">
          Choose Your Template Select from our range of AI-powered templates to
          kickstart your post creation process. Whether you're repurposing
          content or starting from scratch, we've got you covered.
        </p>
      </div>

      <div className="mb-8">
        <>
          <h2 className=" text-lg font-semibold tracking-tight text-brand-gray-900">
            Repurpose Content
          </h2>
          <p className="mb-4 text-sm text-brand-gray-500">
            Our AI-powered tools help you repurpose content from various
            sources, saving time and maximizing your content's reach.
          </p>
        </>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/dashboard/post/youtube-linkedin">
            <div className="group h-full overflow-hidden rounded-lg border border-brand-gray-200 transition-all hover:-translate-y-1 hover:shadow-sm ">
              <div className="flex items-center justify-center p-6">
                <Image
                  width={48}
                  height={48}
                  src="/Youtube-Logo--Streamline-Core (1).png"
                  alt="YouTube to LinkedIn"
                  className="h-12 w-12 object-contain"
                />
              </div>
              <div className="flex h-[calc(100%-96px)] flex-col bg-card p-4 text-brand-gray-900">
                <h3 className="text-md font-semibold tracking-tight">
                  YouTube{" "}
                  <ArrowRight
                    size={12}
                    className="inline text-brand-gray-900"
                  />{" "}
                  LinkedIn
                </h3>
                <p className="mt-2 flex-grow text-sm text-brand-gray-500">
                  Transform YouTube content into LinkedIn gold. Just drop the
                  video link and watch the magic happen.
                </p>
              </div>
            </div>
          </Link>
          <Link href="/dashboard/post/blog-linkedin">
            <div className="group h-full overflow-hidden rounded-lg border border-brand-gray-200 transition-all hover:-translate-y-1 hover:shadow-sm ">
              <div className="flex items-center justify-center p-6">
                <Image
                  width={48}
                  height={48}
                  src="/blogs.svg"
                  alt="Blog to LinkedIn"
                  className="h-12 w-12 object-contain"
                />
              </div>
              <div className="flex h-[calc(100%-96px)] flex-col bg-card p-4 text-brand-gray-900">
                <h3 className="text-md font-semibold tracking-tight">
                  Blog{" "}
                  <ArrowRight
                    size={12}
                    className="inline text-brand-gray-900"
                  />{" "}
                  LinkedIn
                </h3>
                <p className="mt-2 flex-grow text-sm text-brand-gray-500">
                  Convert insightful blog posts into engaging LinkedIn content.
                  Simply input the URL and let our AI do the rest.
                </p>
              </div>
            </div>
          </Link>
          <Link href="/dashboard/post/video-linkedin">
            <div className="group h-full overflow-hidden rounded-lg border border-brand-gray-200 transition-all hover:-translate-y-1 hover:shadow-sm">
              <div className="flex items-center justify-center p-6">
                <Image
                  width={48}
                  height={48}
                  src="/Copy-Paste--Streamline-Core.png"
                  alt="Transcript to LinkedIn"
                  className="h-12 w-12 object-contain"
                />
              </div>
              <div className="flex h-[calc(100%-96px)] flex-col bg-card p-4 text-brand-gray-900">
                <h3 className="text-md font-semibold tracking-tight">
                  Transcript{" "}
                  <ArrowRight
                    size={12}
                    className="inline text-brand-gray-900"
                  />{" "}
                  LinkedIn
                </h3>
                <p className="mt-2 flex-grow text-sm text-brand-gray-500">
                  Our platform helps you distill key points and create
                  compelling content from any transcript.
                </p>
                {/* <Badge
                  className={`mr-auto mt-1 space-x-1 bg-blue-50 font-normal text-blue-600 hover:bg-blue-100`}
                >
                  <span>Soon</span>
                  <Timer weight="duotone" size={16} />
                </Badge> */}
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div>
        <>
          <h2 className="text-lg font-semibold tracking-tight text-brand-gray-900">
            Use Our Templates
          </h2>
          <p className="mb-4 text-sm text-brand-gray-500">
            Craft engaging LinkedIn posts with our AI-powered templates,
            designed to boost your professional presence and maximize
            engagement.
          </p>
        </>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link
            className="rounded-lg"
            href={"/dashboard/post/scratch-story"}
            id="tour-2"
          >
            <div className="group h-full overflow-hidden rounded-lg border border-brand-gray-200 transition-all hover:-translate-y-1 hover:shadow-sm">
              <div className="flex items-center justify-center p-6">
                <Image
                  width={48}
                  height={48}
                  src="/scratch.svg"
                  alt="Write from Scratch"
                  className="h-12 w-12 object-contain"
                />
              </div>
              <div className="flex h-[calc(100%-96px)] flex-col bg-card p-4 text-brand-gray-900">
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
            <div className="group h-full overflow-hidden rounded-lg border border-brand-gray-200 transition-all hover:-translate-y-1 hover:shadow-sm">
              <div className="flex items-center justify-center p-6">
                <Image
                  width={48}
                  height={48}
                  src="/story.svg"
                  alt="Share a Story"
                  className="h-12 w-12 object-contain"
                />
              </div>
              <div className="flex h-[calc(100%-96px)] flex-col bg-card p-4 text-brand-gray-900">
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
            <div className="group h-full overflow-hidden rounded-lg border border-brand-gray-200 transition-all hover:-translate-y-1 hover:shadow-sm">
              <div className="flex items-center justify-center p-6">
                <Image
                  width={48}
                  height={48}
                  src="/Book-2--Streamline-Core.png"
                  alt="Share some Learnings"
                  className="h-12 w-12 object-contain"
                />
              </div>
              <div className="flex h-[calc(100%-96px)] flex-col bg-card p-4 text-brand-gray-900">
                <h3 className="text-md font-semibold tracking-tight">
                  Share some Learnings
                </h3>
                <p className="mt-2 flex-grow text-sm text-brand-gray-500">
                  Our AI helps distill complex concepts into clear, engaging
                  posts that educate and inspire your followers.
                </p>
              </div>
            </div>
          </Link>
          <Link href={"/dashboard/post/tips"}>
            <div className="group h-full overflow-hidden rounded-lg border border-brand-gray-200 transition-all hover:-translate-y-1 hover:shadow-sm">
              <div className="flex items-center justify-center p-6">
                <Image
                  width={48}
                  height={48}
                  src="/bullet-list.svg"
                  alt="Share a few tips"
                  className="h-12 w-12 object-contain"
                />
              </div>
              <div className="flex h-[calc(100%-96px)] flex-col bg-card p-4 text-brand-gray-900">
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
      </div>
    </main>
  );
};

export default PostsPage;
