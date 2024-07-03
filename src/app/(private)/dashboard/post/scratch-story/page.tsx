import { Suspense } from "react";
import ScratchStoryPage from "../../_components/scratch-story-page";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ScratchStoryPage />
    </Suspense>
  );
}
