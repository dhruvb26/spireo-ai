import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="m-auto flex flex-col items-center justify-center space-y-8 text-black">
        <Image
          src="/Spireo Logo Symbol Custom.png"
          width={60}
          height={60}
          alt="Logo"
        />
        <div className="text-center">
          <h1 className="mb-2 text-4xl font-bold">404</h1>

          <p className="text-md mb-6">
            Oops! The page you're looking for doesn't exist.
          </p>
        </div>
        <div className="flex flex-col space-y-2">
          <Link
            href="https://spireo.ai"
            className="rounded-lg bg-blue-600 px-6 py-2 text-center text-white transition duration-300 hover:bg-blue-700"
          >
            Go to Spireo.ai
          </Link>
          <Link
            href="/dashboard/post"
            className="px-6 py-2 text-center text-sm text-blue-500 hover:text-blue-700 hover:underline "
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
