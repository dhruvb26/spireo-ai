import Link from "next/link";
import Image from "next/image";
import SparklesText from "@/components/ui/sparkles-text";

export default function NotFound() {
  return (
    <div className="flex min-h-screen bg-black">
      <div className="m-auto flex flex-col items-center justify-center space-y-8 text-white">
        <Image
          src="/Spireo Logo Symbol Custom.png"
          width={60}
          height={60}
          alt="Logo"
        />
        <div className="text-center">
          <h1 className="mb-2 text-4xl font-bold">
            <SparklesText
              sparklesCount={10}
              colors={{ first: "#FFFFFF", second: "#FFFFFF" }}
              className="inline-block"
              text="404"
            />
          </h1>
          <h2 className="mb-4 text-2xl font-semibold">Page Not Found</h2>
          <p className="mb-6 text-lg">
            Oops! The page you're looking for doesn't exist.
          </p>
        </div>
        <div className="flex flex-col space-y-2">
          <Link
            href="https://spireo.ai"
            className="rounded bg-blue-500 px-6 py-2 text-center text-white transition duration-300 hover:bg-blue-600"
          >
            Return Home
          </Link>
          <Link
            href="/dashboard"
            className="rounded  px-6 py-2 text-center text-sm text-blue-500 hover:text-blue-700 hover:underline "
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
