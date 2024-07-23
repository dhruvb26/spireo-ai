"use client";
import React from "react";
import Image from "next/image";
import { Home } from "lucide-react";
import Link from "next/link";
import PrimaryButton from "./ui/primary-button";
import { signOut } from "next-auth/react";

const SecondaryNavbar = () => {
  return (
    <nav className="bg-muted">
      <div className="flex flex-row items-center justify-between px-4">
        <div className="flex h-16 items-center">
          <Link href={"/dashboard/setup"}>
            <Image src="/logo.png" alt="Company Logo" width={120} height={40} />
          </Link>
        </div>
        <div className="flex items-center space-x-4"></div>
      </div>
    </nav>
  );
};

export default SecondaryNavbar;
