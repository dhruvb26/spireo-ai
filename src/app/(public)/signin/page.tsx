"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { FaLinkedin } from "react-icons/fa";
import AvatarCircles from "@/components/ui/avatar-circles";
import { Separator } from "@/components/ui/separator";

export default function SignIn() {
  const handleLinkedInSignIn = () => {
    signIn("linkedin", { callbackUrl: "/dashboard" });
  };

  const avatarUrls = [
    "https://avatars.githubusercontent.com/u/16860528",
    "https://avatars.githubusercontent.com/u/20110627",
    "https://avatars.githubusercontent.com/u/106103625",
    "https://avatars.githubusercontent.com/u/59228569",
  ];
  return (
    <div className="flex min-h-screen ">
      <div className="mx-auto flex w-full flex-col md:flex-row md:space-x-8">
        <div className="flex flex-1 items-center justify-center bg-darker-blue px-4 py-12 md:px-8 md:py-24">
          <div className="max-w-md space-y-8">
            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
              Boost your LinkedIn presence with AI
              {/* <SparklesText
                sparklesCount={10}
                colors={{ first: "#FFFFFF", second: "#FFFFFF" }}
                className="inline-block"
                text="AI"
              /> */}
            </h1>
            <p className="text-md font-light text-white ">
              Millions of designers and agencies around the world showcase their
              portfolio work on Flowbite - the home to the world's best design
              and creative professionals.
            </p>
            <div className="flex items-center space-x-4">
              <AvatarCircles numPeople={99} avatarUrls={avatarUrls} />
              <Separator orientation="vertical" className="h-10" />
              <span className="text-sm font-light text-white">
                Over <span className="font-semibold">2k</span> Happy Users
              </span>
              {/* <div className="mt-2 flex items-center">
                <div className="stars flex">
                  {Array.from({ length: 5 }, () => (
                    <Star fill="#f97316" strokeWidth={0} />
                  ))}
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Right side login form */}
        <div className="flex flex-1 items-center justify-center py-12 md:py-24">
          <div className="flex w-full max-w-md flex-col items-center justify-center space-y-6 rounded-lg bg-black p-6 text-white sm:space-y-8 sm:p-8">
            <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6">
              <div className="flex flex-col items-center justify-center space-x-0 space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                <Image
                  src="/inverted-logo.png"
                  width={200}
                  height={200}
                  alt="Logo"
                />
              </div>
              <p className="px-2 text-center text-sm sm:px-0">
                Connect your professional world with ours.
              </p>
            </div>
            <div className="flex flex-col space-x-0">
              <button
                onClick={handleLinkedInSignIn}
                className="mb-4 flex w-full items-center justify-center rounded-full  bg-white px-4 py-2 text-sm text-custom-gray transition duration-300 hover:bg-custom-gray hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 sm:text-base"
              >
                <FaLinkedin className="mr-2" />
                Log in with LinkedIn
              </button>
              <div className="text-center text-xs text-white">
                By connecting, you agree to our{" "}
                <Link href={"#"}>
                  <span className="text-primary-blue underline">
                    Terms of Service
                  </span>{" "}
                </Link>
                and{" "}
                <Link href={"#"}>
                  <span className="text-primary-blue underline">
                    Privacy Policy
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
