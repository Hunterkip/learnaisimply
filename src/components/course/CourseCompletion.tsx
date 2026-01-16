import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Award, ArrowRight, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

interface CourseCompletionProps {
  onExploreMore: () => void;
}

export function CourseCompletion({ onExploreMore }: CourseCompletionProps) {
  useEffect(() => {
    // Fire confetti on mount
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b"];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Big burst at the start
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors,
    });
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-2xl text-center animate-fade-in">
        {/* Celebration Icon */}
        <div className="relative w-28 h-28 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-8">
          <Award className="h-14 w-14 text-success animate-scale-in" />
          <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-amber-500 animate-pulse" />
          <Sparkles className="absolute -bottom-1 -left-3 h-5 w-5 text-primary animate-pulse" />
        </div>

        {/* Congratulations Message */}
        <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
          🎉 Congratulations!
        </h1>
        <p className="text-xl text-muted-foreground mb-4 leading-relaxed">
          You've completed the <span className="text-foreground font-medium">AI for Adults 40+</span> course!
        </p>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          You now know how to use AI calmly and confidently in your work and daily life.
        </p>

        {/* Tech + Human tagline */}
        <div className="inline-block bg-primary/10 text-primary px-6 py-3 rounded-full text-lg font-medium mb-10">
          Tech + Human = Superhumans
        </div>

        {/* Reflection Box */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8 text-left">
          <h2 className="text-lg font-medium text-foreground mb-4 text-center">
            What You've Achieved
          </h2>
          <ul className="space-y-3 text-foreground/80">
            <li className="flex items-start gap-3">
              <span className="text-success mt-0.5 text-lg">✓</span>
              <span>Understanding of what AI is — and what it is not</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-success mt-0.5 text-lg">✓</span>
              <span>Skills to guide AI through clear prompting and iteration</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-success mt-0.5 text-lg">✓</span>
              <span>Confidence to use AI for communication, planning, and creativity</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-success mt-0.5 text-lg">✓</span>
              <span>Awareness of AI ethics, safety, and responsible use</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-success mt-0.5 text-lg">✓</span>
              <span>A calm, thoughtful approach to staying relevant with AI</span>
            </li>
          </ul>
        </div>

        {/* Thank You Message */}
        <div className="bg-muted/50 rounded-xl p-6 mb-8">
          <p className="text-foreground leading-relaxed">
            Thank you for taking the time to learn, reflect, and grow.
          </p>
          <p className="text-muted-foreground mt-2">
            This is not the end — it is simply a more confident beginning.
          </p>
        </div>

        {/* Next Steps */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Ready to explore more? We have additional resources to continue your journey.
          </p>
          <Button 
            variant="outline" 
            size="lg"
            onClick={onExploreMore}
            className="gap-2"
          >
            Explore More Resources
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}