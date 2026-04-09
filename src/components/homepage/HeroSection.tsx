import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, Star, Users, Award } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { icon: Users, value: "2,500+", label: "Learners" },
  { icon: Star, value: "4.9/5", label: "Rating" },
  { icon: Award, value: "Certificate", label: "Included" },
];

export function HeroSection() {
  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative bg-primary text-primary-foreground overflow-hidden">
      {/* Premium background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-accent/[0.07] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/[0.05] rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/[0.03] rounded-full blur-[150px]" />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(hsl(210 40% 98%) 1px, transparent 1px), linear-gradient(90deg, hsl(210 40% 98%) 1px, transparent 1px)',
          backgroundSize: '64px 64px'
        }} />
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32 lg:py-40 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="premium-badge">
                <Sparkles className="h-4 w-4" />
                The #1 AI Course for Non-Technical Professionals
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight"
            >
              Master AI.{" "}
              <span className="gradient-text">No Code.</span>
              <br />
              No Confusion.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-primary-foreground/70 leading-relaxed max-w-lg"
            >
              A practical, step-by-step course that helps everyday people and businesses 
              use AI confidently — without technical jargon or overwhelm.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                variant="continue"
                onClick={scrollToPricing}
                className="text-lg px-8 h-14 shadow-lg shadow-accent/20 font-semibold"
              >
                Start Learning Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                className="text-lg px-8 h-14 bg-primary-foreground/[0.08] border border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/[0.12] backdrop-blur-sm"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Preview
              </Button>
            </motion.div>

            {/* Social proof stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex items-center gap-8 pt-4"
            >
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center">
                    <stat.icon className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-primary-foreground">{stat.value}</div>
                    <div className="text-xs text-primary-foreground/50">{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Side — Premium Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative w-full max-w-md">
              {/* Main card */}
              <div className="relative bg-primary-foreground/[0.06] backdrop-blur-xl rounded-3xl p-8 border border-primary-foreground/10 shadow-2xl">
                {/* Floating UI mockup */}
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-accent/60" />
                    <div className="w-3 h-3 rounded-full bg-success/60" />
                    <div className="flex-1" />
                    <div className="text-xs text-primary-foreground/30 font-mono">AI Simplified</div>
                  </div>
                  <div className="bg-primary-foreground/[0.08] rounded-xl p-4 space-y-3">
                    <div className="text-xs text-primary-foreground/40 font-mono">Prompt</div>
                    <div className="bg-primary-foreground/[0.06] rounded-lg h-3 w-full" />
                    <div className="bg-primary-foreground/[0.06] rounded-lg h-3 w-4/5" />
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-accent/30 rounded-xl h-12 flex-1 flex items-center justify-center">
                      <span className="text-xs font-semibold text-accent">Generate</span>
                    </div>
                    <div className="bg-primary-foreground/[0.08] rounded-xl h-12 w-12 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-primary-foreground/40" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-primary-foreground/[0.05] rounded-lg h-3 w-full" />
                    <div className="bg-primary-foreground/[0.05] rounded-lg h-3 w-5/6" />
                    <div className="bg-primary-foreground/[0.05] rounded-lg h-3 w-3/4" />
                    <div className="bg-primary-foreground/[0.05] rounded-lg h-3 w-4/6" />
                  </div>
                  {/* Progress indicator */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-primary-foreground/[0.08] rounded-full h-1.5">
                      <div className="bg-accent h-1.5 rounded-full w-3/4" />
                    </div>
                    <span className="text-xs text-accent font-semibold">75%</span>
                  </div>
                </div>
              </div>

              {/* Floating accent elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-accent/10 rounded-full blur-3xl" style={{ animation: 'glow-pulse 4s ease-in-out infinite' }} />
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-accent/[0.07] rounded-full blur-3xl" style={{ animation: 'glow-pulse 4s ease-in-out infinite 2s' }} />
              
              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-4 top-1/4 bg-card text-foreground rounded-xl px-4 py-2.5 shadow-xl border border-border/50"
              >
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-accent" />
                  <span className="text-xs font-semibold">Certificate Ready</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -left-4 bottom-1/4 bg-card text-foreground rounded-xl px-4 py-2.5 shadow-xl border border-border/50"
              >
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-accent fill-accent" />
                  <span className="text-xs font-semibold">4.9 Rating</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
