"use client";
import Image from "next/image";
import React from "react";
import { WobbleCard } from "./ui/wobble-card";
import Link from "next/link";

export function GridCards() {
  return (
    <div className="w-7xl mx-auto grid max-w-full grid-cols-1 gap-4 lg:grid-cols-3">
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 h-full  min-h-[500px] lg:min-h-[300px]"
        className=" bg-white text-black hover:bg-blue-50"
      >
        <Link href={"https://www.spireo.ai/"} target="_blank">
          <div className="max-w-xs">
            <h2 className="text-balance text-left text-lg font-semibold tracking-tight text-brand-gray-900 md:text-2xl">
              AI-Powered LinkedIn Growth Tools
            </h2>
            <p className="mt-4 text-left text-sm text-brand-gray-500">
              Spireo offers cutting-edge AI features to supercharge your
              LinkedIn presence. From content creation to engagement analysis,
              our tools help you grow your network effectively.
            </p>
          </div>
          <Image
            src="/features.png"
            width={350}
            height={350}
            alt="AI-powered growth tools"
            className="absolute -bottom-10 -right-4 rounded-2xl object-contain "
          />
        </Link>
      </WobbleCard>
      <WobbleCard
        containerClassName="col-span-1 min-h-[300px] "
        className=" bg-white text-black hover:bg-blue-50"
      >
        <Link href={"https://spireo.canny.io/feature-requests"} target="_blank">
          <h2 className="max-w-80 text-balance  text-left text-lg font-semibold tracking-tight text-brand-gray-900  md:text-2xl">
            We Value Your Feedback
          </h2>
          <p className="mt-4 max-w-[14rem] text-balance text-left text-sm text-brand-gray-500 ">
            Have ideas for new features? We're all ears! Your feedback helps us
            improve Spireo and tailor it to your needs.
          </p>
          <Image
            src="/feedback.png"
            width={225}
            height={225}
            alt="Feedback and feature requests"
            className="absolute -bottom-10 -right-10 rounded-2xl object-contain "
          />
        </Link>
      </WobbleCard>
      <WobbleCard
        className=" bg-white text-black hover:bg-blue-50"
        containerClassName="col-span-1 lg:col-span-3 bg-blue-600  bg-white min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]"
      >
        <Link href={"https://www.spireo.ai/blog-template"} target="_blank">
          <div className="max-w-3xl">
            <h2 className="max-w-sm text-balance text-left  text-lg font-semibold tracking-tight text-brand-gray-900  md:max-w-lg md:text-2xl">
              Learn to Master Spireo
            </h2>
            <p className="mt-4 text-left  text-sm text-brand-gray-500 ">
              Explore our comprehensive blogs and in-depth video tutorials to
              unlock the full potential of Spireo. Discover expert tips, proven
              strategies, and industry best practices for accelerating your
              LinkedIn growth. Our regularly updated content covers everything
              from optimizing your profile to crafting engaging posts and
              building meaningful connections.
            </p>
            <p className="mt-2 text-left  text-sm text-brand-gray-500 ">
              Whether you're a LinkedIn novice or a seasoned professional, our
              learning resources are designed to help you stay ahead of the
              curve.
            </p>
          </div>
          <Image
            src="/tutorials.png"
            width={350}
            height={350}
            alt="Blogs and tutorials"
            className="absolute -bottom-10 -right-10 rounded-2xl object-contain "
          />
        </Link>
      </WobbleCard>
    </div>
  );
}
