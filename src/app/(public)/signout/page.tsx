"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import { FaSignOutAlt } from "react-icons/fa";

export default function SignOutPage() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "https://spireo.ai" });
  };

  return (
    <div className="flex min-h-screen bg-darker-blue">
      <div className="m-auto flex w-full max-w-md flex-col items-center justify-center space-y-8 rounded-lg bg-black p-8 text-white">
        <Image
          src="/inverted-logo.png"
          width={150}
          height={150}
          alt="Logo"
          className="mb-4"
        />
        <h2 className="text-2xl font-bold">Sign Out Confirmation</h2>
        <p className="text-center text-sm">
          Are you sure you want to sign out of Spireo?
        </p>
        <div className="flex w-full flex-col space-y-4">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center justify-center rounded-full bg-white px-4 py-2 text-sm text-custom-gray transition duration-300 hover:bg-custom-gray hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
          >
            <FaSignOutAlt className="mr-2" />
            Sign Out
          </button>
          <button
            onClick={() => window.history.back()}
            className="rounded-full border border-white px-4 py-2 text-sm text-white transition duration-300 hover:bg-white hover:text-custom-gray focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
        <p className="text-center text-xs text-gray-400">
          You can always log back in to access your Spireo account.
        </p>
      </div>
    </div>
  );
}
