import { getServerSession } from "next-auth";
import Link from "next/link";
import Image from "next/image";
import AvatarCircles from "@/components/ui/avatar-circles";
import SparklesText from "@/components/ui/sparkles-text";
import LinkedInSignInButton from "@/components/auth/linkedin-signin-button";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default async function SignUp() {
  const session = await getServerSession();

  if (session) {
    const id = uuidv4();
    redirect(`/dashboard/draft/${id}`);
  }

  const avatarUrls = [
    "https://media.licdn.com/dms/image/D5603AQE1mcDQhAvINg/profile-displayphoto-shrink_100_100/0/1722469152073?e=2147483647&v=beta&t=DohYF7jtDgmhP-thFsuSZrnpUL7-c5s3k6pPdxPGB4s",
    "https://media.licdn.com/dms/image/D4E03AQF3n1Kczlen4g/profile-displayphoto-shrink_100_100/0/1722972052685?e=2147483647&v=beta&t=Ta55nledgAReBnb7gq2gnuJQeYuP7fkzC7-YbU0BW0o",
    "https://media.licdn.com/dms/image/D5603AQHsrYyK_hD5uQ/profile-displayphoto-shrink_100_100/0/1699974393415?e=2147483647&v=beta&t=NtL20it-fetquWmZkYZ3-Ryeljz2uLz2N4Ht05MrCuQ",
    "https://media.licdn.com/dms/image/D5603AQHYENPGn3m5DQ/profile-displayphoto-shrink_100_100/0/1682725967530?e=2147483647&v=beta&t=SnLyF1unVqzDl7LJ3oglWmDTXVba-onTkZlRRDq4O-A",
  ];

  return (
    <div className="flex min-h-screen">
      <div className="flex w-full">
        <div className="flex flex-1 flex-col justify-center bg-blue-600 px-8 py-12">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-white">
            Boost your LinkedIn presence with{" "}
            <SparklesText
              className="inline text-4xl "
              text="AI"
              colors={{ first: "#93c5fd", second: "#dbeafe" }}
            />
          </h2>
          <p className="mb-8 text-sm font-normal text-white">
            Spireo's AI-powered tools streamline your LinkedIn strategy, helping
            you create impactful posts in minutes, not hours. Boost your
            professional presence and grow your network with ease.
          </p>
          <div className="flex items-center">
            <AvatarCircles avatarUrls={avatarUrls} />
            <div className="ml-2 h-10 w-px bg-white"></div>
            <span className="ml-2 text-xs text-white">
              Trusted by founders, marketers, and other LinkedIn experts
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center bg-white px-8 py-12">
          <div className="my-8 flex items-center">
            <Image
              src="/spireo-icon.png"
              width={55}
              height={55}
              alt="Spireo Logo"
            />
            <span className="text-4xl font-black tracking-tighter text-brand-gray-900">
              Spireo
            </span>
          </div>
          <div className="space-y-4">
            <div className="flex space-x-4">
              <LinkedInSignInButton buttonText="Continue with LinkedIn" />
              {/* <Button
                onClick={handleGoogleSignIn}
                className="flex flex-1 items-center justify-center rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-2 text-sm text-brand-gray-900 shadow hover:bg-neutral-100"
              >
                <Image
                  src="/google-icon.svg"
                  width={20}
                  height={20}
                  alt="Google Logo"
                  className="mr-2"
                />
                Continue with Google
              </Button> */}
            </div>

            {/* <div className="flex w-full items-center justify-center">
              <hr className="flex-grow border-brand-gray-200" />
              <span className="px-3 text-sm text-brand-gray-500">or</span>
              <hr className="flex-grow border-brand-gray-200" />
            </div>

            <Input
              type="email"
              placeholder="Email"
              className="w-full rounded-lg  px-4 py-2 "
            /> */}

            <div className="flex items-center">
              <label htmlFor="terms" className="text-xs text-brand-gray-500">
                By signing up, you are creating a Spireo account, and you agree
                to Spireo's{" "}
                <Link
                  href="https://www.spireo.ai/terms-of-service"
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="https://www.spireo.ai/privacy-policy"
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            {/* <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
              Create an account
            </button> */}
          </div>
          {/* <p className="mt-6 text-center text-xs text-brand-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p> */}
        </div>
      </div>
    </div>
  );
}
