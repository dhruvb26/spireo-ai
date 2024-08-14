"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const WobbleCard = ({
  children,
  containerClassName,
  className,
}: {
  children: React.ReactNode;
  containerClassName?: string;
  className?: string;
  href?: string;
}) => {
  const content = (
    <div
      className={cn(
        "relative mx-auto w-full overflow-hidden rounded-2xl transition-transform duration-300 hover:scale-[1.03]",
        containerClassName,
      )}
    >
      <div className="relative h-full w-full overflow-hidden border border-brand-gray-200 sm:mx-0 sm:rounded-2xl">
        <div className={cn("h-full w-full px-4 py-20 sm:px-10", className)}>
          {children}
        </div>
      </div>
    </div>
  );

  return content;
};
