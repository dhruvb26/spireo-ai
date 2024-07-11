import Navbar from "@/components/navigation/navbar";
import FAQComponent from "@/components/navigation/faq";
import VariablePricing from "@/components/navigation/variable-pricing";
import DotPattern from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <div className="sticky top-0 z-50 flex w-full items-center justify-center pt-2">
        <Navbar />
      </div>
      <main className="flex-1">
        <section className="relative w-full py-12 md:py-24 lg:py-32">
          <div className="relative z-10">
            <VariablePricing />
          </div>
        </section>
        <section className="bg-muted py-10 sm:py-16 lg:py-24">
          <FAQComponent />
        </section>
      </main>
    </div>
  );
}
