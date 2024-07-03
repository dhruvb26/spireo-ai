import {
  Recycle,
  Share2Icon,
  RecycleIcon,
  Lightbulb,
  GalleryHorizontalEndIcon,
  Calendar,
  User,
} from "lucide-react";
import React from "react";

const NewFeatureSection = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="mt-6 text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
          Celebration helps you build beautiful website
        </h2>
        <p className="mt-4 text-base leading-relaxed text-gray-600">
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
          sint. Velit officia consequat duis enim velit mollit.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3 lg:mt-20 lg:gap-x-12">
        <div className="bg-white shadow-xl transition-all duration-200 hover:scale-105">
          <div className="px-9 py-10">
            <Share2Icon className="h-16 w-16 text-custom-gray" />
            <h3 className="mt-8 text-lg font-semibold text-black">
              Ready-to-share LinkedIn Posts
            </h3>
            <p className="mt-4 text-base text-gray-600">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do
              amet sint. Velit officia consequat duis enim velit mollit.
            </p>
          </div>
        </div>

        <div className="bg-white shadow-xl transition-all duration-200 hover:scale-105">
          <div className="px-9 py-10">
            <RecycleIcon className="h-16 w-16 text-custom-gray" />
            <h3 className="mt-8 text-lg font-semibold text-black">
              Easily Repurpose Content
            </h3>
            <p className="mt-4 text-base text-gray-600">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do
              amet sint. Velit officia consequat duis enim velit mollit.
            </p>
          </div>
        </div>

        <div className="bg-white shadow-xl transition-all duration-200 hover:scale-105">
          <div className="px-9 py-10">
            <Lightbulb className="h-16 w-16 text-custom-gray" />
            <h3 className="mt-8 text-lg font-semibold text-black">
              Endless LinkedIn Post Ideas
            </h3>
            <p className="mt-4 text-base text-gray-600">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do
              amet sint. Velit officia consequat duis enim velit mollit.
            </p>
          </div>
        </div>
        <div className="bg-white shadow-xl transition-all duration-200 hover:scale-105">
          <div className="px-9 py-10">
            <GalleryHorizontalEndIcon className="h-16 w-16 text-custom-gray" />
            <h3 className="mt-8 text-lg font-semibold text-black">
              Eye-catching LinkedIn Carousels
            </h3>
            <p className="mt-4 text-base text-gray-600">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do
              amet sint. Velit officia consequat duis enim velit mollit.
            </p>
          </div>
        </div>

        <div className="bg-white shadow-xl transition-all duration-200 hover:scale-105">
          <div className="px-9 py-10">
            <Calendar className="h-16 w-16 text-custom-gray" />
            <h3 className="mt-8 text-lg font-semibold text-black">
              Schedule posts with ease
            </h3>
            <p className="mt-4 text-base text-gray-600">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do
              amet sint. Velit officia consequat duis enim velit mollit.
            </p>
          </div>
        </div>

        <div className="bg-white shadow-xl transition-all duration-200 hover:scale-105">
          <div className="px-9 py-10">
            <User className="h-16 w-16 text-custom-gray" />
            <h3 className="mt-8 text-lg font-semibold text-black">
              Follow top LinkedIn creators
            </h3>
            <p className="mt-4 text-base text-gray-600">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do
              amet sint. Velit officia consequat duis enim velit mollit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewFeatureSection;
