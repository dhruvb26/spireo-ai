"use client";
import React, { useState, useRef } from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageSquare, Package } from "@phosphor-icons/react";
import {
  FileArrowDown,
  CaretLeft,
  CaretRight,
  Plus,
  TrashSimple,
} from "@phosphor-icons/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface Slide {
  title: string;
  content: string;
}

interface Theme {
  name: string;
  backgroundColor: string;
  textColor: string;
  accentColor?: string;
}

interface BaseCarouselTemplateProps {
  initialSlides: Slide[];
  themes: Theme[];
  renderSlide: (
    slide: Slide,
    index: number,
    theme: Theme,
    name: string,
    handle: string,
    userImage: string,
    ref: React.RefObject<HTMLDivElement>,
  ) => React.ReactNode;
  title: string;
}

const BaseCarouselTemplate: React.FC<BaseCarouselTemplateProps> = ({
  initialSlides,
  themes,
  renderSlide,
  title,
}) => {
  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [name, setName] = useState("Spireo User");
  const [handle, setHandle] = useState("@spireoai");
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0] as any);
  const [downloading, setDownloading] = useState(false);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [userImage, setUserImage] = useState<string>("");

  useEffect(() => {
    const fetchUserImage = async () => {
      try {
        const response = await fetch("/api/session", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const session = await response.json();
        const data = session.session;
        console.log("User data:", data);
        if (data.user && data.user.image) {
          console.log("User image:", data.user.image);
          setUserImage(data.user.image);
        }
      } catch (error) {
        console.error("Error fetching user image:", error);
      }
    };

    fetchUserImage();
  }, []);

  const downloadPDF = async () => {
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [1080, 1080],
    });

    setDownloading(true);

    for (let i = 0; i < slides.length; i++) {
      const slideElement = slideRefs.current[i];

      if (slideElement) {
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const canvas = await html2canvas(slideElement, {
            scale: 3,
            useCORS: true,
            logging: true,
          });

          const imgData = canvas.toDataURL("image/png", 1.0);

          if (i !== 0) {
            pdf.addPage([1080, 1080]);
          }

          pdf.addImage(imgData, "PNG", 0, 0, 1080, 1080);
        } catch (error) {
          console.error(`Error processing slide ${i}:`, error);
        }
      }
    }

    pdf.save("Spireo Carousel.pdf");
    setDownloading(false);
  };

  const downloadImage = async () => {
    const slideElement = slideRefs.current[currentSlide];

    if (slideElement) {
      try {
        const canvas = await html2canvas(slideElement, {
          scale: 3,
          useCORS: true,
          logging: true,
        });

        const link = document.createElement("a");
        link.download = `Spireo_Slide_${currentSlide + 1}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } catch (error) {
        console.error(
          `Error downloading slide ${currentSlide} as image:`,
          error,
        );
      }
    }
  };

  const downloadAllImages = async () => {
    setDownloadingZip(true);
    const zip = new JSZip();

    try {
      for (let i = 0; i < slides.length; i++) {
        const slideElement = slideRefs.current[i];
        if (slideElement) {
          const canvas = await html2canvas(slideElement, {
            scale: 3,
            useCORS: true,
            logging: true,
          });
          const imgData = canvas.toDataURL("image/png").split(",")[1];
          zip.file(`Spireo_Slide_${i + 1}.png`, imgData, { base64: true });
        }
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "Spireo_Slides.zip");
    } catch (error) {
      console.error("Error creating zip file:", error);
    } finally {
      setDownloadingZip(false);
    }
  };

  const nextSlide = () => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
  };

  const prevSlide = () => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  const updateSlide = (field: keyof Slide, value: string) => {
    setSlides((prevSlides) =>
      prevSlides.map((slide, index) =>
        index === currentSlide ? { ...slide, [field]: value } : slide,
      ),
    );
  };

  const addSlide = () => {
    const newSlide: Slide = { title: "New Slide", content: "New content" };
    setSlides([...slides, newSlide]);
    setCurrentSlide(slides.length);
  };

  const deleteSlide = () => {
    if (slides.length > 1) {
      const newSlides = slides.filter((_, index) => index !== currentSlide);
      setSlides(newSlides);
      setCurrentSlide(currentSlide === 0 ? 0 : currentSlide - 1);
    }
  };

  return (
    <div className="flex max-h-fit max-w-6xl flex-col items-start justify-start">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex w-full flex-col">
          <h1 className="text-2xl font-bold tracking-tighter text-brand-gray-900 sm:text-3xl">
            {title}
          </h1>
        </div>
      </div>
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left Sidebar */}
        <div className="rounded-lg border border-brand-gray-200 bg-white p-4 shadow lg:w-1/3 lg:p-6">
          <div className="mb-4">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <Label>Profile Pic</Label>
          <div className="mb-4 flex h-fit flex-row items-end space-x-2">
            <img
              src={userImage}
              alt="User profile"
              className="h-12 w-12 rounded-full"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="handle">Handle</Label>
            <Input
              id="handle"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Label>Background</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {themes.map((theme) => (
                <div
                  key={theme.name}
                  className="h-8 w-8 cursor-pointer rounded border border-brand-gray-50 shadow-sm"
                  style={{ backgroundColor: theme.backgroundColor }}
                  onClick={() => setCurrentTheme(theme)}
                />
              ))}
            </div>
          </div>
          <div className="mb-4">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <Input
              id="primaryColor"
              value={currentTheme.backgroundColor}
              onChange={(e) =>
                setCurrentTheme({
                  ...currentTheme,
                  backgroundColor: e.target.value,
                })
              }
            />
          </div>
          <div className="mt-20 flex w-full flex-col items-center justify-center space-y-2"></div>
        </div>

        {/* Right Panel - Slide Preview */}
        <div className="flex w-full flex-col rounded-lg border border-brand-gray-200 bg-white p-4 shadow lg:flex-row lg:space-x-6 lg:p-6">
          <div className="mb-6 flex flex-col items-center justify-between lg:mb-0 lg:w-1/3">
            <div className="flex w-full flex-col">
              <div className="mb-4">
                <Label className="font-bold text-brand-gray-900">
                  SLIDE {currentSlide + 1}
                </Label>
              </div>
              <div className="mb-4">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  className="w-full text-sm"
                  value={slides[currentSlide]?.title || ""}
                  onChange={(e) => updateSlide("title", e.target.value)}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="content">Content</Label>
                <textarea
                  id="content"
                  value={slides[currentSlide]?.content || ""}
                  onChange={(e) => updateSlide("content", e.target.value)}
                  className="w-full rounded-md border p-2 text-sm"
                  rows={5}
                />
              </div>
            </div>

            <div className="flex w-full flex-col items-center justify-center">
              <div className="mb-4 flex w-full items-center justify-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={addSlide}
                        className="flex items-center rounded-lg px-4 py-2 text-sm text-brand-gray-400 hover:text-brand-gray-600"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add Slide</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={deleteSlide}
                        className="flex items-center px-4 py-2 text-sm text-brand-gray-400 hover:text-brand-gray-600"
                        disabled={slides.length <= 1}
                      >
                        <TrashSimple className="h-5 w-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete Slide</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center justify-center space-x-4 py-4">
                <button
                  onClick={prevSlide}
                  className="rounded-full bg-brand-gray-100 p-2 text-brand-gray-600 hover:bg-brand-gray-200 hover:text-brand-gray-800"
                >
                  <CaretLeft weight="bold" size={24} />
                </button>
                <span className="text-sm text-brand-gray-500">
                  {currentSlide + 1} / {slides.length}
                </span>
                <button
                  onClick={nextSlide}
                  className="rounded-full bg-brand-gray-100 p-2 text-brand-gray-600 hover:bg-brand-gray-200 hover:text-brand-gray-800"
                >
                  <CaretRight weight="bold" size={24} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col items-center justify-center">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={index === currentSlide ? "block w-full" : "hidden"}
              >
                {renderSlide(
                  slide,
                  index,
                  currentTheme,
                  name,
                  handle,
                  userImage,
                  {
                    current: slideRefs.current[index] as any,
                  },
                )}
              </div>
            ))}
            <div className="mt-8 flex w-1/2 flex-row items-center justify-end space-x-2">
              <Button
                onClick={downloadPDF}
                className="flex items-center rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-700 hover:text-white"
                disabled={downloading}
              >
                {downloading ? (
                  <>Downloading...</>
                ) : (
                  <>
                    Carousel
                    <FileArrowDown className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
              <Button
                onClick={downloadAllImages}
                className="flex items-center rounded-lg bg-brand-gray-800 px-4 py-2 text-sm text-white hover:bg-brand-gray-900 hover:text-white"
                disabled={downloadingZip}
              >
                {downloadingZip ? (
                  <>Creating Zip...</>
                ) : (
                  <>
                    All Slides
                    <Package className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
              <Button
                onClick={downloadImage}
                className="flex items-center rounded-lg bg-brand-gray-800 px-4 py-2 text-sm text-white hover:bg-brand-gray-900 hover:text-white"
              >
                Current Slide
                <ImageSquare className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden slides for PDF generation */}
      {/* Hidden slides for PDF generation */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        {slides.map((slide, index) => (
          <div key={index} ref={(el: any) => (slideRefs.current[index] = el)}>
            {renderSlide(slide, index, currentTheme, name, handle, userImage, {
              current: slideRefs.current[index] as any,
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BaseCarouselTemplate;
