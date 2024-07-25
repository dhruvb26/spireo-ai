"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Trash2,
  Plus,
  Repeat,
  UploadIcon,
} from "lucide-react";
import html2canvas from "html2canvas";
import { Sarabun } from "next/font/google";
import jsPDF from "jspdf";
import {
  BookmarkSimple,
  CaretLeft,
  CaretRight,
  ChatTeardrop,
  FileArrowDown,
  Heart,
  TrashSimple,
} from "@phosphor-icons/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface Slide {
  title: string;
  content: string;
}

const sarabun = Sarabun({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

interface Theme {
  name: string;
  backgroundColor: string;
  textColor: string;
  accentColor?: string;
}
const AllSlides: React.FC<{
  slides: Slide[];
  theme: Theme;
  name: string;
  handle: string;
  refs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}> = ({ slides, theme, name, handle, refs }) => (
  <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
    {slides.map((slide, index) => (
      <div
        key={index}
        ref={(el: HTMLDivElement | null) => {
          if (el) refs.current[index] = el;
        }}
      >
        {index === 0 ? (
          <IntroSlide slide={slide} theme={theme} name={name} handle={handle} />
        ) : index === slides.length - 1 ? (
          <OutroSlide slide={slide} theme={theme} name={name} handle={handle} />
        ) : (
          <ContentSlide
            slide={slide}
            theme={theme}
            name={name}
            handle={handle}
          />
        )}
      </div>
    ))}
  </div>
);
const themes: Theme[] = [
  {
    name: "White",
    backgroundColor: "#000000",
    accentColor: "#4b5563",
    textColor: "#ffffff",
  },
  {
    name: "Blue",
    backgroundColor: "#3b82f6",
    accentColor: "#1d4ed8",
    textColor: "#ffffff",
  },
  {
    name: "Yellow",
    backgroundColor: "#eab308",
    accentColor: "#854d0e",
    textColor: "#ffffff",
  },
  {
    name: "Red",
    backgroundColor: "#ef4444",
    accentColor: "#b91c1c",
    textColor: "#ffffff",
  },
  {
    name: "Green",
    backgroundColor: "#22c55e",
    accentColor: "#15803d",
    textColor: "#ffffff",
  },
  {
    name: "Purple",
    backgroundColor: "#8b5cf6",
    accentColor: "#6d28d9",
    textColor: "#ffffff",
  },
  {
    name: "Pink",
    backgroundColor: "#ec4899",
    accentColor: "#be185d",
    textColor: "#ffffff",
  },
  {
    name: "Indigo",
    backgroundColor: "#6366f1",
    accentColor: "#4338ca",
    textColor: "#ffffff",
  },
];
const SlideWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="h-[540px] w-[540px] overflow-hidden ">{children}</div>;
const IntroSlide: React.FC<{
  slide: Slide;
  theme: Theme;
  name: string;
  handle: string;
}> = ({ slide, theme, name, handle }) => (
  <SlideWrapper>
    <div
      className={`aspect-square w-full overflow-hidden`}
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div className="flex h-full flex-col justify-between p-6">
        <div className="flex h-full max-w-sm items-center justify-center text-wrap text-left">
          <h2
            className="mb-4 text-7xl font-black tracking-tighter"
            style={{ color: theme.textColor }}
          >
            {slide.title}
          </h2>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex flex-row items-start justify-start space-x-2">
              <img
                src={
                  "https://media.licdn.com/dms/image/D4E03AQFsQskxImXg0w/profile-displayphoto-shrink_100_100/0/1708111490647?e=2147483647&v=beta&t=6gqtqUb-nKKy1dX_qDl8MFpaf2ne3c3cIhrCmRYp4lM"
                }
                alt="User profile"
                className="h-12 w-12 rounded-full"
              />
              <div className="flex flex-col items-start">
                <span
                  className="font-semibold"
                  style={{ color: theme.textColor }}
                >
                  {name}
                </span>
                <span
                  className="text-right text-sm"
                  style={{ color: theme.textColor }}
                >
                  {handle}
                </span>
              </div>
            </div>
          </div>
          <div
            className="rounded-full bg-white p-2"
            style={{ color: theme.backgroundColor }}
          >
            <ArrowRight className="h-6 w-6 " />
          </div>
        </div>
      </div>
    </div>
  </SlideWrapper>
);

const ContentSlide: React.FC<{
  slide: Slide;
  theme: Theme;
  name: string;
  handle: string;
}> = ({ slide, theme, name, handle }) => (
  <SlideWrapper>
    <div
      className="flex aspect-square h-full max-w-6xl items-center justify-center overflow-hidden px-10"
      style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
    >
      <div className="flex w-full max-w-md flex-col justify-between space-y-4 p-6">
        <div>
          <div className="mb-4 flex items-center">
            <img
              src="https://media.licdn.com/dms/image/D4E03AQFsQskxImXg0w/profile-displayphoto-shrink_100_100/0/1708111490647?e=2147483647&v=beta&t=6gqtqUb-nKKy1dX_qDl8MFpaf2ne3c3cIhrCmRYp4lM"
              alt="Profile"
              className="mr-3 h-12 w-12 rounded-full"
            />
            <div>
              <div className="font-semibold">{name}</div>
              <div style={{ color: theme.accentColor }}>{handle}</div>
            </div>
          </div>
          <div className="mb-4 text-wrap font-light">
            <p>{slide.content}</p>
          </div>
        </div>
        <div
          className="flex items-center justify-center space-x-12 border-t py-2 text-sm"
          style={{ borderColor: theme.accentColor, color: theme.accentColor }}
        >
          <ChatTeardrop size={22} weight="bold" />
          <Repeat />
          <Heart size={22} weight="bold" />
          <BookmarkSimple size={22} weight="bold" />
          <UploadIcon />
        </div>
      </div>
    </div>
  </SlideWrapper>
);

const OutroSlide: React.FC<{
  slide: Slide;
  theme: Theme;
  name: string;
  handle: string;
}> = ({ slide, theme, name, handle }) => (
  <SlideWrapper>
    <div
      className={`aspect-square w-full overflow-hidden`}
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div className="flex h-full flex-col justify-between p-6">
        <div className="flex h-full max-w-sm items-center justify-center text-wrap text-left">
          <h2
            className="mb-4 text-6xl font-black tracking-tighter"
            style={{ color: theme.textColor }}
          >
            {slide.title}
          </h2>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex flex-row items-start justify-start space-x-2">
              <img
                src={
                  "https://media.licdn.com/dms/image/D4E03AQFsQskxImXg0w/profile-displayphoto-shrink_100_100/0/1708111490647?e=2147483647&v=beta&t=6gqtqUb-nKKy1dX_qDl8MFpaf2ne3c3cIhrCmRYp4lM"
                }
                alt="User profile"
                className="h-12 w-12 rounded-full"
              />
              <div className="flex flex-col items-start">
                <span
                  className="font-semibold"
                  style={{ color: theme.textColor }}
                >
                  {name}
                </span>
                <span
                  className="text-right text-sm"
                  style={{ color: theme.textColor }}
                >
                  {handle}
                </span>
              </div>
            </div>
          </div>
          <div
            className="rounded-full bg-white p-2"
            style={{ color: theme.backgroundColor }}
          >
            <ArrowRight className="h-6 w-6 " />
          </div>
        </div>
      </div>
    </div>
  </SlideWrapper>
);

const CarouselPage: React.FC = () => {
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { id } = useParams();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [name, setName] = useState("Spireo User");
  const [handle, setHandle] = useState("@spireoai");
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0] as Theme);
  const [downloading, setDownloading] = useState(false);
  const downloadPDF = async () => {
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [1080, 1080],
    });

    for (let i = 0; i < slides.length; i++) {
      const slideElement = slideRefs.current[i];

      if (slideElement) {
        try {
          setDownloading(true);
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const canvas = await html2canvas(slideElement, {
            scale: 3,
            useCORS: true,
            logging: true,
            // width: 1080,
            // height: 1080,
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

    pdf.save("Spireo Tweet Style Carousel.pdf");
    setDownloading(false);
  };
  useEffect(() => {
    const initialSlides: Slide[] = [
      {
        title: "5 Ways to Grow on LinkedIn",
        content: "",
      },
      {
        title: "",
        content:
          "Engage authentically: Comment thoughtfully on others' posts to build relationships and increase your visibility.",
      },
      {
        title: "",
        content:
          "Optimize your profile: Use a professional photo, compelling headline, and detailed 'About' section to make a strong first impression.",
      },
      {
        title: "",
        content:
          "Share your expertise: Write articles or create short-form posts on topics in your field to establish yourself as a thought leader.",
      },
      {
        title: "",
        content:
          "Use hashtags strategically: Include 3-5 relevant hashtags in your posts to reach a wider audience interested in your content.",
      },
      {
        title: "Follow for more such tips!",
        content: "",
      },
    ];
    setSlides(initialSlides);
  }, [id]);

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
    const newSlide: Slide = {
      title: "New Slide",
      content: "New content",
    };
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

  const renderSlidePreview = (slide: Slide, index: number) => {
    if (index === 0) {
      return (
        <div
          ref={(el: HTMLDivElement | null) => {
            if (el) slideRefs.current[index] = el;
          }}
        >
          <IntroSlide
            slide={slide}
            theme={currentTheme}
            name={name}
            handle={handle}
          />
        </div>
      );
    } else if (index === slides.length - 1) {
      return (
        <div
          ref={(el: HTMLDivElement | null) => {
            if (el) slideRefs.current[index] = el;
          }}
        >
          <OutroSlide
            slide={slide}
            theme={currentTheme}
            name={name}
            handle={handle}
          />
        </div>
      );
    } else {
      return (
        <div
          ref={(el: HTMLDivElement | null) => {
            if (el) slideRefs.current[index] = el;
          }}
        >
          <ContentSlide
            slide={slide}
            theme={currentTheme}
            name={name}
            handle={handle}
          />
        </div>
      );
    }
  };

  return (
    <div className="max-w-6xl px-4 py-6 sm:px-6  lg:px-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex w-full flex-col">
          <h1 className="text-2xl font-bold tracking-tighter text-brand-gray-900 sm:text-3xl">
            Tweet Style
          </h1>
        </div>
      </div>
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left Sidebar */}
        <div className=" rounded-lg border border-brand-gray-200 bg-white p-4 shadow lg:w-1/3 lg:p-6">
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
            {/* <div className="mt-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200"></div> */}
            <img
              src={
                "https://media.licdn.com/dms/image/D4E03AQFsQskxImXg0w/profile-displayphoto-shrink_100_100/0/1708111490647?e=2147483647&v=beta&t=6gqtqUb-nKKy1dX_qDl8MFpaf2ne3c3cIhrCmRYp4lM"
              }
              alt="User profile"
              className="h-12 w-12 rounded-full"
            />
            {/* <button className="mr-2 flex items-center justify-center rounded-lg bg-brand-gray-100 px-4 py-2 text-sm text-brand-gray-700 hover:bg-brand-gray-200 ">
              <Upload className=" inline h-4 w-4" />
            </button> */}
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
                  className="h-8 w-8 cursor-pointer rounded border border-brand-gray-50  shadow-sm"
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
          <div className=" mt-20 flex w-full items-center justify-center">
            <Button
              onClick={downloadPDF}
              className="flex items-center rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-700 hover:text-white"
              disabled={downloading}
            >
              {downloading ? (
                <>Downloading...</>
              ) : (
                <>
                  Download Carousel
                  <FileArrowDown className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right Panel - Slide Preview */}
        <div className="flex w-full flex-col rounded-lg border border-brand-gray-200 bg-white p-4 shadow  lg:flex-row lg:space-x-6 lg:p-6">
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

          <div className="flex w-full justify-center">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={index === currentSlide ? "block w-full" : "hidden"}
              >
                {renderSlidePreview(slide, index)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <AllSlides
        slides={slides}
        theme={currentTheme}
        name={name}
        handle={handle}
        refs={slideRefs}
      />
    </div>
  );
};

export default CarouselPage;
