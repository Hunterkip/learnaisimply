import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/homepage/HeroSection";
import { TrustSection } from "@/components/homepage/TrustSection";
import { WhoIsThisFor } from "@/components/homepage/WhoIsThisFor";
import { WhatYouLearn } from "@/components/homepage/WhatYouLearn";
import { CourseStructure } from "@/components/homepage/CourseStructure";
import { HowYouLearn } from "@/components/homepage/HowYouLearn";
import { FAQSection } from "@/components/homepage/FAQSection";
import { FinalCTA } from "@/components/homepage/FinalCTA";
import { Footer } from "@/components/homepage/Footer";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <TrustSection />
      <WhoIsThisFor />
      <WhatYouLearn />
      <CourseStructure />
      <HowYouLearn />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}
