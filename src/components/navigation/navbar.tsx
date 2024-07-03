"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationMenuDemo } from "./navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b-[0.1rem] bg-white px-4 py-8 md:px-4 lg:px-40">
      <div className="flex items-center">
        <Link
          href="#"
          className="flex items-center justify-center"
          prefetch={false}
        >
          <Image src="/logo.png" width={150} height={150} alt="Logo" />
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex md:flex-grow md:justify-center">
        <NavigationMenuDemo />
      </div>

      <div className="hidden md:flex md:items-center">
        <button className="rounded-full bg-gradient-to-b from-primary-blue to-darker-blue px-6 py-2 text-sm text-white transition duration-200 hover:shadow-xl focus:ring-2 focus:ring-sky-400">
          Get Started - It's Free
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col space-y-6 py-8">
              <NavigationMenuDemo />
              <button className="rounded-full bg-gradient-to-b from-primary-blue to-darker-blue px-6 py-2 text-sm text-white transition duration-200 hover:shadow-xl focus:ring-2 focus:ring-sky-400">
                Get Started - It's Free
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
