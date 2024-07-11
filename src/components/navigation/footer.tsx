"use client";
import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard")) {
    return null;
  }
  return (
    <section className="bg-black py-10 sm:pt-16 lg:pt-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {" "}
        {/* Reduced max-width */}
        <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 md:grid-cols-3 md:gap-x-8">
          <div>
            <p className="text-base text-primary-blue">Company</p>
            <ul className="mt-8 space-y-4">
              <li>
                <a
                  href="#"
                  className="text-base text-white transition-all duration-200 hover:text-opacity-80 focus:text-opacity-80"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-base text-white transition-all duration-200 hover:text-opacity-80 focus:text-opacity-80"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-base text-white transition-all duration-200 hover:text-opacity-80 focus:text-opacity-80"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-base text-primary-blue">Help</p>
            <ul className="mt-8 space-y-4">
              <li>
                <a
                  href="#"
                  className="text-base text-white transition-all duration-200 hover:text-opacity-80 focus:text-opacity-80"
                >
                  Customer Support
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-base text-white transition-all duration-200 hover:text-opacity-80 focus:text-opacity-80"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-base text-white transition-all duration-200 hover:text-opacity-80 focus:text-opacity-80"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-base text-primary-blue">Extra Links</p>
            <ul className="mt-8 space-y-4">
              <li>
                <a
                  href="#"
                  className="text-base text-white transition-all duration-200 hover:text-opacity-80 focus:text-opacity-80"
                >
                  Customer Support
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-base text-white transition-all duration-200 hover:text-opacity-80 focus:text-opacity-80"
                >
                  Delivery Details
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-base text-white transition-all duration-200 hover:text-opacity-80 focus:text-opacity-80"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-base text-white transition-all duration-200 hover:text-opacity-80 focus:text-opacity-80"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <hr className="mb-10 mt-16 border-darker-blue" />
        <div className="flex flex-col items-center justify-between">
          <Image
            src="/inverted-logo.png"
            alt="inverted-logo"
            width={150}
            height={150}
          />

          <p className="mt-8 text-sm text-gray-100">
            © Copyright 2024, All Rights Reserved by Spireo
          </p>
        </div>
      </div>
    </section>
  );
};

export default Footer;
