import { BookOpen, Mail, Calendar, Home, Shield } from "lucide-react";

const learningOutcomes = [
  {
    icon: BookOpen,
    text: "How AI works (without technical language)"
  },
  {
    icon: Mail,
    text: "How to write clearer emails and documents"
  },
  {
    icon: Calendar,
    text: "How to plan, organize, and research with AI"
  },
  {
    icon: Home,
    text: "How to use AI for everyday life tasks"
  },
  {
    icon: Shield,
    text: "How to use AI responsibly and safely"
  }
];

export function WhatYouLearn() {
  return (
    <section className="bg-primary/5 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-12">
            What You'll Learn
          </h2>
          
          <div className="space-y-5">
            {learningOutcomes.map((outcome, index) => (
              <div 
                key={index}
                className="flex items-center gap-5 bg-background rounded-xl p-5 shadow-sm"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <outcome.icon className="h-6 w-6 text-accent" />
                </div>
                <span className="text-foreground text-lg font-medium">
                  {outcome.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
