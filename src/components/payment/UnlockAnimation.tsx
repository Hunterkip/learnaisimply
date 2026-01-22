import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";

interface UnlockAnimationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName?: string;
}

export function UnlockAnimation({ open, onOpenChange, userName }: UnlockAnimationProps) {
  const navigate = useNavigate();
  const [animationStage, setAnimationStage] = useState<"unlocking" | "revealed" | "complete">("unlocking");

  useEffect(() => {
    if (open) {
      setAnimationStage("unlocking");
      
      // Stage transitions
      const timer1 = setTimeout(() => setAnimationStage("revealed"), 1500);
      const timer2 = setTimeout(() => {
        setAnimationStage("complete");
        // Trigger confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899']
        });
      }, 2500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [open]);

  const handleStartLearning = () => {
    onOpenChange(false);
    navigate("/course");
  };

  const displayName = userName || "Learner";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg border-0 bg-transparent shadow-none">
        <div className="relative">
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent/30 via-primary/30 to-accent/30 blur-3xl opacity-50 animate-pulse" />
          
          <div className="relative bg-card rounded-3xl p-8 md:p-10 shadow-2xl border border-accent/20 overflow-hidden">
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 left-1/4 w-2 h-2 bg-accent rounded-full animate-ping" style={{ animationDelay: "0s" }} />
              <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-primary rounded-full animate-ping" style={{ animationDelay: "0.5s" }} />
              <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-accent rounded-full animate-ping" style={{ animationDelay: "1s" }} />
              <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-primary rounded-full animate-ping" style={{ animationDelay: "1.5s" }} />
            </div>

            {animationStage === "unlocking" && (
              <div className="text-center py-8 animate-fade-in">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-accent/30 rounded-full animate-spin" style={{ animationDuration: "3s" }} />
                  <div className="absolute inset-2 border-4 border-primary/40 rounded-full animate-spin" style={{ animationDuration: "2s", animationDirection: "reverse" }} />
                  <div className="absolute inset-4 bg-accent/20 rounded-full flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-accent animate-pulse" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Unlocking Your Course...
                </h2>
                <p className="text-muted-foreground">
                  Preparing your learning journey
                </p>
              </div>
            )}

            {animationStage === "revealed" && (
              <div className="text-center py-8 animate-scale-in">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-accent to-accent/60 rounded-full flex items-center justify-center shadow-lg shadow-accent/30">
                  <BookOpen className="h-12 w-12 text-accent-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Course Unlocked!
                </h2>
                <p className="text-muted-foreground">
                  All 9 modules are now available
                </p>
              </div>
            )}

            {animationStage === "complete" && (
              <div className="text-center py-6 animate-fade-in">
                <div className="w-20 h-20 mx-auto mb-6 bg-accent/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-12 w-12 text-accent" />
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  Thank You, {displayName}!
                </h2>
                
                <p className="text-lg text-primary font-medium mb-2">
                  For choosing to learn AI with
                </p>
                
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  <span className="text-2xl md:text-3xl font-bold">
                    AI Simplified
                  </span>
                  <Sparkles className="h-6 w-6 text-accent" />
                </div>
                
                <p className="text-muted-foreground mt-4 mb-6">
                  You now have full access to all course materials.<br />
                  Your AI journey starts now!
                </p>
                
                <Button 
                  size="lg"
                  variant="continue"
                  onClick={handleStartLearning}
                  className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Start Learning
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}