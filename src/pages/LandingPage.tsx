import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Brain, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto space-y-8"
        >
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-20 h-20 rounded-2xl bg-accent/15 flex items-center justify-center mx-auto"
          >
            <Brain className="h-10 w-10 text-accent" />
          </motion.div>

          {/* Welcome badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent/15 rounded-full text-accent text-sm font-medium"
          >
            <Sparkles className="h-4 w-4" />
            Welcome to LearnAISimply
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-[1.1] tracking-tight"
          >
            Discover Your{" "}
            <span className="text-accent">AI Readiness</span>
          </motion.h1>

          {/* Intro text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-primary-foreground/70 max-w-xl mx-auto leading-relaxed"
          >
            Take a quick assessment to find out where you stand with AI — and get a personalized learning path to master practical AI tools. No coding required.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Button
              size="lg"
              className="text-base px-10 bg-accent text-accent-foreground hover:bg-accent/90 h-16 text-lg font-semibold shadow-lg shadow-accent/20"
              onClick={() => navigate("/assessment")}
            >
              Start AI Readiness Assessment
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
          </motion.div>

          {/* Subtle note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-sm text-primary-foreground/40"
          >
            Takes less than 3 minutes • 10 questions • Free
          </motion.p>

          {/* Returning user link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="text-sm text-primary-foreground/50"
          >
            Already have an account?{" "}
            <button
              onClick={() => navigate("/log-in")}
              className="text-accent hover:text-accent/80 font-medium underline underline-offset-4 transition-colors"
            >
              Sign In
            </button>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
