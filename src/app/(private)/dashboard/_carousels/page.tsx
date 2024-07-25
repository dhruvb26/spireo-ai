"use client";
import React from "react";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

// Mock data for carousel templates
const carouselTemplates = [
  {
    id: uuidv4(),
    name: "Twitter Style",
    description: "Clean and simple design for a focused message.",
    imageSrc: "/Social-Media-Twitter--Streamline-Freehand.svg",
  },
];

const CarouselPage = () => {
  return (
    <div className="max-w-6xl lg:max-w-[85rem]">
      <div className="container space-y-2 text-left">
        <h1 className="text-3xl font-bold tracking-tighter text-brand-gray-900">
          Build Eye-Catching Carousels
        </h1>
        <p className="text-md mx-auto text-brand-gray-500">
          Choose one of our captivating carousel templates to get started. Our
          AI-powered tools will help you create stunning visuals in no time.
        </p>
      </div>

      <section className="py-12">
        <div className="container grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {carouselTemplates.map((template) => (
            <Link
              href={`/dashboard/carousels/${template.id}`}
              key={template.id}
            >
              <div className="group overflow-hidden rounded-lg border border-brand-gray-200 transition-all">
                <img
                  src={template.imageSrc}
                  alt={template.name}
                  className="h-48 w-full p-10 transition-transform group-hover:scale-105"
                />
                <div className="bg-card p-4 text-brand-gray-900">
                  <h3 className="text-lg font-semibold">{template.name}</h3>
                  <p className="text-sm text-brand-gray-500">
                    {template.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CarouselPage;
