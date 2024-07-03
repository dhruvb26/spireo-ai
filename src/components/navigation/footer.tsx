import React from "react";
import Link from "next/link";
import Image from "next/image";
const Footer = () => {
  return (
    <section className="bg-black py-10 sm:pt-16 lg:pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4 md:gap-x-12">
          <div>
            <p className="text-primary-blue text-base">Company</p>

            <ul className="mt-8 space-y-4">
              <li>
                <a
                  href="#"
                  title=""
                  className="text-base text-white transition-all duration-200 hover:text-opacity-80 focus:text-opacity-80"
                >
                  {" "}
                  About{" "}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  title=""
                  className="text-base text-white transition-all duration-200 hover:text-opacity-80 focus:text-opacity-80"
                >
                  {" "}
                  Features{" "}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  title=""
                  className="text-base text-white transition-all duration-200 hover:text-opacity-80 focus:text-opacity-80"
                >
                  {" "}
                  Pricing{" "}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-primary-blue text-base">Help</p>

            <ul className="mt-8 space-y-4">
              <li>
                <a
                  href="#"
                  title=""
                  className="text-base text-white transition-all duration-200 hover:text-opacity-80 focus:text-opacity-80"
                >
                  {" "}
                  Customer Support{" "}
                </a>
              </li>

              <li>
                <a
                  href="#"
                  title=""
                  className="text-base text-white transition-all duration-200 hover:text-opacity-80 focus:text-opacity-80"
                >
                  {" "}
                  Terms & Conditions{" "}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  title=""
                  className="text-base text-white transition-all duration-200 hover:text-opacity-80 focus:text-opacity-80"
                >
                  {" "}
                  Privacy Policy{" "}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-primary-blue text-base">Extra Links</p>

            <ul className="mt-8 space-y-4">
              <li>
                <a
                  href="#"
                  title=""
                  className="text-base text-white transition-all duration-200 hover:text-opacity-80 focus:text-opacity-80"
                >
                  {" "}
                  Customer Support{" "}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  title=""
                  className="text-base text-white transition-all duration-200 hover:text-opacity-80 focus:text-opacity-80"
                >
                  {" "}
                  Delivery Details{" "}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  title=""
                  className="text-base text-white transition-all duration-200 hover:text-opacity-80 focus:text-opacity-80"
                >
                  {" "}
                  Terms & Conditions{" "}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  title=""
                  className="text-base text-white transition-all duration-200 hover:text-opacity-80 focus:text-opacity-80"
                >
                  {" "}
                  Privacy Policy{" "}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-darker-blue mb-10 mt-16" />

        <div className="flex flex-wrap items-center justify-between">
          <Image
            src="/inverted-logo.png"
            alt="inverted-logo"
            width={150}
            height={150}
          />

          <p className="mt-8 w-full text-center text-sm text-gray-100 md:order-2 md:mt-0 md:w-auto">
            © Copyright 2024, All Rights Reserved by Spireo
          </p>
        </div>
      </div>
    </section>
  );
};

export default Footer;
