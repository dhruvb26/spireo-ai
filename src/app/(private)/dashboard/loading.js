import Image from "next/image";

export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50"
      aria-hidden="true"
    >
      <div className="relative h-24 w-24 animate-pulse">
        <Image
          src="/Spireo Logo Symbol Custom.png"
          alt="Loading"
          width={96}
          height={96}
          style={{ objectFit: "contain", width: "100%", height: "auto" }}
          priority
        />
      </div>
    </div>
  );
}
