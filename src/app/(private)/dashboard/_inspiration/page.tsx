"use client";

import { useState, useEffect } from "react";
import PostCard from "@/components/post-card";
import { Post } from "@/components/post-card";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      const response = await fetch("/api/posts");
      if (response.ok) {
        const data = await response.json();
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        const filteredPosts = data.filter((post: Post) => {
          const postDate = new Date(post.posted);
          return postDate >= threeDaysAgo;
        });

        setPosts(filteredPosts);
      }
    }

    fetchPosts();
  }, []);

  return (
    <div className="w-[80vw]">
      <div className=" mb-8 text-left">
        <h1 className="text-3xl font-bold tracking-tighter text-brand-gray-900">
          Keep up with the latest posts
        </h1>
        <p className="text-md mx-auto text-brand-gray-500">
          Here are the most recent posts from the top creators on LinkedIn.
          Check back daily for new content!
        </p>
      </div>
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.urn} post={post} />
        ))}
      </div>
    </div>
  );
}
