"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationMenuDemo } from "./navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signIn } from "next-auth/react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex justify-center px-4 py-4 md:px-8 lg:px-8">
      <header className="flex h-14 w-full max-w-7xl items-center justify-between rounded-full bg-white px-6 py-2 shadow-lg">
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center justify-center"
            prefetch={false}
          >
            <Image src="/logo.png" width={125} height={125} alt="Logo" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="mx-4 hidden flex-grow justify-center md:flex">
          <NavigationMenuDemo />
        </div>

        <div className="hidden md:block">
          <button
            className="whitespace-nowrap rounded-full bg-gradient-to-b from-primary-blue to-darker-blue px-6 py-2 text-sm text-white transition duration-200 hover:shadow-xl focus:ring-2 focus:ring-sky-400"
            onClick={() => signIn()}
          >
            Get Started for Free
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="ml-4 md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-6 py-8">
                <NavigationMenuDemo />
                <button
                  className="whitespace-nowrap rounded-full bg-gradient-to-b from-primary-blue to-darker-blue px-6 py-2 text-sm text-white transition duration-200 hover:shadow-xl focus:ring-2 focus:ring-sky-400"
                  onClick={() => signIn()}
                >
                  Get Started for Free
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
