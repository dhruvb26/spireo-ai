import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { FeatureSection } from "@/components/navigation/feature-section";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import Navbar from "@/components/navigation/navbar";
import HeroSection from "@/components/navigation/hero-section";
import VariablePricing from "@/components/navigation/variable-pricing";
import FixedPricing from "@/components/navigation/fixed-pricing";
import ImageComponent from "@/components/navigation/image-component";
import FAQComponent from "@/components/navigation/faq";
import NewFeatureSection from "@/components/navigation/new-feature-section";
import TestimonialSection from "@/components/navigation/testimonial-section";
import CTASection from "@/components/navigation/cta-section";

export default function HomePage() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Navbar />
      <section className="relative pb-10 pt-24 sm:pb-16 sm:pt-32 lg:min-h-[500px] lg:pb-24">
        <HeroSection />
      </section>
      <main className="flex-1">
        <section className="w-full bg-muted py-12 md:py-24 lg:py-32">
          <ImageComponent />
        </section>
        <section className="bg-white py-10 sm:py-16 lg:py-24">
          <NewFeatureSection />
        </section>
        <section className="bg-muted py-10 sm:py-16 lg:py-24">
          <TestimonialSection />
        </section>
        <section className="bg-white py-10 sm:py-16 lg:py-24">
          <CTASection />
        </section>
        {/* <section className="w-full py-12 md:py-24 lg:py-32">
          <FixedPricing />
        </section>
        <section className="bg-muted py-10 sm:py-16 lg:py-24">
          <FAQComponent />
        </section> */}
      </main>
    </div>
  );
}
