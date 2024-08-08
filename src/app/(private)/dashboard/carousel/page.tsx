// In your TemplateSelector component (page.tsx)
import React from "react";
import Link from "next/link";
import { templates } from "./templateData";

const TemplateSelector: React.FC = () => {
  return (
    <main>
      <div className="mb-2 text-left">
        <h1 className="text-xl font-semibold tracking-tight text-brand-gray-900">
          Build Eye-Catching Carousels
        </h1>
        <p className="text-sm text-brand-gray-500">
          Choose one of our captivating carousel templates to get started. Our
          AI-powered tools will help you create stunning visuals in no time.
        </p>
      </div>
      <div className="pt-8">
        <div className="container grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Link
              href={`/dashboard/carousel/${template.component}`}
              key={template.id}
            >
              <div className="group overflow-hidden rounded-lg border border-brand-gray-200 transition-all">
                <img
                  src={template.imageSrc}
                  alt={template.name}
                  className="h-48 w-full p-10 transition-transform group-hover:scale-105"
                />
                <div className="bg-card p-4 text-brand-gray-900">
                  <h3 className="text-md font-semibold tracking-tight">
                    {template.name}
                  </h3>
                  <p className="text-sm text-brand-gray-500">
                    {template.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default TemplateSelector;
