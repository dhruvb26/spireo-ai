import { Check, Redo2, Undo2, Dot } from "lucide-react";
import React from "react";
import Ripple from "../ui/ripple";

const BeforeAfterSection = () => {
  return (
    <section className="py-12">
      <div className=" space-y-4 text-center">
        <div className="mx-auto mb-4 inline-flex rounded-full bg-gradient-to-r from-primary-blue to-darker-blue px-4 py-1.5">
          <p className="text-xs font-semibold uppercase tracking-widest text-white">
            GET SPIREO
          </p>
        </div>
        <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
          Write your first post with Spireo and never look back
        </h2>
        <p className=" mt-4  text-base leading-relaxed text-gray-600">
          Spireo's AI-powered tools streamline your LinkedIn strategy, helping
          you create impactful posts in minutes, not hours. Boost your
          professional presence and grow your network with ease.
        </p>
      </div>
      <div className="mx-auto mt-6 flex max-w-6xl flex-col gap-6 p-6 md:flex-row">
        {/* Before Section */}
        <div className="flex-1 rounded-lg bg-white p-6 shadow-lg">
          <h3 className="mb-4 flex items-center text-gray-600">
            <Undo2 size={24} className="mr-2 inline" /> Before Spireo
          </h3>
          <h2 className="mb-4 text-2xl font-bold">
            LinkedIn Struggles Without AI Assistance
          </h2>
          <ul className="space-y-2">
            <li className="flex items-start">
              <Dot className="mr-2 inline" />
              Staring at a blank screen, unsure what to post
            </li>
            <li className="flex items-start">
              <Dot className="mr-2 inline" />
              Wasting time manually crafting each LinkedIn update
            </li>
            <li className="flex items-start">
              <Dot className="mr-2 inline" />
              Inconsistent posting leading to low engagement
            </li>
            <li className="flex items-start">
              <Dot className="mr-2 inline" />
              Overwhelmed by complex creation tools
            </li>
          </ul>
        </div>

        {/* After Section */}
        <div className="flex-1 rounded-lg bg-primary-blue p-6 text-white shadow-lg">
          <h3 className="mb-4 flex items-center">
            After Spireo
            <Redo2 size={24} className="ml-2 inline" />
          </h3>
          <h2 className="mb-4 text-2xl font-bold">
            Effortless LinkedIn Success with AI-Powered Tools
          </h2>
          <ul className="space-y-2">
            <li className="flex items-start">
              <Check size={18} className="mr-2 inline" />
              Instant inspiration with AI-generated post ideas
            </li>
            <li className="flex items-start">
              <Check size={18} className="mr-2 inline" />
              Ready-to-share content tailored to your industry
            </li>
            <li className="flex items-start">
              <Check size={18} className="mr-2 inline" />
              Consistent, high-quality posts scheduled effortlessly
            </li>
            <li className="flex items-start">
              <Check size={18} className="mr-2 inline" />
              Streamlined tools that simplify your LinkedIn strategy
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSection;
