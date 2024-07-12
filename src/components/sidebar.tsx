"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { usePostStore } from "@/store/postStore";
import {
  WandSparklesIcon,
  Lightbulb,
  GalleryHorizontalIcon,
  Calendar,
  WalletCardsIcon,
  PenIcon,
  Folder,
  Menu,
  X,
  Pin,
} from "lucide-react";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import GradientButton from "./ui/rounded-border-button";
import { cn } from "@/lib/utils";
import { GearIcon } from "@radix-ui/react-icons";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const toggleSidebar = () => setIsOpen(!isOpen);
  const { addPost } = usePostStore();

  const handleCreateDraft = async () => {
    const id = uuidv4();
    addPost("", id);
    router.push(`/dashboard/draft/${id}`);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <button
        className="fixed left-4 top-4 z-20 rounded-full bg-gray-800 p-2 text-white transition-all duration-300 hover:bg-gray-700 md:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 backdrop-blur-sm md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-fit transform bg-muted transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:relative md:translate-x-0",
          " bg-muted",
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          <div className="mt-6 flex flex-1 flex-col">
            <div className="space-y-4">
              <nav className="flex-1 space-y-2">
                <div className="mb-2 px-4">
                  <GradientButton
                    onClick={handleCreateDraft}
                    gradientColors={[
                      "from-primary-blue",
                      "via-darker-blue",
                      "to-darker-blue",
                    ]}
                    className="w-full transition-all duration-300 hover:shadow-lg "
                  >
                    <span className="text-md">Write Post</span>
                    <span className="ml-4 flex-shrink-0 rounded-full bg-white p-[0.5rem]">
                      <PenIcon className="h-4 w-4 text-blue-900" />
                    </span>
                  </GradientButton>
                </div>

                <div className="flex-grow overflow-y-auto overflow-x-hidden">
                  <ul className="flex flex-col space-y-1 py-4">
                    <li className="px-5">
                      <div className="flex h-8 flex-row items-center">
                        <div className="text-sm font-light tracking-wide text-gray-500">
                          AI Tools
                        </div>
                      </div>
                    </li>
                    <li>
                      <Link
                        href="/dashboard/post"
                        className="relative flex h-11 flex-row items-center border-l-4 border-transparent pr-6 text-gray-600 hover:border-primary-blue hover:bg-gray-50 hover:text-gray-800 focus:outline-none"
                      >
                        <span className="ml-4 inline-flex items-center justify-center">
                          <WandSparklesIcon className="h-5 w-5" />
                        </span>
                        <span className="ml-2 truncate text-sm tracking-wide">
                          Posts
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/dashboard/ideas"
                        className="relative flex h-11 flex-row items-center border-l-4 border-transparent pr-6 text-gray-600 hover:border-primary-blue hover:bg-gray-50 hover:text-gray-800 focus:outline-none"
                      >
                        <span className="ml-4 inline-flex items-center justify-center">
                          <Lightbulb className="h-5 w-5" />
                        </span>
                        <span className="ml-2 truncate text-sm tracking-wide">
                          Ideas
                        </span>
                        <span className="ml-auto rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium tracking-wide text-indigo-500">
                          New
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="relative flex h-11 flex-row items-center border-l-4 border-transparent pr-6 text-gray-600 hover:border-primary-blue hover:bg-gray-50 hover:text-gray-800 focus:outline-none"
                      >
                        <span className="ml-4 inline-flex items-center justify-center">
                          <GalleryHorizontalIcon className="h-5 w-5" />
                        </span>
                        <span className="ml-2 truncate text-sm tracking-wide">
                          Carousels
                        </span>
                      </Link>
                    </li>

                    <li className="px-5">
                      <div className="flex h-8 flex-row items-center">
                        <div className="text-sm font-light tracking-wide text-gray-500">
                          Content
                        </div>
                      </div>
                    </li>
                    <li>
                      <Link
                        href="/dashboard/saved"
                        className="relative flex h-11 flex-row items-center border-l-4 border-transparent pr-6 text-gray-600 hover:border-primary-blue hover:bg-gray-50 hover:text-gray-800 focus:outline-none"
                      >
                        <span className="ml-4 inline-flex items-center justify-center">
                          <WalletCardsIcon className="h-5 w-5" />
                        </span>
                        <span className="ml-2 truncate text-sm tracking-wide">
                          Saved
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/dashboard/scheduler"
                        className="relative flex h-11 flex-row items-center border-l-4 border-transparent pr-6 text-gray-600 hover:border-primary-blue hover:bg-gray-50 hover:text-gray-800 focus:outline-none"
                      >
                        <span className="ml-4 inline-flex items-center justify-center">
                          <Calendar className="h-5 w-5" />
                        </span>
                        <span className="ml-2 truncate text-sm tracking-wide">
                          Scheduler
                        </span>
                        <span className="ml-auto rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium tracking-wide text-green-500">
                          15
                        </span>
                      </Link>
                    </li>
                    <li className="px-5">
                      <div className="flex h-8 flex-row items-center">
                        <div className="text-sm font-light tracking-wide text-gray-500">
                          Settings
                        </div>
                      </div>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="relative flex h-11 flex-row items-center border-l-4 border-transparent pr-6 text-gray-600 hover:border-primary-blue hover:bg-gray-50 hover:text-gray-800 focus:outline-none"
                      >
                        <span className="ml-4 inline-flex items-center justify-center">
                          <Pin className="h-5 w-5" />
                        </span>
                        <span className="ml-2 truncate text-sm tracking-wide">
                          Get Started
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/dashboard/setup"
                        className="relative flex h-11 flex-row items-center border-l-4 border-transparent pr-6 text-gray-600 hover:border-primary-blue hover:bg-gray-50 hover:text-gray-800 focus:outline-none"
                      >
                        <span className="ml-4 inline-flex items-center justify-center">
                          <GearIcon className="h-5 w-5" />
                        </span>
                        <span className="ml-2 truncate text-sm tracking-wide">
                          Setup
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="mt-auto p-4">
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center justify-start rounded-md bg-red-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-red-600"
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
