import React from "react";

const FAQComponent = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold leading-tight text-black sm:text-4xl lg:text-5xl">
          Frequently Asked Questions
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-darker-blue">
          Get answers to common questions about Spireo and how it can enhance
          your LinkedIn presence
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-x-20 gap-y-16 md:mt-20 md:grid-cols-2">
        <div className="flex items-start">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-black">
            <span className="text-lg font-semibold text-white">?</span>
          </div>
          <div className="ml-4">
            <p className="text-xl font-semibold text-black">
              How does Spireo's AI generate content?
            </p>
            <p className="mt-4 text-base text-gray-400">
              Spireo's AI uses Anthropic's state-of-the-art Claude 3.5 Sonnet
              model to generate curated content for you. This model is trained
              on a diverse range of LinkedIn posts and is fine-tuned to
              understand the nuances of professional networking.
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-black">
            <span className="text-lg font-semibold text-white">?</span>
          </div>
          <div className="ml-4">
            <p className="text-xl font-semibold text-black">
              Can I schedule posts with Spireo?
            </p>
            <p className="mt-4 text-base text-gray-400">
              Yes, Spireo offers a powerful scheduling feature. You can plan
              your content calendar, set posting times, and even schedule
              comments. This helps maintain a consistent presence on LinkedIn
              without constant manual effort.
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-black">
            <span className="text-lg font-semibold text-white">?</span>
          </div>
          <div className="ml-4">
            <p className="text-xl font-semibold text-black">
              Is there a free trial available?
            </p>
            <p className="mt-4 text-base text-gray-400">
              Yes, we offer a 7-day free trial for new users. This allows you to
              explore all of Spireo's features and see how it can boost your
              LinkedIn engagement before committing to a paid plan.
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-black">
            <span className="text-lg font-semibold text-white">?</span>
          </div>
          <div className="ml-4">
            <p className="text-xl font-semibold text-black">
              How does Spireo protect my data?
            </p>
            <p className="mt-4 text-base text-gray-400">
              We take data security seriously. Spireo uses industry-standard
              encryption and security protocols to protect your information. We
              never share your data with third parties, and you have full
              control over your account settings and privacy.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-center md:mt-20">
        <div className="rounded-full bg-black px-8 py-4 text-center">
          <p className="text-gray-50">
            Still have questions?{" "}
            <a
              href="#"
              title=""
              className="text-primary-blue  hover:text-blue-600 hover:underline "
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQComponent;
