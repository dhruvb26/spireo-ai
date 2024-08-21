import { Lightning } from "@phosphor-icons/react/dist/ssr";
import React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { ArrowUpRight } from "@phosphor-icons/react";

interface SuggestedIdeasProps {
  className?: string;
  ideas: string[];
  isLoading: boolean;
  error: string | null;
  onIdeaClick: (idea: string) => void; // Add this prop
}

const SuggestedIdeas: React.FC<SuggestedIdeasProps> = ({
  className,
  ideas,
  isLoading,
  error,
  onIdeaClick, // Add this prop
}) => {
  return (
    <div
      className={`w-full rounded-lg bg-blue-50 px-4 py-4 ${className || ""}`}
    >
      <h2 className=" mb-2 flex items-center font-semibold tracking-tight">
        <Lightning weight="duotone" className="mr-1 text-blue-500" size={22} />
        Quick picks
      </h2>
      {isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : error ? (
        <div className="flex flex-row items-center justify-center text-sm">
          <p className="text-blue-600">
            {error} To continue, set your preferences
          </p>
          {error && (
            <Link
              href="/dashboard/preferences"
              className="ml-1 inline-block text-blue-600 hover:underline"
            >
              here
              <ArrowUpRight className="inline h-4 w-4" />
            </Link>
          )}
        </div>
      ) : (
        <ul className="space-y-2 px-2">
          {ideas.map((idea, index) => (
            <li key={index}>
              <p
                className="cursor-pointer text-sm text-blue-600 hover:text-blue-700"
                onClick={() => onIdeaClick(idea)} // Add onClick handler
              >
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
