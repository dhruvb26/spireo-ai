"use client";
import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const ImageComponent = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: {
      scale: 0.8,
      opacity: 0,
      z: -5,
      rotateX: 10,
    },
    visible: {
      scale: 1,
      opacity: 1,
      z: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      },
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mt-12 grid grid-cols-1 items-center gap-x-4 gap-y-10 sm:mt-4 lg:grid-cols-1">
        <motion.div
          ref={ref}
          className="perspective-1000 lg:col-span-3"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          style={{ transformStyle: "preserve-3d" }}
        >
          <img
            className="w-full rounded-lg shadow-xl"
            src="https://cdn.rareblocks.xyz/collection/celebration/images/features/7/dashboard-screenshot.png"
            alt="Dashboard screenshot"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default ImageComponent;
