"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { MoonLoader } from "react-spinners";

const CarouselPage = () => {
  const params = useParams();
  const componentName = params.id as string;
  const [Template, setTemplate] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    if (componentName) {
      import(`@/app/(private)/dashboard/carousel/_components/${componentName}`)
        .then((module) => {
          setTemplate(() => module.default);
        })
        .catch((err) => console.error("Failed to load template:", err));
    }
  }, [componentName]);

  if (!Template) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <MoonLoader size={50} color="#333333" />
      </div>
    );
  }

  return (
    <div className="max-h-fit overflow-y-hidden">
      <Template />
    </div>
  );
};

export default CarouselPage;
