"use client";

import PostCard from "@/components/post-card";

export default function Home() {
  return (
    <main>
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-brand-gray-900">
          Inspiration
        </h1>
        <p className="text-sm text-brand-gray-500">
          Here are some of the most recent posts from the top creators on
          LinkedIn. Check back daily for new content!
        </p>
      </div>
    </main>
  );
}
