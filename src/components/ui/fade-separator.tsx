import React from "react";
import { cn } from "@/lib/utils";

interface FadeSeparatorProps {
  text?: string;
  side?: "left" | "right";
  className?: string;
}

const FadeSeparator: React.FC<FadeSeparatorProps> = ({
  text,
  side = "left",
  className,
}) => {
  return (
    <div className={cn("mx-6 my-2 flex items-center", className)}>
      {text && side === "left" && (
        <span className="mr-1 text-xs text-gray-500">{text}</span>
      )}
      <div className="h-[1px] flex-grow bg-brand-gray-200" />
      {text && side === "right" && (
        <span className="ml-1 text-xs text-gray-500">{text}</span>
      )}
    </div>
  );
};

export default FadeSeparator;
