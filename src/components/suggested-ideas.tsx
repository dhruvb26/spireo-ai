"use client";
import { Lightning } from "@phosphor-icons/react/dist/ssr";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface SuggestedIdeasProps {
  className?: string;
}

const SuggestedIdeas: React.FC<SuggestedIdeasProps> = ({ className }) => {
  const [ideas, setIdeas] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await fetch("/api/ai/generate-suggestions");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (response.status === 200) {
          setIdeas(data.ideas);
        } else if (response.status === 403) {
          setError("Oops! No suggestions found.");
        } else {
          setError("An error occurred while fetching suggestions.");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError("An error occurred while fetching suggestions.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  return (
    <div
      className={`w-full rounded-lg bg-blue-50 px-2 py-4 ${className || ""}`}
    >
      <h2 className="text-md mb-2 flex items-center font-semibold tracking-tight">
        <Lightning weight="duotone" className="mr-1 text-blue-500" size={22} />
        Quick picks
      </h2>
      {isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : error ? (
        <div className="text-sm">
          <p className="text-rose-600">{error}</p>
          {error.includes("onboarding") && (
            <Link
              href="/dashboard/preferences"
              className="mt-2 inline-block text-blue-600 hover:underline"
            >
              Set Preferences
            </Link>
          )}
        </div>
      ) : (
        <ul className="space-y-2 px-2">
          {ideas.map((idea, index) => (
            <li key={index}>
              <p className="text-sm text-blue-600 hover:text-blue-700">
                {idea}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SuggestedIdeas;
