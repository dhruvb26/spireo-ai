import React from "react";
import {
  SparklesIcon,
  Star,
  LinkedinIcon,
  Check,
  CheckIcon,
} from "lucide-react";

const FixedPricing = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2 md:items-stretch lg:gap-x-20">
        <div className="flex flex-col justify-between lg:py-5">
          <h2 className="text-3xl font-semibold leading-tight text-black sm:text-4xl lg:text-5xl lg:leading-tight">
            Join 50k+ professionals & boost your LinkedIn presence
          </h2>

          <div className="mt-auto">
            <div className="mt-2 flex items-center">
              <div className="stars flex">
                {Array.from({ length: 5 }, () => (
                  <Star fill="#f97316" strokeWidth={0} />
                ))}
              </div>
            </div>

            <blockquote className="mt-6">
              <p className="text-lg leading-relaxed text-black">
                This AI-powered platform has transformed my LinkedIn game.
                Creating engaging content is now effortless, and my network
                growth has been phenomenal. It's like having a personal LinkedIn
                assistant.
              </p>
            </blockquote>

            <div className="mt-8 flex items-center">
              <img
                className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
                src="https://cdn.rareblocks.xyz/collection/celebration/images/pricing/2/avatar.jpg"
                alt=""
              />
              <div className="ml-4">
                <p className="text-base font-semibold text-black">
                  Sarah Johnson
                </p>
                <p className="mt-px text-sm text-gray-400">
                  Marketing Director
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="">
          <div className="overflow-hidden rounded-md bg-white">
            <div className="p-10">
              <h3 className="text-primary-blue text-xs font-semibold uppercase tracking-widest">
                Pro Plan
              </h3>
              <p className="mt-4 text-6xl font-bold text-black">$49</p>
              <p className="text-lg text-gray-600">per month</p>

              <ul className="mt-8 flex flex-col space-y-4">
                <li className="inline-flex items-center space-x-2">
                  <CheckIcon className="mr-2 h-5 w-5 text-green-500" />
                  <span className="text-base font-medium text-gray-900">
                    Unlimited AI-generated posts
                  </span>
                </li>

                <li className="inline-flex items-center space-x-2">
                  <CheckIcon className="mr-2 h-5 w-5 text-green-500" />
                  <span className="text-base font-medium text-gray-900">
                    Advanced content customization
                  </span>
                </li>

                <li className="inline-flex items-center space-x-2">
                  <CheckIcon className="mr-2 h-5 w-5 text-green-500" />
                  <span className="text-base font-medium text-gray-900">
                    Scheduled posting
                  </span>
                </li>

                <li className="inline-flex items-center space-x-2">
                  <CheckIcon className="mr-2 h-5 w-5 text-green-500" />
                  <span className="border-b border-dashed border-black pb-0.5 text-base font-medium text-gray-900">
                    Premium support
                  </span>
                </li>
              </ul>

              <a
                href="#"
                title=""
                className="from-primary-blue to-darker-blue mt-10 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r px-8 py-4 font-semibold text-white transition-all duration-200  hover:opacity-80 hover:shadow-lg focus:opacity-80"
                role="button"
              >
                <SparklesIcon className="mr-2 h-5 w-5 flex-shrink-0" /> Boost
                your LinkedIn now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixedPricing;
