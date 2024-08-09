import Link from "next/link";
import { getServerAuthSession } from "@/server/auth";
import Image from "next/image";
import AvatarCircles from "@/components/ui/avatar-circles";
import SparklesText from "@/components/ui/sparkles-text";
import { redirect } from "next/navigation";
import LinkedInSignInButton from "@/components/auth/linkedin-signin-button";
export default async function SignIn() {
  const session = await getServerAuthSession();

  if (session) {
    redirect("/dashboard/post");
  }

  const avatarUrls = [
    "https://avatars.githubusercontent.com/u/16860528",
    "https://avatars.githubusercontent.com/u/20110627",
    "https://avatars.githubusercontent.com/u/106103625",
    "https://avatars.githubusercontent.com/u/59228569",
  ];

  return (
    <div className="flex min-h-screen ">
      <div className="mx-auto flex w-full flex-col md:flex-row md:space-x-8">
        <div className="flex flex-1 items-center justify-center bg-blue-600 px-4 py-12 md:px-8 md:py-24">
          <div className="max-w-md space-y-8">
            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
              Boost your LinkedIn presence with{" "}
              <SparklesText
                sparklesCount={10}
                colors={{ first: "#FFFFFF", second: "#FFFFFF" }}
                className="inline-block text-5xl"
                text="AI"
              />
            </h1>
            <p className="text-md font-light text-white ">
              Spireo's AI-powered tools streamline your LinkedIn strategy,
              helping you create impactful posts in minutes, not hours. Boost
              your professional presence and grow your network with ease.
            </p>
            <div className="flex items-center space-x-10">
              <AvatarCircles avatarUrls={avatarUrls} />
              <span className="text-sm font-light text-white">
                Trusted by founders, marketers, and other LinkedIn experts
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center py-12 md:py-24">
          <div className="flex w-full max-w-md flex-col items-center justify-center space-y-6 rounded-lg bg-black p-6 text-white sm:space-y-8 sm:p-8">
            <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6">
              <div className="flex flex-col items-center justify-center space-x-0 space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                <Image
                  src="/Spireo Logo Symbol Custom.png"
                  width={40}
                  height={40}
                  alt="Logo"
                />
                <span className="text-3xl font-bold tracking-tighter">
                  Spireo
                </span>
              </div>
              <p className="px-2 text-center text-sm sm:px-0">
                Connect your professional world with ours.
              </p>
            </div>
            <div className="flex flex-col space-x-0">
              <LinkedInSignInButton />
              <div className="text-center text-xs text-white">
                By connecting, you agree to our{" "}
                <Link href={"#"}>
                  <span className="text-blue-600 underline hover:text-blue-700">
                    Terms of Service
                  </span>{" "}
                </Link>
                and{" "}
                <Link href={"#"}>
                  <span className="text-blue-600 underline hover:text-blue-700">
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
