import Navbar from "@/components/navigation/navbar";
import HeroSection from "@/components/navigation/hero-section";
import ImageComponent from "@/components/navigation/image-component";
import NewFeatureSection from "@/components/navigation/new-feature-section";
import TestimonialSection from "@/components/navigation/testimonial-section";
import CTASection from "@/components/navigation/cta-section";
import BeforeAfterSection from "@/components/navigation/before-after-section";
import FixedPricing from "@/components/navigation/fixed-pricing";

export default function HomePage() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <div className="sticky top-0 z-50 flex w-full items-center justify-center pt-2">
        <Navbar />
      </div>
      <section className="relative pb-10 pt-24 sm:pb-16 sm:pt-32 lg:min-h-[500px] lg:pb-24">
        <HeroSection />
      </section>
      <main className="flex-1">
        <section className="w-full bg-gray-50 py-12 md:py-24 lg:py-20">
          <ImageComponent />
        </section>
        <section className="lg:py-18 bg-muted py-10 sm:py-16">
          <BeforeAfterSection />
        </section>
        <section className="bg-white py-10 sm:py-16 lg:py-24">
          <NewFeatureSection />
        </section>
        <section className="bg-muted py-10 sm:py-16 lg:py-24">
          <TestimonialSection />
        </section>
        {/* <section className="bg-white py-10 sm:py-16 lg:py-24">
          <FixedPricing />
        </section> */}
        <section className="bg-white py-10 sm:py-16 lg:py-24">
          <CTASection />
        </section>

        {/* <section className="bg-white py-10 sm:py-16 lg:py-24">
          <FAQComponent />
        </section> */}
      </main>
    </div>
  );
}
