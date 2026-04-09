import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function FinalCTA() {
  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative bg-primary text-primary-foreground py-20 md:py-32 overflow-hidden">
      {/* Premium background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-accent/[0.06] rounded-full blur-[150px]" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent/[0.04] rounded-full blur-[80px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-accent/15 text-accent border border-accent/20 mb-8">
            <Sparkles className="h-4 w-4" />
            Your AI journey starts here
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            Ready to Learn AI
            <br />
            <span className="gradient-text">with Confidence?</span>
          </h2>
          <p className="text-lg text-primary-foreground/60 mb-10 leading-relaxed max-w-lg mx-auto">
            You don't need to understand everything about AI. You just need to 
            learn how to use it thoughtfully. This course shows you how.
          </p>
          <Button
            size="lg"
            variant="continue"
            onClick={scrollToPricing}
            className="text-lg px-10 h-14 shadow-lg shadow-accent/25 font-semibold"
          >
            Enroll Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-primary-foreground/30 mt-6">
            30-day money-back guarantee • Instant access • Lifetime updates
          </p>
        </motion.div>
      </div>
    </section>
  );
}
