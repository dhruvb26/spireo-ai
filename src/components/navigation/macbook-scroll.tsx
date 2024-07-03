"use client";
import React, { useEffect, useRef, useState } from "react";
import { MotionValue, motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export const MacbookScroll = ({
  src,
  showGradient,
  title,
  badge,
}: {
  src?: string;
  showGradient?: boolean;
  title?: string | React.ReactNode;
  badge?: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window && window.innerWidth < 768) {
      setIsMobile(true);
    }
  }, []);

  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, isMobile ? 0.7 : 0.9],
  );
  const translateY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0]);

  return (
    <div
      ref={ref}
      className="relative flex min-h-[150vh] items-start justify-center overflow-hidden py-20"
    >
      <motion.div
        style={{
          scale,
          translateY,
          rotateX,
          opacity,
          perspective: "1000px",
        }}
        className="flex-shrink-0 [perspective:800px] sm:scale-100"
      >
        <Lid src={src} />
      </motion.div>
    </div>
  );
};

export const Lid = ({ src }: { src?: string }) => {
  return (
    <div className="relative [perspective:800px]">
      <div
        className="h-96 w-[32rem] rounded-2xl bg-[#010101] p-2"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 rounded-lg bg-[#272729]" />
        <Image
          src={src || "/placeholder.svg"}
          alt="Macbook display"
          fill
          className="absolute inset-0 h-full w-full rounded-lg object-cover object-left-top"
        />
      </div>
    </div>
  );
};
