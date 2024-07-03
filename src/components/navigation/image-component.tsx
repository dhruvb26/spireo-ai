"use client";
import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const ImageComponent = () => {
  const containerVariants = {
    hidden: { rotateX: 90, opacity: 0 },
    visible: {
      rotateX: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.8,
      },
    },
  };

  const imageVariants = {
    hidden: { scale: 0.8 },
    visible: {
      scale: 1,
      transition: { duration: 0.5, delay: 0.3 },
    },
  };
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
          130+ Handcoded Blocks
        </p>

        <h2 className="mt-6 text-3xl font-semibold leading-tight text-black sm:text-4xl lg:text-5xl">
          Celebration helps you build beautiful website
        </h2>
      </div>

      <div className="mt-12 grid grid-cols-1 items-center gap-x-4 gap-y-10 sm:mt-20 lg:grid-cols-5">
        <div className="space-y-8 lg:col-span-2 lg:space-y-12 lg:pr-16 xl:pr-24">
          <div className="flex items-start">
            <svg
              className="h-9 w-9 flex-shrink-0 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <div className="ml-5">
              <h3 className="text-xl font-semibold text-black">
                Simply Copy & Paste
              </h3>
              <p className="mt-3 text-base text-gray-600">
                Amet minim mollit non deserunt ullamco est sit aliqua dolor do
                amet sint.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <svg
              className="h-9 w-9 flex-shrink-0 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <div className="ml-5">
              <h3 className="text-xl font-semibold text-black">
                Easy to Customize
              </h3>
              <p className="mt-3 text-base text-gray-600">
                Amet minim mollit non deserunt ullamco est sit aliqua dolor do
                amet sint.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <svg
              className="h-9 w-9 flex-shrink-0 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <div className="ml-5">
              <h3 className="text-xl font-semibold text-black">
                Made with TailwindCSS
              </h3>
              <p className="mt-3 text-base text-gray-600">
                Amet minim mollit non deserunt ullamco est sit aliqua dolor do
                amet sint.
              </p>
            </div>
          </div>
        </div>

        <motion.div
          className="lg:col-span-3"
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 0.8,
          }}
        >
          <motion.img
            className="w-full rounded-lg shadow-xl"
            src="https://cdn.rareblocks.xyz/collection/celebration/images/features/7/dashboard-screenshot.png"
            alt=""
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default ImageComponent;
