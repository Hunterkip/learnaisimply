import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/homepage/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Target, Heart, Users, Lightbulb, ArrowRight, Brain, Sparkles, Globe } from "lucide-react";

const values = [
  {
    icon: Lightbulb,
    title: "Simplicity First",
    desc: "We strip away jargon and complexity, making AI accessible to everyone regardless of technical background.",
  },
  {
    icon: Target,
    title: "Practical Focus",
    desc: "Every lesson is designed around real-world applications you can use immediately in your work and life.",
  },
  {
    icon: Heart,
    title: "Empowerment",
    desc: "We believe AI should empower people, not intimidate them. Our mission is to build confidence through education.",
  },
  {
    icon: Globe,
    title: "Global Access",
    desc: "Quality AI education should be available to everyone, everywhere. We keep our programs affordable and inclusive.",
  },
];

const stats = [
  { value: "9", label: "Course Modules" },
  { value: "50+", label: "Practical Lessons" },
  { value: "12+", label: "AI Tools Covered" },
  { value: "100%", label: "Practical Focus" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

export default function About() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/15 rounded-full text-accent text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            Our Story
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Making AI <span className="text-accent">Accessible</span> to Everyone
          </h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">
            We started LearnAISimply with a clear mission — to demystify artificial intelligence
            and empower everyday people and businesses to use AI confidently and productively.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Mission</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Artificial Intelligence is transforming every industry, but most people feel left behind.
                Technical jargon, complex tools, and rapid change create barriers that keep millions from
                benefiting from AI's potential.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                LearnAISimply exists to break down those barriers. We provide practical, easy-to-follow
                training that helps professionals, business owners, and everyday individuals master AI tools
                with confidence — no coding or technical background required.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="bg-card rounded-2xl p-6 border border-border text-center"
                >
                  <div className="text-3xl font-extrabold text-accent mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What We Stand For</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Our values guide everything we create and every student we serve.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-3xl space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Built by Educators & Practitioners</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Our team combines deep expertise in AI technology with a passion for education.
            We've spent years working with businesses and individuals to understand the real challenges
            people face when learning AI — and we've built our platform to solve exactly those problems.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <div className="flex -space-x-3">
              {[Brain, Users, Sparkles].map((Icon, i) => (
                <div key={i} className="w-12 h-12 rounded-full bg-accent/10 border-2 border-background flex items-center justify-center">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">AI Experts & Educators</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center max-w-2xl space-y-6">
          <h2 className="text-3xl font-bold">Start Your AI Journey Today</h2>
          <p className="text-primary-foreground/70 text-lg">
            Join learners who are already mastering AI tools and transforming their work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/assessment">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 h-14 text-base px-8">
                Take AI Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/sign-up">
              <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 h-14 text-base px-8">
                Enroll Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
