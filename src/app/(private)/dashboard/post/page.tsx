"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";

const PostsPage = () => {
  return (
    <div className="max-w-6xl ">
      <div className="container space-y-2 text-left ">
        <h1 className="text-3xl font-bold tracking-tighter text-brand-gray-900 ">
          Craft Engaging Posts with AI Assistance
        </h1>
        <p className="text-md mx-auto text-brand-gray-500 ">
          Choose Your Template Select from our range of AI-powered templates to
          kickstart your post creation process. Whether you're repurposing
          content or starting from scratch, we've got you covered.
        </p>
      </div>

      <section className="py-12">
        <div className="container grid grid-cols-1 gap-6 md:grid-cols-2  lg:grid-cols-3">
          <Link href="/dashboard/post/youtube-linkedin">
            <div className="group overflow-hidden rounded-lg border border-brand-gray-200 transition-all ">
              <img
                src="/Social-Video-Youtube-Clip--Streamline-Freehand.svg"
                alt="Product 1"
                className="h-48 w-full  p-10 transition-transform group-hover:scale-105"
              />
              <div className="bg-card p-4 text-brand-gray-900">
                <h3 className="text-lg font-semibold">
                  YouTube{" "}
                  <ArrowRight
                    size={12}
                    className="inline text-brand-gray-900"
                  />{" "}
                  LinkedIn
                </h3>
                <p className="text-sm text-brand-gray-500">
                  Transform YouTube content into LinkedIn gold. Just drop the
                  video link and watch the magic happen.
                </p>
              </div>
            </div>
          </Link>
          <Link href={"/dashboard/post/scratch-story"}>
            <div className="group overflow-hidden rounded-lg border border-brand-gray-200 transition-all ">
              <img
                src="/Edit-Pencil--Streamline-Freehand.svg"
                alt="Product 2"
                className=" h-48 w-full p-10 transition-transform group-hover:scale-105"
              />
              <div className="bg-card p-4 text-brand-gray-900">
                <h3 className="text-lg font-semibold">Write from Scratch</h3>
                <p className="text-sm text-brand-gray-500">
                  Unleash your creativity with AI as your co-pilot. Start with a
                  blank canvas and let AI polish your prose for a standout post.
                </p>
              </div>
            </div>
          </Link>
          <Link href={"/dashboard/post/share-story"}>
            <div className="group overflow-hidden rounded-lg border border-brand-gray-200  transition-all ">
              <img
                src="/Content-Typewriter--Streamline-Freehand.svg"
                alt="Product 3"
                className="h-48 w-full p-10 transition-transform group-hover:scale-105"
              />
              <div className="bg-card p-4 text-brand-gray-900">
                <h3 className="text-lg font-semibold">Share a Story</h3>
                <p className="text-sm text-brand-gray-500">
                  Turn your experiences into captivating narratives. Whether
                  it's a personal triumph or professional milestone.
                </p>
              </div>
            </div>
          </Link>
          <Link href={"/dashboard/post/learnings"}>
            <div className="group overflow-hidden rounded-lg border border-brand-gray-200  transition-all ">
              <img
                src="/Learning-Light-Idea--Streamline-Freehand.svg"
                alt="Product 4"
                className="h-48 w-full p-10 transition-transform group-hover:scale-105"
              />
              <div className="bg-card p-4 text-brand-gray-900">
                <h3 className="text-lg font-semibold">Share some Learnings</h3>
                <p className="text-sm text-brand-gray-500">
                  Our AI helps distill complex concepts into clear, engaging
                  posts that educate and inspire your followers.
                </p>
              </div>
            </div>
          </Link>
          <Link href={"/dashboard/post/tips"}>
            <div className="group overflow-hidden rounded-lg  border border-brand-gray-200 transition-all ">
              <img
                src="/Debate-Talk-1--Streamline-Freehand.svg"
                alt="Product 5"
                className="h-48 w-full p-10 transition-transform group-hover:scale-105"
              />
              <div className="bg-card p-4 text-brand-gray-900">
                <h3 className="text-lg font-semibold">Share a few tips</h3>
                <p className="text-sm text-brand-gray-500">
                  Craft concise, powerful tips that provide immediate value to
                  your audience, boosting engagement and establishing your
                  authority.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PostsPage;
