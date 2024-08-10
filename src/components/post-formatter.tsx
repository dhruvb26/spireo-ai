import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TipButton from "./tip-button";

interface PostFormat {
  templates: string[];
  category: string;
}

const postFormats: PostFormat[] = [
  {
    templates: [
      "Exactly {time} ago, I started {X}. So, here's my {x} wrapped:\n\n> {highlight 1}\n> {highlight 2}\n> {highlight 3}\n> {highlight 4}\n> {highlight 5}\n> {highlight 6}\n> {highlight 7}\n\nI am sure I am missing out on a few things, but these were the key highlights.\n\n{x} will always be special.\n\nCan't wait to see what {X} has in store.",
      "Looking back on my journey with {X}, here are the top 5 things I've learned:\n\n1. {lesson 1}\n2. {lesson 2}\n3. {lesson 3}\n4. {lesson 4}\n5. {lesson 5}\n\nWhat's been your experience with {X}?",
      "Reflecting on {X} years in {industry}:\n\n🌟 Biggest win: {biggest win}\n💡 Key insight: {key insight}\n🔄 Biggest pivot: {biggest pivot}\n🤝 Most valuable connection: {valuable connection}\n\nWhat's been your defining moment in your career?",
      "3 things I wish I knew when I started {X}:\n\n1️⃣ {insight 1}\n2️⃣ {insight 2}\n3️⃣ {insight 3}\n\nWhat would you add to this list?",
    ],
    category: "Reflection",
  },
  {
    templates: [
      "I've got {achievement in numbers}, but {x} was the hardest. When I started {x}...",
      "Excited to share that I've reached {milestone}! Here's how the journey looked:\n\n1. {step 1}\n2. {step 2}\n3. {step 3}\n\nBiggest challenge: {challenge}\nBiggest surprise: {surprise}\n\nNext goal: {next goal}",
      "🎉 Just hit {milestone}! Here's what it took:\n\n💪 {hours} hours of work\n📚 {books} books read\n☕ {coffee} cups of coffee\n\nBut the real MVPs were: {key supporters}\n\nWhat milestone are you working towards?",
      "From {starting point} to {current achievement} in {time period}. The secret?\n\n✅ {key habit 1}\n✅ {key habit 2}\n✅ {key habit 3}\n\nYour turn: What daily habits are propelling you forward?",
    ],
    category: "Achievement",
  },
  {
    templates: [
      "Today we're celebrating {event/milestone} at {company/team}!\n\n🥳 What it means: {significance}\n👥 Who made it possible: {key contributors}\n🚀 What's next: {future plans}\n\nJoin us in the celebration! 🎉",
      "1 year ago today: {past situation}\nToday: {current situation}\n\nCelebrating growth, resilience, and the power of {key factor}.\n\nWhat's your biggest change in the last year?",
      "Raising a virtual toast to {person/team} for {achievement}! 🥂\n\nTheir secret sauce?\n1. {quality 1}\n2. {quality 2}\n3. {quality 3}\n\nLet's show some appreciation in the comments!",
    ],
    category: "Celebrate",
  },
  {
    templates: [
      "5 game-changing tips for {topic}:\n\n1️⃣ {tip 1}\n2️⃣ {tip 2}\n3️⃣ {tip 3}\n4️⃣ {tip 4}\n5️⃣ {tip 5}\n\nWhich one resonates with you the most?",
      "Want to excel in {skill}? Here's your cheat sheet:\n\n✅ Do: {good practice 1}, {good practice 2}, {good practice 3}\n❌ Don't: {bad practice 1}, {bad practice 2}, {bad practice 3}\n\nWhat would you add to this list?",
      "The 3-step formula for {desired outcome}:\n\n1. {step 1}\n2. {step 2}\n3. {step 3}\n\nBonus tip: {bonus tip}\n\nSave this post for later! 🔖",
    ],
    category: "Tips",
  },
  {
    templates: [
      "Myth: {common misconception}\nReality: {actual truth}\n\nHere's why this matters for {industry/field}: {explanation}\n\nWhat myths have you debunked in your work?",
      "Let's bust 3 myths about {topic}:\n\n1️⃣ Myth: {myth 1}\n   Truth: {reality 1}\n\n2️⃣ Myth: {myth 2}\n   Truth: {reality 2}\n\n3️⃣ Myth: {myth 3}\n   Truth: {reality 3}\n\nWhich one surprised you the most?",
      "The biggest myth in {industry}: {major myth}\n\nWhy it persists: {reasons}\nWhy it's harmful: {consequences}\nHow to overcome it: {solutions}\n\nLet's change the narrative together. Thoughts?",
    ],
    category: "Myth",
  },
  {
    templates: [
      "3 mistakes I made in {situation} (so you don't have to):\n\n1️⃣ {mistake 1}\n   Lesson: {lesson 1}\n\n2️⃣ {mistake 2}\n   Lesson: {lesson 2}\n\n3️⃣ {mistake 3}\n   Lesson: {lesson 3}\n\nWhat's a valuable mistake you've learned from?",
      "My biggest professional blunder: {major mistake}\n\nWhat happened: {brief description}\nThe aftermath: {consequences}\nWhat I learned: {key takeaway}\nHow I bounced back: {recovery steps}\n\nRemember: Mistakes are stepping stones to success if you learn from them.",
      "Unpopular opinion: We don't talk about failures enough. So here's my recent {type of failure}:\n\nWhat went wrong: {description}\nWhy it matters: {significance}\nHow I'm moving forward: {action plan}\n\nYour turn: Share a recent setback and how you're overcoming it.",
    ],
    category: "Mistakes",
  },
  {
    templates: [
      "After {X} years in {field}, here's what I know for sure:\n\n1. {insight 1}\n2. {insight 2}\n3. {insight 3}\n4. {insight 4}\n5. {insight 5}\n\nWhat's your top insight from your field?",
      "The evolution of {industry} in 3 acts:\n\nPast: {description of past}\nPresent: {current state}\nFuture: {prediction}\n\nMy role in shaping this future: {personal mission}\n\nHow are you contributing to your industry's evolution?",
      "\"Why is {common issue} still a problem in {industry}?\"\n\nGlad you asked. Here's my take:\n\n1. {reason 1}\n2. {reason 2}\n3. {reason 3}\n\nThe solution? {proposed solution}\n\nAgree or disagree? Let's discuss!",
    ],
    category: "Expertise",
  },
  {
    templates: [
      "A tale of {theme} in 3 acts:\n\n🎬 Act 1: {beginning}\n🌪️ Act 2: {middle/conflict}\n🎊 Act 3: {resolution}\n\nThe moral of the story? {lesson learned}\n\nHave you experienced something similar?",
      'Today\'s anecdote: "The day I {unexpected event}"\n\nSetting: {place and time}\nThe twist: {what happened}\nMy reaction: {how you responded}\nThe outcome: {result}\n\nWhat I learned: {lesson}\n\nYour turn: Share an unexpected moment that taught you something!',
      "A client once asked me to {unusual request}. Here's what happened:\n\n1. Initial reaction: {your thoughts}\n2. The challenge: {what made it difficult}\n3. The approach: {how you handled it}\n4. The result: {outcome}\n\nKey takeaway: {lesson learned}\n\nWhat's the strangest request you've received in your professional life?",
    ],
    category: "Stories",
  },
  {
    templates: [
      "The {industry} landscape is changing. Here's what you need to know:\n\n🔥 Hot trend: {trend 1}\n🚀 Rising star: {trend 2}\n💤 Fading out: {outdated practice}\n🔮 My prediction: {future forecast}\n\nWhat trends are you seeing in your field?",
      "Breaking news: {recent industry event}\n\nWhy it matters: {significance}\nWho it affects: {stakeholders}\nWhat's next: {potential consequences}\n\nMy take: {personal opinion}\n\nWhat's your perspective on this development?",
    ],
    category: "Industry Insights",
  },
  {
    templates: [
      "🧠 Mindset shift alert 🧠\n\nOld belief: {limiting belief}\nNew perspective: {empowering belief}\n\nHow I made the switch:\n1. {step 1}\n2. {step 2}\n3. {step 3}\n\nResult: {positive outcome}\n\nWhat mindset shift has been game-changing for you?",
      "The power of {positive trait} in {field/situation}:\n\nHow it helps: {benefits}\nHow to cultivate it: {tips}\nReal-life example: {brief story}\n\nRemember: {motivational quote}\n\nHow do you embody {positive trait} in your work?",
    ],
    category: "Mindset",
  },
];

