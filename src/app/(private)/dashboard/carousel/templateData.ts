// src/app/(private)/dashboard/carousel/templateData.ts
import { v4 as uuidv4 } from "uuid";

export const templates = [
  {
    id: uuidv4(),
    name: "X Style",
    component: "x-style",
    description: "Clean and simple design for a focused message.",
    imageSrc: "/x-logo.svg",
  },
  {
    id: uuidv4(),
    name: "Minimal",
    component: "minimal-style",
    description: "A sleek design with a modern touch.",
    imageSrc: "/linkedin-logo.svg",
  },
];
