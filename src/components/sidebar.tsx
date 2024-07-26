"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { usePostStore } from "@/store/postStore";
import { signOut } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import { differenceInDays } from "date-fns";
import {
  Sparkle,
  ImagesSquare,
  Folder,
  Calendar,
  LightbulbFilament,
  SignOut,
  GearSix,
  List,
  Timer,
  Bookmarks,
  Note,
  MagicWand,
  Flag,
} from "@phosphor-icons/react";
import { CaretDown } from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import WordsCard from "./words-card";
import { Avatar, AvatarFallback } from "./ui/avatar";

const Sidebar = ({ children, session, user }: any) => {
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { addPost } = usePostStore();
  const userImage = session.user.image;
  const endsAt = user.trialEndsAt as Date;
  const generatedWords = user.generatedWords as number;
  const today = new Date();

  const difference = differenceInDays(endsAt, today);

  const isLinkActive = (href: string, exact: boolean = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(href);
  };

  const handleCreateDraft = async () => {
    const id = uuidv4();
    addPost("", id);
    router.push(`/dashboard/draft/${id}`);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-brand-gray-200 bg-brand-gray-25 md:flex">
        <div className="flex h-full flex-col">
          {/* Logo section */}
          <div className="flex h-14 items-center justify-center border-b px-4 lg:px-6">
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 font-semibold"
            >
              <Image
                src="/Spireo Logo Symbol Custom.png"
                width={35}
                height={35}
                alt=""
              />
              <span className="text-3xl font-bold tracking-tighter">
                Spireo
              </span>
            </Link>
          </div>
          {/* Navigation links */}
          <nav className="flex-grow overflow-y-auto py-4">
            <div className="px-4">
              <button
                onClick={handleCreateDraft}
                className={`bg-gradient-animation mb-4 flex w-full animate-gradient items-center justify-center gap-3 rounded-lg  bg-gradient-to-r from-brand-purple-700 via-brand-purple-500 to-brand-purple-400 px-6 py-2 text-center text-sm  transition-all hover:scale-105 ${
                  isLinkActive("/dashboard/draft")
                    ? "bg-muted text-white"
                    : "text-white"
                }`}
              >
                Create Post
                <MagicWand size={24} />
              </button>
            </div>
            <Link
              href="/dashboard"
              className={`relative flex items-center gap-3  px-6 py-2 text-sm transition-all hover:text-brand-purple-600 ${
                isLinkActive("/dashboard", true)
                  ? "bg-brand-gray-100 text-brand-purple-600"
                  : "text-brand-gray-500"
              }`}
            >
              <Flag size={20} />
              Get Started
              {isLinkActive("/dashboard", true) && (
                <div className="absolute bottom-0 right-0 top-0 w-1 bg-brand-purple-600"></div>
              )}
            </Link>
            <Link
              href="/dashboard/post"
              className={`relative flex items-center gap-3  px-6 py-2 text-sm transition-all hover:text-brand-purple-600 ${
                isLinkActive("/dashboard/post")
                  ? "bg-brand-gray-100 text-brand-purple-600"
                  : "text-brand-gray-500"
              }`}
            >
              <Sparkle size={20} />
              Post Generation
              {isLinkActive("/dashboard/post") && (
                <div className="absolute bottom-0 right-0 top-0 w-1 bg-brand-purple-600"></div>
              )}
            </Link>
            <Link
              href="/dashboard/ideas"
              className={`relative flex items-center gap-3  px-6 py-2 text-sm transition-all hover:text-brand-purple-600 ${
                isLinkActive("/dashboard/ideas")
                  ? "bg-brand-gray-100 text-brand-purple-600"
                  : "text-brand-gray-500"
              }`}
            >
              <LightbulbFilament size={20} />
              Get Ideas
              {isLinkActive("/dashboard/ideas") && (
                <div className="absolute bottom-0 right-0 top-0 w-1 bg-brand-purple-600"></div>
              )}
            </Link>
            <Link
              href="/dashboard/carousel"
              className={`relative flex items-center gap-3  px-6 py-2 text-sm transition-all hover:text-brand-purple-600 ${
                isLinkActive("/dashboard/carousel")
                  ? "bg-brand-gray-100 text-brand-purple-600"
                  : "text-brand-gray-500"
              }`}
            >
              <ImagesSquare size={20} />
              Carousels
              {isLinkActive("/dashboard/carousel") && (
                <div className="absolute bottom-0 right-0 top-0 w-1 bg-brand-purple-600"></div>
              )}
            </Link>
            <div className="mx-auto my-4 h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-brand-purple-100 to-transparent" />
            <Link
              href="/dashboard/scheduler"
              className={`relative flex items-center gap-3  px-6 py-2 text-sm transition-all hover:text-brand-purple-600 ${
                isLinkActive("/dashboard/scheduler")
                  ? "bg-brand-gray-100 text-brand-purple-600"
                  : "text-brand-gray-500"
              }`}
            >
              <Calendar size={20} />
              Scheduler
              {isLinkActive("/dashboard/scheduler") && (
                <div className="absolute bottom-0 right-0 top-0 w-1 bg-brand-purple-600"></div>
              )}
            </Link>
            <div className="relative">
              <button
                onClick={() => setIsSavedOpen(!isSavedOpen)}
                className={`flex w-full items-center justify-between  px-6 py-2 text-sm transition-all hover:text-brand-purple-600 ${
                  isLinkActive("/dashboard/saved")
                    ? "bg-brand-gray-100 text-brand-purple-600"
                    : "text-brand-gray-500"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Folder size={20} />
                  Saved
                </div>
                <CaretDown
                  className={`h-4 w-4 transition-transform ${
                    isSavedOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isSavedOpen && (
                <div className="mt-1 space-y-1">
                  <Link
                    href="/dashboard/saved/ideas"
                    className={`relative flex items-center gap-3  px-6 py-2 text-sm transition-all hover:text-brand-purple-600 ${
                      isLinkActive("/dashboard/saved/ideas")
                        ? "bg-brand-gray-100 text-brand-purple-600"
                        : "text-brand-gray-500"
                    }`}
                  >
                    <Bookmarks size={20} className="ml-4" />
                    Ideas
                    {isLinkActive("/dashboard/saved/ideas") && (
                      <div className="absolute bottom-0 right-0 top-0 w-1 bg-brand-purple-600"></div>
                    )}
                  </Link>
                  <Link
                    href="/dashboard/saved/posts"
                    className={`relative flex items-center gap-3  px-6 py-2 text-sm transition-all hover:text-brand-purple-600 ${
                      isLinkActive("/dashboard/saved/posts")
                        ? "bg-brand-gray-100 text-brand-purple-600"
                        : "text-brand-gray-500"
                    }`}
                  >
                    <Note size={20} className="ml-4" />
                    Posts
                    {isLinkActive("/dashboard/saved/posts") && (
                      <div className="absolute bottom-0 right-0 top-0 w-1 bg-brand-purple-600"></div>
                    )}
                  </Link>
                </div>
              )}
            </div>
            <div className="mx-auto my-4 h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-brand-purple-100 to-transparent" />
            <Link
              href="/dashboard/settings"
              className={`relative flex items-center gap-3  px-6 py-2 text-sm transition-all hover:text-brand-purple-600 ${
                isLinkActive("/dashboard/settings")
                  ? "bg-brand-gray-100 text-brand-purple-600"
                  : "text-brand-gray-500"
              }`}
            >
              <GearSix size={20} />
              Settings
              {isLinkActive("/dashboard/settings") && (
                <div className="absolute bottom-0 right-0 top-0 w-1 bg-brand-purple-600"></div>
              )}
            </Link>
          </nav>

          {/* Upgrade card */}
          <div className="p-4">
            <button
              onClick={handleSignOut}
              className="mb-2 flex w-full items-center justify-center  py-2 text-sm text-brand-gray-500 hover:text-brand-purple-600 "
            >
              Logout <SignOut className="ml-2 inline" size={12} />
            </button>
            <WordsCard words={generatedWords} />
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex flex-grow flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex min-h-14 items-center justify-between border-b border-brand-gray-200 bg-brand-gray-25 px-4">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0   bg-brand-purple-700 hover:bg-brand-purple-800 md:hidden"
                >
                  <List className="h-5 w-5 text-white" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex w-fit flex-col">
                {/* Mobile navigation */}
                <nav className="flex-grow overflow-y-auto px-2 py-4">
                  <button
                    onClick={handleCreateDraft}
                    className={`mb-2 flex w-full items-center gap-3 rounded-lg  bg-gradient-to-r from-brand-purple-700 via-brand-purple-500 to-brand-purple-400 px-6 py-2 text-left text-sm transition-all  ${
                      isLinkActive("/dashboard/draft")
                        ? "bg-muted text-white"
                        : "text-white"
                    }`}
                  >
                    <MagicWand size={20} />
                    Create Post
                  </button>
                  <Link
                    href="/dashboard"
                    className={`flex items-center gap-3  px-6 py-2 text-sm transition-all hover:text-brand-purple-600 ${
                      isLinkActive("/dashboard", true)
                        ? "rounded-lg bg-muted text-brand-purple-600"
                        : "text-brand-gray-500"
                    }`}
                  >
                    <Flag size={20} />
                    Get Started
                  </Link>
                  <Link
                    href="/dashboard/post"
                    className={`flex items-center gap-3  px-6 py-2 text-sm transition-all hover:text-brand-purple-600 ${
                      isLinkActive("/dashboard/post")
                        ? "rounded-lg bg-muted text-brand-purple-600"
                        : "text-brand-gray-500"
                    }`}
                  >
                    <Sparkle size={20} />
                    Post Generation
                  </Link>
                  <Link
                    href="/dashboard/ideas"
                    className={`flex items-center gap-3  px-6 py-2 text-sm transition-all hover:text-brand-purple-600 ${
                      isLinkActive("/dashboard/ideas")
                        ? "rounded-lg bg-muted text-brand-purple-600"
                        : "text-brand-gray-500"
                    }`}
                  >
                    <LightbulbFilament size={20} />
                    Get Ideas
                  </Link>
                  <Link
                    href="/dashboard/carousel"
                    className={`flex items-center gap-3  px-6 py-2 text-sm transition-all hover:text-brand-purple-600 ${
                      isLinkActive("/dashboard/carousel")
                        ? "rounded-lg bg-muted text-brand-purple-600"
                        : "text-brand-gray-500"
                    }`}
                  >
                    <ImagesSquare size={20} />
                    Carousels
                  </Link>
                  <div className="mx-auto my-4 h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-brand-purple-100 to-transparent" />
                  <Link
                    href="/dashboard/scheduler"
                    className={`flex items-center gap-3  px-6 py-2 text-sm transition-all hover:text-brand-purple-600 ${
                      isLinkActive("/dashboard/scheduler")
                        ? "rounded-lg bg-muted text-brand-purple-600"
                        : "text-brand-gray-500"
                    }`}
                  >
                    <Calendar size={20} />
                    Scheduler
                  </Link>

                  {/* Updated Saved section */}
                  <div className="relative">
                    <button
                      onClick={() => setIsSavedOpen(!isSavedOpen)}
                      className={`flex w-full items-center justify-between px-6 py-2 text-sm transition-all hover:text-brand-purple-600 ${
                        isLinkActive("/dashboard/saved")
                          ? "rounded-lg bg-muted text-brand-purple-600"
                          : "text-brand-gray-500"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Folder size={20} />
                        Saved
                      </div>
                      <CaretDown
                        className={`h-4 w-4 transition-transform ${
                          isSavedOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isSavedOpen && (
                      <div className="mt-1 space-y-1">
                        <Link
                          href="/dashboard/saved/ideas"
                          className={`flex items-center gap-3 px-6 py-2 text-sm transition-all hover:text-brand-purple-600 ${
                            isLinkActive("/dashboard/saved/ideas")
                              ? "rounded-lg bg-muted text-brand-purple-600"
                              : "text-brand-gray-500"
                          }`}
                        >
                          <Bookmarks size={20} className="ml-4" />
                          Ideas
                        </Link>
                        <Link
                          href="/dashboard/saved/posts"
                          className={`flex items-center gap-3 px-6 py-2 text-sm transition-all hover:text-brand-purple-600 ${
                            isLinkActive("/dashboard/saved/posts")
                              ? "rounded-lg bg-muted text-brand-purple-600"
                              : "text-brand-gray-500"
                          }`}
                        >
                          <Note size={20} className="ml-4" />
                          Posts
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="mx-auto my-4 h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-brand-purple-100 to-transparent" />
                  <Link
                    href="/dashboard/settings"
                    className={`flex items-center gap-3  px-6 py-2 text-sm transition-all hover:text-brand-purple-600 ${
                      isLinkActive("/dashboard/settings")
                        ? "rounded-lg bg-muted text-brand-purple-600"
                        : "text-brand-gray-500"
                    }`}
                  >
                    <GearSix size={20} />
                    Settings
                  </Link>
                </nav>
                {/* Upgrade card */}
                <div className="p-4">
                  <button
                    onClick={handleSignOut}
                    className="mb-2 flex w-full items-center justify-center  py-2 text-sm text-brand-gray-500 hover:text-brand-purple-600 "
                  >
                    Logout <SignOut className="ml-2 inline" size={12} />
                  </button>
                  <WordsCard words={generatedWords} />
                </div>
              </SheetContent>
            </Sheet>
            <span className="flex w-full items-center justify-center text-sm text-brand-purple-600">
              <Timer weight="fill" size={24} className="mr-2 inline" />{" "}
              {difference} day(s) left before your free trial runs out!
            </span>
          </div>
          <div className="flex flex-row items-center justify-center space-x-4">
            {/* <Button className=" rounded-lg hover:bg-blue-700">
              <Link
                className=" text-sm  font-light text-white  hover:text-white"
                data-canny-link
                target="_blank"
                href="https://spireo.canny.io/feature-requests"
              >
                Give Feedback
              </Link>
            </Button> */}
            <img
              src={userImage}
              alt="User profile"
              className="h-8 w-8 rounded-full"
            />
            {/* <Avatar>
              <AvatarFallback>S</AvatarFallback>
            </Avatar> */}
          </div>
        </header>

        <div className="w-screen flex-grow overflow-y-auto overflow-x-hidden  p-0">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Sidebar;
