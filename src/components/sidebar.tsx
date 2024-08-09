"use client";
import React, { useState, useCallback, useEffect } from "react";
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
  List,
  Timer,
  Bookmarks,
  Note,
  MagicWand,
  CaretDown,
  MapPinSimple,
  Wrench,
  PencilSimpleLine,
  ArrowCircleUpRight,
  GearSix,
  ExclamationMark,
} from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import WordsCard from "./words-card";
import FadeSeparator from "./ui/fade-separator";
import { Badge } from "./ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Sidebar = ({ children, user }: any) => {
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { addPost } = usePostStore();
  const { image: userImage, trialEndsAt, specialAccess, generatedWords } = user;

  const difference = differenceInDays(trialEndsAt, new Date());

  const isLinkActive = useCallback(
    (href: string, exact: boolean = false) => {
      return exact
        ? pathname === href
        : pathname === href || pathname.startsWith(href);
    },
    [pathname],
  );

  const handleCreateDraft = useCallback(async () => {
    const id = uuidv4();
    addPost("", id);
    router.push(`/dashboard/draft/${id}`);
  }, [addPost, router]);

  const handleSignOut = useCallback(async () => {
    await signOut({ callbackUrl: "https://spireo.ai" });
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.metaKey && event.key === "s") {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  const renderNavLink = useCallback(
    (
      href: string,
      icon: React.ReactNode,
      filledIcon: React.ReactNode,
      text: string,
      exact: boolean = false,
      badge?: { text: string; color: string; icon?: React.ReactNode },
    ) => {
      const linkContent = (
        <Link
          href={href}
          className={`relative flex items-center gap-3 px-6 py-2 text-sm transition-all hover:text-blue-700 ${
            isLinkActive(href, exact) ? "text-blue-700" : "text-brand-gray-500"
          } ${isSidebarCollapsed ? "justify-center" : ""}`}
        >
          <div className={isSidebarCollapsed ? "w-5 text-center" : ""}>
            {isLinkActive(href, exact) ? filledIcon : icon}
          </div>
          {!isSidebarCollapsed && <span>{text}</span>}
          {!isSidebarCollapsed && badge && (
            <Badge
              className={`ml-auto space-x-1 bg-${badge.color}-50 font-normal text-${badge.color}-600 hover:bg-${badge.color}-100`}
            >
              <span>{badge.text}</span>
              {badge.icon}
            </Badge>
          )}
        </Link>
      );

      if (isSidebarCollapsed) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
              <TooltipContent side="right">
                <p>{text}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }

      return linkContent;
    },
    [isLinkActive, isSidebarCollapsed],
  );

  const renderNavigation = () => (
    <nav className="flex-grow overflow-y-auto px-2 py-4">
      {renderNavLink(
        "/dashboard/getting-started",
        <MapPinSimple size={20} />,
        <MapPinSimple weight="duotone" size={20} />,
        "Get Started",
        true,
      )}
      <FadeSeparator />

      <h3
        className={`my-2 px-6 text-xs font-semibold uppercase text-brand-gray-400 ${isSidebarCollapsed ? "hidden" : ""}`}
      >
        Creation
      </h3>
      {isSidebarCollapsed ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleCreateDraft}
                className="relative flex w-full items-center justify-center gap-3 px-6 py-2 text-sm font-normal text-brand-gray-500 transition-all hover:text-blue-700"
              >
                <div className="w-5 text-center">
                  <PencilSimpleLine weight="duotone" size={20} />
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>New Post</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <button
          onClick={handleCreateDraft}
          className="relative flex w-full items-center gap-3 px-6 py-2 text-sm font-normal text-brand-gray-500 transition-all hover:text-blue-700"
        >
          <PencilSimpleLine weight="duotone" size={20} />
          <span>New Post</span>
        </button>
      )}
      {renderNavLink(
        "/dashboard/post",
        <Sparkle size={20} />,
        <Sparkle size={20} weight="duotone" />,
        "Post Generator",
      )}
      {renderNavLink(
        "/dashboard/ideas",
        <LightbulbFilament size={20} />,
        <LightbulbFilament weight="duotone" size={20} />,
        "Idea Generator",
      )}
      {renderNavLink(
        "/dashboard/carousel",
        <ImagesSquare size={20} />,
        <ImagesSquare weight="duotone" size={20} />,
        "Carousels",
      )}
      {renderNavLink(
        "",
        <MagicWand size={20} />,
        <MagicWand weight="duotone" size={20} />,
        "Inspiration",
        true,
        {
          text: "Soon",
          color: "blue",
          icon: <Timer weight="duotone" size={16} />,
        },
      )}

      <FadeSeparator />
      <h3
        className={`my-2 px-6 text-xs font-semibold uppercase text-brand-gray-400 ${isSidebarCollapsed ? "hidden" : ""}`}
      >
        Management
      </h3>
      {renderNavLink(
        "/dashboard/scheduler",
        <Calendar size={20} />,
        <Calendar weight="duotone" size={20} />,
        "Scheduler",
      )}
      <div className="relative">
        {isSidebarCollapsed ? (
          <>
            {renderNavLink(
              "/dashboard/saved/ideas",
              <Bookmarks size={20} />,
              <Bookmarks weight="duotone" size={20} />,
              "Saved Ideas",
            )}
            {renderNavLink(
              "/dashboard/saved/posts",
              <Note size={20} />,
              <Note weight="duotone" size={20} />,
              "Saved Posts",
            )}
          </>
        ) : (
          <>
            <button
              onClick={() => setIsSavedOpen(!isSavedOpen)}
              className={`flex w-full items-center justify-between px-6 py-2 text-sm transition-all hover:text-blue-700 ${
                isLinkActive("/dashboard/saved")
                  ? "bg-brand-gray-100 text-blue-700"
                  : "text-brand-gray-500"
              }`}
            >
              <div className="flex items-center gap-3">
                {isLinkActive("/dashboard/saved") ? (
                  <Folder weight="duotone" size={20} />
                ) : (
                  <Folder size={20} />
                )}
                <span>Saved</span>
              </div>
              <CaretDown
                className={`h-4 w-4 transition-transform ${
                  isSavedOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isSavedOpen && (
              <div className="mt-1 space-y-1">
                {renderNavLink(
                  "/dashboard/saved/ideas",
                  <Bookmarks size={20} className="ml-4" />,
                  <Bookmarks weight="duotone" size={20} className="ml-4" />,
                  "Ideas",
                )}
                {renderNavLink(
                  "/dashboard/saved/posts",
                  <Note size={20} className="ml-4" />,
                  <Note weight="duotone" size={20} className="ml-4" />,
                  "Posts",
                )}
              </div>
            )}
          </>
        )}
      </div>

      <FadeSeparator />
      <h3
        className={`my-2 px-6 text-xs font-semibold uppercase text-brand-gray-400 ${isSidebarCollapsed ? "hidden" : ""}`}
      >
        Account
      </h3>
      {renderNavLink(
        "/dashboard/preferences",
        <Wrench size={20} />,
        <Wrench weight="duotone" size={20} />,
        "Preferences",
      )}

      {renderNavLink(
        "/dashboard/settings",
        <GearSix size={20} />,
        <GearSix weight="duotone" size={20} />,
        "Settings",
      )}
      {isSidebarCollapsed ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleSignOut}
                className="relative flex w-full items-center justify-center gap-3 px-6 py-2 text-sm text-brand-gray-500 transition-all hover:text-blue-700"
              >
                <div className="w-5 text-center">
                  <SignOut size={20} />
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Log out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <button
          onClick={handleSignOut}
          className="relative flex w-full items-center gap-3 px-6 py-2 text-sm text-brand-gray-500 transition-all hover:text-blue-700"
        >
          <SignOut size={20} />
          <span>Log out</span>
        </button>
      )}
    </nav>
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="flex min-h-14 w-screen items-center justify-between border-b border-brand-gray-200 px-4 md:px-8">
        <div className="flex w-full items-center justify-between md:w-auto">
          <Link
            href="/dashboard"
            className="flex items-center justify-center font-semibold md:ml-0"
          >
            <Image
              src="/Spireo Logo Symbol Custom.png"
              width={30}
              height={30}
              alt=""
            />
            <span className="text-2xl font-black tracking-tighter">Spireo</span>
          </Link>
        </div>
        <div className="flex flex-row items-center justify-center space-x-4">
          {userImage && (
            <div className="hidden md:block">
              <Image
                src={userImage}
                width={32}
                height={32}
                alt="User profile"
                className="rounded-full"
              />
            </div>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 border-brand-gray-200 md:hidden"
              >
                <List className="h-5 w-5 text-brand-gray-500 hover:text-blue-700" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-fit flex-col">
              {renderNavigation()}
              <div className="p-4">
                <WordsCard words={generatedWords} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden">
        <aside
          className={`hidden transition-all duration-300 ${
            isSidebarCollapsed ? "w-16" : "w-64"
          } flex-shrink-0 flex-col border-r border-brand-gray-200 md:flex`}
        >
          <div className="flex h-full flex-col">
            {renderNavigation()}
            <div className={`p-4 ${isSidebarCollapsed ? "hidden" : ""}`}>
              <WordsCard words={generatedWords} />
            </div>
          </div>
        </aside>

        <main className="flex-grow overflow-x-auto overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Sidebar;
