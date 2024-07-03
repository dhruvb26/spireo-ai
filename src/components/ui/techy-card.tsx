import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CardItem {
  title: string;
  type: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  tags: string[];
}

interface TechyCardProps {
  item: CardItem;
  className?: string;
}

const TechyCard: React.FC<TechyCardProps> = ({ item, className }) => {
  return (
    <div
      className={cn("max-w-sm overflow-hidden rounded-xl shadow-lg", className)}
    >
      <Link href={`/dashboard/post/${item.type}`}>
        <div
          className="h-32 w-full"
          style={{
            background: `linear-gradient(to right, ${item.gradientFrom}, ${item.gradientTo})`,
          }}
        />
        <div className="bg-white px-6 py-4 dark:bg-[rgba(40,40,40,0.70)]">
          <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-white">
            {item.title}
          </h3>
          <p className="text-base text-gray-700 dark:text-neutral-400">
            {item.description}
          </p>
        </div>
        <div className="bg-white px-6 pb-2 pt-4 dark:bg-[rgba(40,40,40,0.70)]">
          {item.tags.map((tag, index) => (
            <span
              key={index}
              className="mb-2 mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
            >
              #{tag}
            </span>
          ))}
        </div>
      </Link>
    </div>
  );
};

export default TechyCard;
