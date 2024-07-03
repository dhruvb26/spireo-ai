"use client";
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { SlideEditor } from "@/app/(private)/dashboard/_components/slide-editor";
import { SlideCarousel } from "@/app/(private)/dashboard/_components/slide-carousel";
import { Slide } from "@/app/types/types";

interface SlidesEditorProps {
  initialTemplateId: string;
  initialSvgContent: string;
}

const SlidesEditor: React.FC<SlidesEditorProps> = ({
  initialTemplateId,
  initialSvgContent,
}) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#0A66C2");
  const [primaryColor, setPrimaryColor] = useState("#FFFFFF");
  const [secondaryColor, setSecondaryColor] = useState("#FFFFFF");

  const [slides, setSlides] = useState<Slide[]>([
    {
      id: 1,
      title: "Welcome to My Presentation",
      description: `Hi, I'm ${name || "Your Name"}. Let's dive in!`,
      textColor: secondaryColor || "#3498DB",
      titleColor: primaryColor || "#E74C3C",
      titleStyles: {
        bold: true,
        italic: false,
        underline: false,

        fontSize: 24,
        x: 30,
        y: 80,
        align: "start",
      },
      descriptionStyles: {
        bold: false,
        italic: false,
        underline: false,
        fontSize: 16,
        x: 30,
        y: 120,
        align: "start",
      },
      backgroundSvg: initialSvgContent,
    },
  ]);

  const [currentSlide, setCurrentSlide] = useState(0);

  const updateSlide = (field: keyof Slide, value: string | object) => {
    setSlides((prevSlides) =>
      prevSlides.map((slide, index) =>
        index === currentSlide ? { ...slide, [field]: value } : slide,
      ),
    );
  };

  const toggleStyle = (
    field: "titleStyles" | "descriptionStyles",
    style: "bold" | "italic" | "underline",
  ) => {
    const currentSlideData = slides[currentSlide];
    if (!currentSlideData) return;

    const currentStyles = currentSlideData[field];
    if (!currentStyles) return;

    updateSlide(field, {
      ...currentStyles,
      [style]: !currentStyles[style],
    });
  };

  const updateStyleProperty = (
    field: "titleStyles" | "descriptionStyles",
    property: keyof any,
    value: number | string,
  ) => {
    const currentSlideData = slides[currentSlide];
    if (!currentSlideData) return;

    const currentStyles = currentSlideData[field];
    if (!currentStyles) return;

    updateSlide(field, {
      ...currentStyles,
      [property]: value,
    });
  };

  const deleteSlide = (id: number) => {
    setSlides((prevSlides) => prevSlides.filter((slide) => slide.id !== id));
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const addSlide = () => {
    setSlides([
      ...slides,
      {
        id: slides.length + 1,
        title: "New Slide",
        description: "Description here",
        titleColor: primaryColor || "#E74C3C",
        titleStyles: {
          bold: false,
          italic: false,
          underline: false,
          fontSize: 24,
          x: 30,
          y: 80,
          align: "start",
        },
        descriptionStyles: {
          bold: false,
          italic: false,
          underline: false,
          fontSize: 16,
          x: 30,
          y: 120,
          align: "start",
        },
        textColor: secondaryColor || "#3498DB",
        backgroundSvg: initialSvgContent,
      },
    ]);
  };

  const downloadAsPNG = (index: number) => {
    const svg = document.querySelector(`svg:nth-of-type(${index + 1})`);
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `slide_${index + 1}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
    }
  };

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col space-y-4 p-4">
      <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        <div className="w-full md:w-1/2">
          <SlideEditor
            slide={slides[currentSlide] as Slide}
            updateSlide={updateSlide}
            toggleStyle={toggleStyle}
            updateStyleProperty={updateStyleProperty}
          />
        </div>
        <div className="w-full md:w-1/2">
          <SlideCarousel
            slides={slides}
            setCurrentSlide={setCurrentSlide}
            downloadAsPNG={downloadAsPNG}
          />
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <Button onClick={addSlide}>Add Slide</Button>
        <Button
          variant="destructive"
          onClick={() => deleteSlide(slides[currentSlide]?.id || 0)}
          disabled={slides.length <= 1}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Delete Slide
        </Button>
      </div>
    </div>
  );
};

export default SlidesEditor;
