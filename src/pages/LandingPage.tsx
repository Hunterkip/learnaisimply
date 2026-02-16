import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, Zap, Target, Users, BarChart3, Sparkles, Bot, BookOpen } from "lucide-react";
import { Footer } from "@/components/homepage/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { motion } from "framer-motion";

const features = [
  {
    icon: Brain,
    title: "AI Awareness",
    description: "Understand what AI really is and how it's transforming industries worldwide.",
  },
  {
    icon: Bot,
    title: "Practical Tools",
    description: "Master ChatGPT, automation tools, and AI productivity systems hands-on.",
  },
  {
    icon: Target,
    title: "Readiness Assessment",
    description: "Test your AI readiness instantly with our interactive assessment.",
  },
  {
    icon: BarChart3,
    title: "Measurable Progress",
    description: "Track your growth from beginner to confident AI practitioner.",
  },
];

const tools = [
  { name: "ChatGPT", desc: "Conversational AI" },
  { name: "AI Writing", desc: "Content creation" },
  { name: "Automation", desc: "Workflow tools" },
  { name: "Analytics", desc: "Data insights" },
  { name: "Productivity", desc: "Task optimization" },
  { name: "Creative AI", desc: "Design & media" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent/15 rounded-full text-accent text-sm font-medium"
            >
              <Sparkles className="h-4 w-4" />
              AI Education Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight"
            >
              Master AI Tools.{" "}
              <span className="text-accent">Simplify</span> Your Work.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto leading-relaxed"
            >
              LearnAISimply helps you assess your AI readiness and master practical AI tools — ChatGPT, automation, productivity systems, and more. No coding required.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/assessment">
                <Button size="lg" className="w-full sm:w-auto text-base px-8 bg-accent text-accent-foreground hover:bg-accent/90 h-14">
                  Start AI Readiness Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/ai-tools">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 h-14">
                  Explore AI Tools
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Learn AI
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From understanding AI fundamentals to mastering practical tools — we guide you every step.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-card rounded-2xl p-6 border border-border hover:border-accent/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tools Preview */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              AI Tools You'll Master
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Hands-on training with the most impactful AI tools for your work and business.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {tools.map((tool, i) => (
              <motion.div
                key={tool.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-card rounded-xl p-5 text-center border border-border hover:border-accent/30 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-5 w-5 text-accent" />
                </div>
                <h4 className="font-semibold text-sm text-foreground">{tool.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{tool.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/ai-tools">
              <Button variant="outline" size="lg" className="text-base">
                View All AI Tools
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Discover Your AI Potential?</h2>
            <p className="text-primary-foreground/70 text-lg">
              Take our free AI Readiness Assessment and get a personalized learning roadmap.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/assessment">
                <Button size="lg" className="w-full sm:w-auto text-base px-8 bg-accent text-accent-foreground hover:bg-accent/90 h-14">
                  Take Free Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 h-14">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Enroll Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
