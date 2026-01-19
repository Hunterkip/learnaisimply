import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

export function HeroSection() {
  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
              AI Simplified
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 font-medium">
              For Everyday People and Business
            </p>
            <p className="text-lg text-primary-foreground/80 leading-relaxed max-w-xl">
              AI Simplified is a practical, easy-to-follow course designed to help 
              everyday people and businesses understand and use AI confidently — 
              without coding, hype, or overwhelm.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                variant="continue"
                onClick={scrollToPricing}
                className="text-lg px-8"
              >
                Enroll Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                className="text-lg px-8 bg-transparent border-2 border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Play className="mr-2 h-5 w-5" />
                Preview the Course
              </Button>
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div className="hidden md:flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Calm, professional illustration placeholder */}
              <div className="bg-primary-foreground/10 rounded-2xl p-8 backdrop-blur-sm border border-primary-foreground/20">
                <div className="space-y-4">
                  {/* Simplified interface mockup */}
                  <div className="bg-primary-foreground/20 rounded-lg h-8 w-3/4"></div>
                  <div className="bg-primary-foreground/15 rounded-lg h-24"></div>
                  <div className="flex gap-3">
                    <div className="bg-accent/60 rounded-lg h-10 flex-1"></div>
                    <div className="bg-primary-foreground/20 rounded-lg h-10 w-20"></div>
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="bg-primary-foreground/10 rounded h-4 w-full"></div>
                    <div className="bg-primary-foreground/10 rounded h-4 w-5/6"></div>
                    <div className="bg-primary-foreground/10 rounded h-4 w-4/6"></div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/15 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
