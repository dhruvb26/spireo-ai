"use client";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import TechyCard from "@/components/ui/techy-card";
import FadeSeparator from "@/components/ui/fade-separator";

const PostsPage = () => {
  const repurposeCards = [
    {
      title: "YouTube to LinkedIn",
      id: uuidv4(),
      type: "youtube-linkedin",
      description:
        "Repurpose any YouTube video into a LinkedIn post. Drop the link and let AI do the rest.",
      gradientFrom: "#2fb4ff",
      gradientTo: "#0fabf6",
      tags: ["YouTube", "LinkedIn", "Repurpose"],
    },
  ];

  const templateCards = [
    {
      title: "Write from scratch",
      id: uuidv4(),
      type: "scratch-story",
      description:
        "Create a post without any help. Use your creativity with AI's help.",
      gradientFrom: "#2fb4ff",
      gradientTo: "#0fabf6",
      tags: ["Creative", "AI-Assisted"],
    },
    {
      title: "Share a story",
      id: uuidv4(),
      type: "share-story",
      description:
        "Share your story with the world. Be it personal or professional.",
      gradientFrom: "#2fb4ff",
      gradientTo: "#0fabf6",
      tags: ["Story", "Personal", "Professional"],
    },
    {
      title: "Share your learnings",
      id: uuidv4(),
      type: "learnings",
      description:
        "Share your learnings with the world. Knowledge grows when shared.",
      gradientFrom: "#2fb4ff",
      gradientTo: "#0fabf6",
      tags: ["Knowledge", "Learning"],
    },
    {
      title: "Share valuable tips",
      id: uuidv4(),
      type: "tips",
      description:
        "Share any tips with the world. Anything from life hacks to professional tips.",
      gradientFrom: "#2fb4ff",
      gradientTo: "#0fabf6",
      tags: ["Tips", "Life Hacks", "Professional"],
    },
  ];

  return (
    <div className="container mx-auto flex flex-col p-4">
      <h1 className="mb-2 text-3xl font-bold">Use AI to create your posts</h1>
      <p className="text-sm text-slate-500">
        Repurpose any content or start with one of our templates.
      </p>
      <FadeSeparator />

      <div className="mt-8">
        {/* <h2 className="mb-4 text-2xl font-semibold">Post Templates</h2> */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {repurposeCards.map((card) => (
            <TechyCard key={card.id} item={card} />
          ))}
          {templateCards.map((card) => (
            <TechyCard key={card.id} item={card} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostsPage;
