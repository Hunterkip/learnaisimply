import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-primary text-primary-foreground py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">
            Ready to Learn AI with Confidence?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 leading-relaxed">
            You don't need to understand everything about AI. You only need to 
            learn how to use it thoughtfully and confidently. This course will 
            show you how.
          </p>
          <Button 
            size="lg" 
            variant="continue"
            onClick={scrollToPricing}
            className="text-lg px-10"
          >
            Enroll Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
