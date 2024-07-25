import React from "react";
import BaseCarouselTemplate from "./base-carousel-template";
import { ArrowRight, Repeat, UploadIcon } from "lucide-react";
import { Oswald } from "next/font/google";
import { BookmarkSimple, ChatTeardrop, Heart } from "@phosphor-icons/react";

interface Slide {
  title: string;
  content: string;
}

const oswald = Oswald({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

interface Theme {
  name: string;
  backgroundColor: string;
  textColor: string;
  accentColor?: string;
}

const SlideWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    className={`aspect-square max-w-[540px] overflow-hidden ${oswald.className}`}
  >
    {children}
  </div>
);

const CurvedLines = ({ color }: { color: string }) => (
  <svg
    className="absolute bottom-0 right-0"
    width="120"
    height="120"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M120 0C120 66.2741 66.2741 120 0 120"
      stroke={color}
      strokeWidth="2"
      strokeOpacity="0.2"
    />
    <path
      d="M120 40C120 84.1828 84.1828 120 40 120"
      stroke={color}
      strokeWidth="2"
      strokeOpacity="0.2"
    />
    <path
      d="M120 80C120 102.091 102.091 120 80 120"
      stroke={color}
      strokeWidth="2"
      strokeOpacity="0.2"
    />
  </svg>
);

const IntroSlide: React.FC<{
  slide: Slide;
  theme: Theme;
  name: string;
  handle: string;
  userImage: string;
}> = ({ slide, theme, name, handle }) => (
  <SlideWrapper>
    <div
      className="relative flex h-full flex-col justify-between p-8"
      style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
    >
      <div className="flex justify-between text-sm font-light">
        <span>Content Tips</span>
        <span>{handle}</span>
      </div>
      <div className="z-10">
        <h2 className="mb-4 text-5xl font-bold leading-tight">{slide.title}</h2>
        <p className="text-lg">{slide.content}</p>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-medium">{name}</span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 12H19M19 12L12 5M19 12L12 19"
            stroke={theme.textColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <CurvedLines color={theme.textColor} />
    </div>
  </SlideWrapper>
);

const ContentSlide: React.FC<{
  slide: Slide;
  theme: Theme;
  name: string;
  handle: string;
  userImage: string;
}> = ({ slide, theme, name, handle }) => (
  <SlideWrapper>
    <div
      className="relative flex h-full flex-col justify-between p-8"
      style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
    >
      <div className="flex justify-between text-sm font-light">
        <span>Content Tips</span>
        <span>{handle}</span>
      </div>
      <div className="z-10">
        <h2 className="mb-4 text-3xl font-bold">{slide.title}</h2>
        <p className="text-lg">{slide.content}</p>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-medium">{name}</span>
        <span
          className="rounded-full bg-white px-3 py-1 text-sm font-medium"
          style={{ color: theme.backgroundColor }}
        >
          Next
        </span>
      </div>
      <CurvedLines color={theme.textColor} />
    </div>
  </SlideWrapper>
);

const OutroSlide: React.FC<{
  slide: Slide;
  theme: Theme;
  name: string;
  userImage: string;
  handle: string;
}> = ({ slide, theme, name, handle }) => (
  <SlideWrapper>
    <div
      className="relative flex h-full flex-col justify-between p-8"
      style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
    >
      <div className="flex justify-between text-sm font-light">
        <span>Content Tips</span>
        <span>{handle}</span>
      </div>
      <div className="z-10">
        <h2 className="mb-4 text-3xl font-bold">{slide.title}</h2>
        <p className="text-xl">{slide.content}</p>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-medium">{name}</span>
        <span
          className="rounded-full bg-white px-3 py-1 text-sm font-medium"
          style={{ color: theme.backgroundColor }}
        >
          Save
        </span>
      </div>
      <CurvedLines color={theme.textColor} />
    </div>
  </SlideWrapper>
);
const renderSlide = (
  slide: Slide,
  index: number,
  theme: Theme,
  name: string,
  handle: string,
  userImage: string,
  slides: Slide[],
  ref: React.RefObject<HTMLDivElement>,
) => {
  const SlideComponent =
    index === 0
      ? IntroSlide
      : index === slides.length - 1
        ? OutroSlide
        : ContentSlide;
  return (
    <div ref={ref}>
      <SlideComponent
        slide={slide}
        theme={theme}
        name={name}
        handle={handle}
        userImage={userImage}
      />
    </div>
  );
};

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

const initialSlides: Slide[] = [
  {
    title: "Things to understand from your audience",
    content: "Content Tips",
  },
  {
    title: "Personality",
    content:
      "Recognize who your audience is, on the same level that you already know your close friends and who they really are.",
  },
  {
    title: "Values and beliefs",
    content:
      "Know what your audience cares about and what they believe about themselves to the world.",
  },
  {
    title: "Hope and Fears",
    content:
      "Know your audience's deepest hope or biggest dream, and their deepest fears or nightmares.",
  },
  {
    title: "If you find this helpful, like and share it with your friends",
    content: "Follow for more content",
  },
];

const MinimalStyleCarousel: React.FC = () => {
  return (
    <BaseCarouselTemplate
      title="Minimal #1"
      initialSlides={initialSlides}
      themes={themes}
      renderSlide={(slide, index, theme, name, handle, userImage, ref) =>
        renderSlide(
          slide,
          index,
          theme,
          name,
          handle,
          userImage,
          initialSlides,
          ref,
        )
      }
    />
  );
};

export default MinimalStyleCarousel;