const categories = Array.from(
  new Set(postFormats.map((format) => format.category)),
);
export function PostFormatSelector({
  onSelectFormat,
}: {
  onSelectFormat: (format: string) => void;
}) {
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const buttonRef = React.useRef<HTMLButtonElement>(null);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className="relative flex items-center justify-start space-x-2">
        <DialogTrigger asChild>
          <Button
            ref={buttonRef}
            className="rounded-lg bg-blue-600 text-sm text-white hover:bg-blue-700 hover:text-white"
            onClick={() => setIsDialogOpen(true)}
          >
            Post Format
          </Button>
        </DialogTrigger>

        <div className="relative">
          <TipButton
            heading="Why use a post format?"
            content="Selecting a post format can help structure your content and make it more engaging. Try one out to enhance your post!"
          />
        </div>
      </div>
      <DialogContent className="min-h-[80vh] sm:max-w-[800px]">
        <DialogHeader></DialogHeader>
        <Tabs defaultValue={categories[0]} className="w-full">
          <TabsList className="grid h-fit w-full grid-cols-5">
            {categories.map((category) => (
              <TabsTrigger className="text-sm" key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((category) => (
            <TabsContent
              key={category}
              value={category}
              className="h-[500px] w-full"
            >
              <ScrollArea className="h-full">
                {postFormats
                  .find((format) => format.category === category)
                  ?.templates.map((template, index) => (
                    <div
                      key={index}
                      className={`mb-4 rounded-lg p-4 transition-all duration-200 ${
                        selectedFormat === template
                          ? "border-2 border-blue-500 bg-blue-100"
                          : "border border-gray-200 bg-gray-50 hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedFormat(template)}
                    >
                      <div className="mb-2 text-sm font-semibold text-blue-600">
                        #{index + 1}
                      </div>
                      <pre className="whitespace-pre-wrap font-sans ">
                        {template}
                      </pre>
                    </div>
                  ))}
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
        <div className="flex justify-end py-0">
          <Button
            className=" rounded-lg bg-brand-gray-800 text-sm text-white hover:bg-brand-gray-900 hover:text-white"
            onClick={() => {
              if (selectedFormat) {
                onSelectFormat(selectedFormat);
                setIsDialogOpen(false);
              }
            }}
          >
            Use Format
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
