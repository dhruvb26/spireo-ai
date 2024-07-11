"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { SparkleIcon } from "lucide-react";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Post Generator",
    href: "/docs/primitives/alert-dialog",
    description:
      "AI powered post generator that generates posts that sound just like you.",
  },
  {
    title: "Idea Generator",
    href: "/docs/primitives/hover-card",
    description:
      "Out of ideas? Our AI powered idea generator will help you come up with new ideas.",
  },
  {
    title: "Carousel Generator",
    href: "/docs/primitives/progress",
    description:
      "Generate carousels for your posts with our AI powered carousel generator.",
  },
  {
    title: "Post Scheduler",
    href: "/docs/primitives/scroll-area",
    description: "Plan your posts and schedule them for the best times.",
  },
];

export function NavigationMenuDemo() {
  return (
    <NavigationMenu className="z-50  ">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-md ">
            Features
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/pricing" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Pricing
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-md">
            Resources
          </NavigationMenuTrigger>
          <div className="z-50">
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className=" flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary-blue to-blue-200 p-6 text-white no-underline outline-none focus:shadow-md"
                      href="/"
                    >
                      <div className="mb-2 mt-4  text-lg font-medium  ">
                        Spireo AI
                      </div>
                      <p className="text-sm leading-tight ">
                        Supercharge your LinkedIn presence with AI-powered
                        content creation, engagement strategies, and analytics.
                        Grow your network effortlessly.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/docs" title="Content Creator">
                  Generate tailored posts, artices, and carousels for your
                  LinkedIn profile.
                </ListItem>
                <ListItem href="/docs/installation" title="Smart Scheduler">
                  Optimize your posting times for maximum engagement and reach.
                </ListItem>
                <ListItem href="/docs/primitives/typography" title="Latest AI">
                  Powered by the new Claude 3.5 Sonnet.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </div>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
