import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Brain, Sparkles, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center relative overflow-hidden">
      {/* Premium background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-accent/[0.07] rounded-full blur-[150px]" />
        <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-accent/[0.04] rounded-full blur-[180px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/[0.03] rounded-full blur-[200px]" />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(hsl(210 40% 98%) 1px, transparent 1px), linear-gradient(90deg, hsl(210 40% 98%) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />
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
            className="w-20 h-20 rounded-3xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto backdrop-blur-sm"
          >
            <Brain className="h-10 w-10 text-accent" />
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="premium-badge mx-auto"
          >
            <Sparkles className="h-4 w-4" />
            Welcome to LearnAISimply
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-[1.08] tracking-tight"
          >
            Discover Your{" "}
            <span className="gradient-text">AI Readiness</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-primary-foreground/60 max-w-xl mx-auto leading-relaxed"
          >
            Take a quick assessment to find out where you stand with AI — and get a personalized learning path. No coding required.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Button
              size="lg"
              className="text-base px-10 bg-accent text-accent-foreground hover:bg-accent/90 h-14 text-lg font-semibold shadow-lg shadow-accent/20"
              onClick={() => navigate("/assessment")}
            >
              Start AI Readiness Assessment
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex items-center justify-center gap-6 text-primary-foreground/30"
          >
            {[
              { icon: Zap, text: "2 min" },
              { icon: Shield, text: "Free" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 text-sm">
                <item.icon className="h-3.5 w-3.5" />
                {item.text}
              </div>
            ))}
          </motion.div>

          {/* Sign in link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="text-sm text-primary-foreground/40"
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
