"use client";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "../ui/animated-beam";
import React, { forwardRef, useRef } from "react";
import Image from "next/image";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";
import { Brain, Pencil } from "lucide-react";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-border bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      {children}
    </div>
  );
});

export default function AnimatedBeamMultipleInputDemo({
  className,
}: {
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        "relative flex h-full w-full max-w-[32rem] items-center justify-center overflow-hidden rounded-lg border bg-background p-10 md:shadow-xl",
        className,
      )}
      ref={containerRef}
    >
      <div className="flex h-full w-full flex-row items-stretch justify-between gap-10">
        <div className="flex flex-col justify-center gap-2">
          <Circle ref={div1Ref}>
            <Icons.youtube />
          </Circle>
          <Circle ref={div2Ref}>
            <Icons.x />
          </Circle>
          <Circle ref={div3Ref}>
            <Icons.pencil />
          </Circle>
          <Circle ref={div5Ref}>
            <Icons.ideas />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div6Ref} className="h-16 w-16">
            <Icons.spireo />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div7Ref}>
            <Icons.user />
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div6Ref}
      />

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div7Ref}
      />
    </div>
  );
}

const Icons = {
  ideas: () => <Brain className="h-full w-full" />,
  spireo: () => (
    <Image src="/symbol.png" alt="symbol" width={100} height={100} />
  ),
  youtube: () => (
    <Image
      className="h-full w-full"
      src="/youtube-logo.png"
      alt="google-drive"
      width={100}
      height={100}
    />
  ),
  pencil: () => <Pencil className="h-full w-full" />,
  x: () => (
    <Image src="/x-logo.png" alt="google-docs" width={100} height={100} />
  ),

  user: () => <LinkedInLogoIcon className="h-full w-full text-[#0a66c2]" />,
};
