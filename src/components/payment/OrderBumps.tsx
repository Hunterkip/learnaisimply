import { useState } from "react";
import { Check, Phone, FileSpreadsheet, BookMarked } from "lucide-react";
import { motion } from "framer-motion";

interface Bump {
  id: string;
  icon: any;
  title: string;
  badge: string;
  desc: string;
  price: number;
  originalPrice: number;
}

const bumps: Bump[] = [
  {
    id: "coaching",
    icon: Phone,
    title: "1-on-1 AI Strategy Call",
    badge: "Most Popular",
    desc: "30-minute private call with an AI coach to map AI to your specific work or business.",
    price: 1500,
    originalPrice: 5000,
  },
  {
    id: "templates",
    icon: FileSpreadsheet,
    title: "Done-For-You Business Templates",
    badge: "Best Value",
    desc: "50+ pre-built AI workflows for emails, proposals, marketing, social media & more.",
    price: 700,
    originalPrice: 2500,
  },
  {
    id: "promptpack",
    icon: BookMarked,
    title: "Ultimate Prompt Pack (PDF)",
    badge: "Limited",
    desc: "500+ tested prompts for ChatGPT, Gemini & Claude — categorized by industry.",
    price: 300,
    originalPrice: 1200,
  },
];

interface OrderBumpsProps {
  selectedBumps: string[];
  onToggle: (id: string) => void;
}

export function OrderBumps({ selectedBumps, onToggle }: OrderBumpsProps) {
  return (
    <div className="space-y-3">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-accent">
            🎁 Power-Ups — Save 70% (One-Time Offer)
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Students who add <strong className="text-foreground">at least one power-up</strong> finish the course
          <strong className="text-foreground"> 3× faster</strong> and start using AI in their work within 7 days.
          These will <strong className="text-destructive">never be offered at this price again</strong> after checkout.
        </p>
      </div>

      {bumps.map((bump, i) => {
        const isSelected = selectedBumps.includes(bump.id);
        return (
          <motion.button
            key={bump.id}
            type="button"
            onClick={() => onToggle(bump.id)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${
              isSelected
                ? "border-accent bg-accent/5 shadow-md"
                : "border-dashed border-border bg-card hover:border-accent/50"
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Checkbox */}
              <div
                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                  isSelected ? "bg-accent border-accent" : "border-muted-foreground/30 bg-card"
                }`}
              >
                {isSelected && <Check className="h-4 w-4 text-accent-foreground" strokeWidth={3} />}
              </div>

              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <bump.icon className="h-5 w-5 text-accent" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-bold text-foreground text-sm leading-snug">
                    {bump.title}
                  </h4>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-warning/15 text-warning whitespace-nowrap">
                    {bump.badge}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                  {bump.desc}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-accent">
                    +KES {bump.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground line-through">
                    KES {bump.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-bold text-success">
                    Save {Math.round((1 - bump.price / bump.originalPrice) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

export function getBumpTotal(selectedBumps: string[]): number {
  return bumps
    .filter((b) => selectedBumps.includes(b.id))
    .reduce((sum, b) => sum + b.price, 0);
}

export function getBumps() {
  return bumps;
}
