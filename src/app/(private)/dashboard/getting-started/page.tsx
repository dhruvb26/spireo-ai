import { GridCards } from "@/components/grid-cards";
import OnboardingCarousel from "@/components/frigade/onboarding-carousel";

const GettingStartedSteps = async () => {
  return (
    <main className="space-y-12">
      <div>
        <div className="mb-8 text-left">
          <h1 className="text-xl font-semibold tracking-tight text-brand-gray-900">
            Your LinkedIn Growth Journey Begins!
          </h1>
          <p className="text-sm text-brand-gray-500">
            Follow these steps to supercharge your LinkedIn presence and start
            creating impactful content.
          </p>
        </div>

        <OnboardingCarousel />
      </div>
      <div>
        <div className="mb-8 text-left">
          <h1 className="text-xl font-semibold tracking-tight text-brand-gray-900">
            Explore Our Features and Resources
          </h1>
          <p className="text-sm text-brand-gray-500">
            Discover how our tools and resources can help you enhance your
            LinkedIn presence and achieve your goals.
          </p>
        </div>
        <GridCards />
      </div>
    </main>
  );
};

export default GettingStartedSteps;
