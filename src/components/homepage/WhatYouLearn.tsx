import { BookOpen, Mail, Calendar, Home, Shield } from "lucide-react";
import { motion } from "framer-motion";

const learningOutcomes = [
  {
    icon: BookOpen,
    text: "How AI works (without technical language)",
    tag: "Foundation"
  },
  {
    icon: Mail,
    text: "How to write clearer emails and documents",
    tag: "Communication"
  },
  {
    icon: Calendar,
    text: "How to plan, organize, and research with AI",
    tag: "Productivity"
  },
  {
    icon: Home,
    text: "How to use AI for everyday life tasks",
    tag: "Daily Life"
  },
  {
    icon: Shield,
    text: "How to use AI responsibly and safely",
    tag: "Ethics"
  }
];

export function WhatYouLearn() {
  return (
    <section className="relative bg-background py-20 md:py-28 premium-section">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span className="premium-badge mb-6 inline-flex">Curriculum</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mt-4 mb-4">
              Skills You'll Walk Away With
            </h2>
            <p className="text-muted-foreground text-lg">
              Practical, actionable skills you can use the same day you learn them.
            </p>
          </motion.div>

          <div className="space-y-4">
            {learningOutcomes.map((outcome, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="premium-card flex items-center gap-5 group"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-110">
                  <outcome.icon className="h-6 w-6 text-accent" />
                </div>
                <span className="text-foreground text-lg font-medium flex-1">
                  {outcome.text}
                </span>
                <span className="hidden sm:inline-flex text-xs font-semibold px-3 py-1 rounded-full bg-accent/10 text-accent">
                  {outcome.tag}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
