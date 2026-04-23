import { HeroSection } from "@/components/homepage/HeroSection";
import { TrustSection } from "@/components/homepage/TrustSection";
import { WhoIsThisFor } from "@/components/homepage/WhoIsThisFor";
import { WhatYouLearn } from "@/components/homepage/WhatYouLearn";
import { CourseStructure } from "@/components/homepage/CourseStructure";
import { HowYouLearn } from "@/components/homepage/HowYouLearn";
import { Testimonials } from "@/components/homepage/Testimonials";
import { PricingSection } from "@/components/homepage/PricingSection";
import { BonusStack } from "@/components/homepage/BonusStack";
import { FAQSection } from "@/components/homepage/FAQSection";
import { FinalCTA } from "@/components/homepage/FinalCTA";
import { Footer } from "@/components/homepage/Footer";
import { ScarcityBanner } from "@/components/homepage/ScarcityBanner";
import { LiveActivityTicker } from "@/components/homepage/LiveActivityTicker";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-background">
      <ScarcityBanner />
      <HeroSection />
      <TrustSection />
      <WhoIsThisFor />
      <WhatYouLearn />
      <CourseStructure />
      <Testimonials />
      <HowYouLearn />
      <BonusStack />
      <PricingSection />
      <FAQSection />
      <FinalCTA />
      <Footer />
      <LiveActivityTicker />
    </div>
  );
}
