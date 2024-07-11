"use client";

import { useEffect, useState } from "react";
// ... other imports

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading spinner
  }

  return <div className="flex flex-col">Getting Started</div>;
}
