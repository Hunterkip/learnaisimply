import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Brain, Zap, Target, Award } from "lucide-react";

const typingTexts = [
  "Write emails that connect...",
  "Research topics in seconds...",
  "Plan your day smarter...",
  "Create content effortlessly...",
  "Make decisions with confidence..."
];

const progressStages = [
  { icon: Sparkles, label: "Curious Beginner", color: "from-accent/40 to-accent/60" },
  { icon: Brain, label: "Understanding AI", color: "from-accent/50 to-accent/70" },
  { icon: Zap, label: "Active Learner", color: "from-accent/60 to-accent/80" },
  { icon: Target, label: "Confident User", color: "from-accent/70 to-accent/90" },
  { icon: Award, label: "AI Pro", color: "from-accent to-success" }
];

export function AnimatedHero() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [currentStage, setCurrentStage] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  // Typing animation
  useEffect(() => {
    const text = typingTexts[currentTextIndex];
    
    if (isTyping) {
      if (displayedText.length < text.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(text.slice(0, displayedText.length + 1));
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      if (displayedText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, 30);
        return () => clearTimeout(timeout);
      } else {
        setCurrentTextIndex((prev) => (prev + 1) % typingTexts.length);
        setIsTyping(true);
      }
    }
  }, [displayedText, isTyping, currentTextIndex]);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev + 1) % progressStages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-primary text-primary-foreground overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Animated Text Content */}
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
              AI Simplified
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 font-medium">
              For Everyday People and Business
            </p>
            
            {/* AI Typing Effect Container */}
            <div className="bg-primary-foreground/10 rounded-xl p-6 backdrop-blur-sm border border-primary-foreground/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-destructive/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-success/80"></div>
                <span className="ml-2 text-xs text-primary-foreground/60">AI Assistant</span>
              </div>
              <div className="font-mono text-lg md:text-xl text-primary-foreground/90 min-h-[2rem]">
                <span className="text-accent">→</span> {displayedText}
                <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
              </div>
            </div>

            <p className="text-lg text-primary-foreground/80 leading-relaxed max-w-xl">
              Learn to use AI confidently — without coding, hype, or overwhelm.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                variant="continue"
                onClick={scrollToPricing}
                className="text-lg px-8 group"
              >
                Start Learning
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Right Side - AI Progress Animation */}
          <div className="hidden md:flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Progress Journey Visualization */}
              <div className="bg-primary-foreground/10 rounded-2xl p-8 backdrop-blur-sm border border-primary-foreground/20">
                <div className="text-center mb-6">
                  <span className="text-sm text-primary-foreground/60 uppercase tracking-wider">Your AI Journey</span>
                </div>
                
                {/* Progress Stages */}
                <div className="space-y-4">
                  {progressStages.map((stage, index) => {
                    const Icon = stage.icon;
                    const isActive = index === currentStage;
                    const isPast = index < currentStage;
                    
                    return (
                      <div 
                        key={index}
                        className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-500 ${
                          isActive 
                            ? 'bg-gradient-to-r ' + stage.color + ' scale-105 shadow-lg' 
                            : isPast 
                              ? 'bg-primary-foreground/20 opacity-60' 
                              : 'bg-primary-foreground/5 opacity-40'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                          isActive ? 'bg-primary-foreground text-primary scale-110' : 'bg-primary-foreground/20'
                        }`}>
                          <Icon className={`h-5 w-5 ${isActive ? 'animate-pulse' : ''}`} />
                        </div>
                        <span className={`font-medium transition-all duration-300 ${
                          isActive ? 'text-primary-foreground' : 'text-primary-foreground/70'
                        }`}>
                          {stage.label}
                        </span>
                        {isActive && (
                          <div className="ml-auto">
                            <div className="w-2 h-2 rounded-full bg-primary-foreground animate-ping"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Animated Progress Bar */}
                <div className="mt-6 pt-4 border-t border-primary-foreground/20">
                  <div className="flex justify-between text-xs text-primary-foreground/60 mb-2">
                    <span>Learning Progress</span>
                    <span>{((currentStage + 1) / progressStages.length * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-primary-foreground/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-accent to-success rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${((currentStage + 1) / progressStages.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-success/15 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
