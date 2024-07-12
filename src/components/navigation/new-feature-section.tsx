import React from "react";
import { CheckIcon } from "lucide-react";
import FadeSeparator from "../ui/fade-separator";

interface FeatureSectionProps {
  spanText: string;
  title: string;
  description: string[];
  imageUrl: string;
  quote?: string;
  authorName?: string;
  authorTitle?: string;
  authorImageUrl?: string;
  reversed?: boolean;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({
  spanText,
  title,
  description,
  imageUrl,
  quote,
  authorName,
  authorTitle,
  authorImageUrl,
  reversed = false,
}) => (
  <div
    className={`grid grid-cols-1 items-center gap-x-16 gap-y-10 py-16 lg:grid-cols-2 ${reversed ? "lg:flex-row-reverse" : ""}`}
  >
    <div className="space-y-6">
      <span className="font-medium text-primary-blue">{spanText}</span>
      <h2 className="text-4xl font-bold text-custom-gray">{title}</h2>
      <ul className="space-y-4">
        {description.map((item, index) => (
          <li key={index} className="flex items-start">
            <CheckIcon className="h-6 w-6 flex-shrink-0 text-emerald-400" />
            <span className="ml-3 text-gray-600">{item}</span>
          </li>
        ))}
      </ul>
      {/* <button className="rounded-full bg-primary-blue px-4 py-2 text-white hover:bg-darker-blue">
        Get started
      </button> */}
      {quote && (
        <>
          <blockquote className="mt-8 border-l-4 border-primary-blue pl-4 italic text-custom-gray">
            "{quote}"
          </blockquote>
          {authorName && authorTitle && authorImageUrl && (
            <div className="mt-4 flex items-center">
              <img
                src={authorImageUrl}
                alt={authorName}
                className="h-12 w-12 rounded-full"
              />
              <div className="ml-4">
                <p className="font-semibold text-darker-blue">{authorName}</p>
                <p className="text-sm text-gray-600">{authorTitle}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
    <div className={reversed ? "lg:order-first" : "lg:order-last"}>
      <img
        className="w-full rounded-lg shadow-2xl"
        src={imageUrl}
        alt={title}
      />
    </div>
  </div>
);
const NewFeatureSection: React.FC = () => {
  const features: FeatureSectionProps[] = [
    {
      spanText: "Accelerate Your Workflow",
      title: "Ready-to-share LinkedIn Posts",
      description: [
        "From blank page to engaging post in minutes",
        "Industry-specific templates at your fingertips",
        "Multiple formats to suit your message",
      ],
      imageUrl: "/Screenshot 2024-07-12 at 12.49.40 PM.png",
      quote:
        "This tool has revolutionized our content strategy. We're now able to consistently produce high-quality LinkedIn posts in a fraction of the time it used to take us.",
      authorName: "Emily Chen",
      authorTitle: "Social Media Strategist",
      authorImageUrl: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      spanText: "Maximize Content Value",
      title: "Easily repurpose content",
      description: [
        "Transform existing material into new LinkedIn posts",
        "Adapt successful pieces for fresh engagement",
        "Efficiently reuse your top-performing content",
      ],
      imageUrl: "/Screenshot 2024-07-12 at 12.50.09 PM.png",
      reversed: true,
      quote:
        "The content repurposing feature has been a game-changer for our team. We're getting more mileage out of our best ideas and seeing increased engagement across the board.",
      authorName: "Alex Rodriguez",
      authorTitle: "Content Marketing Manager",
      authorImageUrl: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      spanText: "Never Run Out of Ideas",
      title: "Endless LinkedIn Post Ideas",
      description: [
        "Generate relevant topic suggestions on demand",
        "Create posts directly from ideas",
        "Save concepts for future use",
      ],
      imageUrl: "/Screenshot 2024-07-12 at 12.50.25 PM.png",
    },
    {
      spanText: "Stand Out Visually",
      title: "Eye-catching LinkedIn Carousels",
      description: [
        "Design multi-slide posts that capture attention",
        "Customizable templates for quick creation",
        "Boost engagement with visual storytelling",
      ],
      imageUrl: "/placeholder.svg",
      reversed: true,
      quote:
        "Our engagement rates have skyrocketed since we started using the carousel feature. It's an incredibly powerful way to tell our brand story and showcase our products.",
      authorName: "Sarah Johnson",
      authorTitle: "Digital Marketing Director",
      authorImageUrl: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    {
      spanText: "Optimize Your Timing",
      title: "Schedule posts in a few easy clicks",
      description: [
        "Plan your content calendar efficiently",
        "Schedule posts and comments together",
        "Visualize and optimize your posting strategy",
      ],
      imageUrl: "/Screenshot 2024-07-12 at 12.50.56 PM.png",
    },
    {
      spanText: "Stay Ahead of Trends",
      title: "Follow your favorite LinkedIn creators in real-time",
      description: [
        "Find inspiration from industry leaders",
        "Create curated lists of favorite content creators",
        "Stay updated on trends and best practices",
      ],
      imageUrl: "/placeholder.svg",
      reversed: true,
      quote:
        "The ability to follow and curate content from top LinkedIn creators has transformed how we stay on top of industry trends. It's like having a personalized think tank at your fingertips.",
      authorName: "Michael Tan",
      authorTitle: "Head of Innovation",
      authorImageUrl: "https://randomuser.me/api/portraits/men/4.jpg",
    },
  ];

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {features.map((feature, index) => (
          <React.Fragment key={index}>
            <FeatureSection {...feature} />
            {index < features.length - 1 && <FadeSeparator />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default NewFeatureSection;
