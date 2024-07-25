import React from "react";
import BaseCarouselTemplate from "./base-carousel-template";
import { ArrowRight, Repeat, UploadIcon } from "lucide-react";
import { BookmarkSimple, ChatTeardrop, Heart } from "@phosphor-icons/react";

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

const SlideWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="aspect-square max-w-[540px] overflow-hidden">{children}</div>
);

const IntroSlide: React.FC<{
  slide: Slide;
  theme: Theme;
  name: string;
  handle: string;
  userImage: string;
}> = ({ slide, theme, name, handle, userImage }) => (
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
                src={userImage}
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
  userImage: string;
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
          <span>
            <ChatTeardrop size={22} weight="bold" />
          </span>
          <span>
            <Repeat />
          </span>
          <span>
            <Heart size={22} weight="bold" />
          </span>
          <span>
            <BookmarkSimple size={22} weight="bold" />
          </span>
          <span>
            <UploadIcon />
          </span>
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
  userImage: string;
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

const TweetStyleCarousel: React.FC = () => {
  return (
    <BaseCarouselTemplate
      title="X Style"
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

export default TweetStyleCarousel;
