import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/homepage/Footer";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/spotlight-card";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MessageSquare, FileText, BarChart3, Zap, Palette, Search,
  Mail, Calendar, Database, Globe, Mic, Video, ArrowRight,
} from "lucide-react";

const toolCategories = [
  {
    title: "Conversational AI",
    tools: [
      { name: "ChatGPT", desc: "Master prompt engineering, multi-turn conversations, and content generation with the world's leading AI assistant.", icon: MessageSquare },
      { name: "Google Gemini", desc: "Leverage Google's AI for research, analysis, and multimodal tasks across text and images.", icon: Search },
      { name: "Microsoft Copilot", desc: "Integrate AI into your Microsoft workflow for documents, presentations, and data.", icon: FileText },
    ],
  },
  {
    title: "Content & Writing",
    tools: [
      { name: "AI Writing Assistants", desc: "Create professional emails, reports, blog posts, and marketing copy with AI assistance.", icon: Mail },
      { name: "AI Image Generation", desc: "Generate visuals, social media graphics, and creative assets using AI tools.", icon: Palette },
      { name: "Video & Audio AI", desc: "Create, edit, and enhance video and audio content with AI-powered tools.", icon: Video },
    ],
  },
  {
    title: "Productivity & Automation",
    tools: [
      { name: "Workflow Automation", desc: "Connect apps and automate repetitive tasks with tools like Zapier and Make.", icon: Zap },
      { name: "AI Scheduling", desc: "Optimize your calendar, meetings, and time management with intelligent scheduling.", icon: Calendar },
      { name: "Data Analysis", desc: "Transform raw data into actionable insights using AI analytics and visualization.", icon: BarChart3 },
    ],
  },
  {
    title: "Business & Research",
    tools: [
      { name: "AI Research Tools", desc: "Accelerate research with AI-powered search, summarization, and knowledge management.", icon: Globe },
      { name: "Voice & Transcription", desc: "Convert speech to text, generate meeting notes, and create transcriptions automatically.", icon: Mic },
      { name: "AI Databases", desc: "Organize and query information using AI-enhanced database and knowledge base tools.", icon: Database },
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.4 },
  }),
};

export default function AITools() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-3xl space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            AI Tools You'll <span className="text-accent">Master</span>
          </h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">
            Practical, hands-on training with the most impactful AI tools for productivity,
            content creation, automation, and business growth.
          </p>
          <Link to="/sign-up">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 h-14 text-base px-8 mt-4">
              Start Learning Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Tool Categories */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 space-y-16">
          {toolCategories.map((category, catIdx) => (
            <div key={category.title}>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">{category.title}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {category.tools.map((tool, i) => (
                  <motion.div
                    key={tool.name}
                    custom={catIdx * 3 + i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                  >
                    <GlowCard
                      glowColor={catIdx % 2 === 0 ? "blue" : "purple"}
                      customSize
                      className="h-full p-6 rounded-2xl"
                    >
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                          <tool.icon className="h-6 w-6 text-accent" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{tool.name}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{tool.desc}</p>
                      </div>
                    </GlowCard>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary/50 py-16">
        <div className="container mx-auto px-4 text-center max-w-2xl space-y-6">
          <h2 className="text-3xl font-bold text-foreground">Ready to Master These Tools?</h2>
          <p className="text-muted-foreground text-lg">
            Our course covers all these tools with practical, step-by-step training.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/assessment">
              <Button size="lg" variant="outline" className="h-14 text-base px-8">
                Take AI Assessment First
              </Button>
            </Link>
            <Link to="/sign-up">
              <Button size="lg" className="h-14 text-base px-8 bg-accent text-accent-foreground hover:bg-accent/90">
                Enroll Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
