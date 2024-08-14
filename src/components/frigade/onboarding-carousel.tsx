"use client";
import React from "react";
import * as Frigade from "@frigade/react";
import { Loader2 } from "lucide-react";

const OnboardingCarousel = () => {
  return (
    <Frigade.Checklist.Carousel
      border="none"
      px={0}
      className="[&_.fr-title]:text-md  [&_.fr-button-primary:hover]:bg-blue-700 [&_.fr-button-primary]:rounded-lg [&_.fr-button-primary]:bg-blue-600 [&_.fr-button-secondary]:rounded-lg [&_.fr-subtitle]:text-brand-gray-500 [&_.fr-title]:font-semibold [&_.fr-title]:tracking-tight [&_.fr-title]:text-brand-gray-900"
      flowId="flow_pUF3qW42"
      loadingComponent={<Loader2 className="animate-spin text-blue-600" />}
    />
  );
};

export default OnboardingCarousel;
