"use client";

import React, { useState, useEffect } from "react";
import PostCard from "@/components/post-card";
import { getAllPosts } from "@/actions/post";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [posts, setPosts] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const result = await getAllPosts();
        if (result.success) {
          setPosts(result.posts);
        } else {
          console.error("Failed to fetch posts:", result.error);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

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
      {loading ? (
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </main>
  );
}
