import React from "react";

const FAQComponent = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold leading-tight text-black sm:text-4xl lg:text-5xl">
          Questions & Answers
        </h2>
        <p className="text-darker-blue mx-auto mt-4 max-w-xl text-base leading-relaxed">
          Explore the common questions and answers about Celebration
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-x-20 gap-y-16 md:mt-20 md:grid-cols-2">
        <div className="flex items-start">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-black">
            <span className="text-lg font-semibold text-white">?</span>
          </div>
          <div className="ml-4">
            <p className="text-xl font-semibold text-black">
              How to create an account?
            </p>
            <p className="mt-4 text-base text-gray-400">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do
              amet sint. Velit officia consequat duis enim velit mollit.
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-black">
            <span className="text-lg font-semibold text-white">?</span>
          </div>
          <div className="ml-4">
            <p className="text-xl font-semibold text-black">
              How can I make payment?
            </p>
            <p className="mt-4 text-base text-gray-400">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do
              amet sint. Velit officia consequat duis enim velit mollit.
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-black">
            <span className="text-lg font-semibold text-white">?</span>
          </div>
          <div className="ml-4">
            <p className="text-xl font-semibold text-black">
              Do you provide discounts?
            </p>
            <p className="mt-4 text-base text-gray-400">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do
              amet sint. Velit officia consequat duis enim velit mollit.
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-black">
            <span className="text-lg font-semibold text-white">?</span>
          </div>
          <div className="ml-4">
            <p className="text-xl font-semibold text-black">
              How do you provide support?
            </p>
            <p className="mt-4 text-base text-gray-400">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do
              amet sint. Velit officia consequat duis enim velit mollit.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-center md:mt-20">
        <div className="rounded-full bg-black px-8 py-4 text-center">
          <p className="text-gray-50">
            Didn’t find the answer you are looking for?{" "}
            <a
              href="#"
              title=""
              className="text-primary-blue  hover:text-blue-600 hover:underline "
            >
              Contact our support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQComponent;
