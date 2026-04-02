import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { motion } from "framer-motion";
import { isEasterOfferActive, getTimeLeft, EASTER_OFFER } from "@/lib/easterOffer";

interface EasterOfferBannerProps {
  variant?: "inline" | "compact";
}

export function EasterOfferBanner({ variant = "inline" }: EasterOfferBannerProps) {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const offerActive = isEasterOfferActive();

  useEffect(() => {
    if (!offerActive) return;
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, [offerActive]);

  if (dismissed || !offerActive) return null;

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-r from-primary via-primary/95 to-primary/90 p-4 md:p-6"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-destructive via-warning to-success" 
          style={{ backgroundSize: "400% 100%", animation: "shimmer 4s linear infinite" }} />
        
        <button onClick={() => setDismissed(true)} className="absolute top-2 right-2 text-primary-foreground/40 hover:text-primary-foreground">
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐣</span>
            <div>
              <p className="text-xs font-semibold text-warning uppercase tracking-wider">Easter Special</p>
              <p className="text-primary-foreground font-bold">
                <span className="line-through text-primary-foreground/40 mr-2">KES {EASTER_OFFER.originalPrice.toLocaleString()}</span>
                <span className="text-lg text-accent">KES {EASTER_OFFER.offerPrice.toLocaleString()}</span>
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="continue"
            onClick={() => navigate("/enroll")}
            className="whitespace-nowrap"
          >
            Claim Offer <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-border bg-primary text-primary-foreground p-6 md:p-10"
    >
      <div className="absolute top-0 left-0 right-0 h-[5px] bg-gradient-to-r from-destructive via-warning to-success"
        style={{ backgroundSize: "400% 100%", animation: "shimmer 4s linear infinite" }} />

      <div className="absolute -top-20 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-info/10 rounded-full blur-3xl" />

      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      <div className="relative z-10 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/10">
          <div className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse" />
          <span className="text-xs font-semibold text-primary-foreground uppercase tracking-wider">🐣 Easter Holiday Special</span>
        </div>

        {/* Poster image */}
        <div className="mx-auto max-w-[200px]">
          <img src="/images/easter-offer.png" alt="Easter Holiday Special" className="w-full rounded-xl shadow-xl" />
        </div>

        <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">
          Master Artificial Intelligence{" "}
          <span className="bg-gradient-to-r from-accent to-info bg-clip-text text-transparent">Today</span>
        </h2>

        <p className="text-primary-foreground/60 max-w-md mx-auto">
          This Easter, unlock full access to our AI courses at an unbeatable price. No prior tech experience needed.
        </p>

        <div className="flex items-center justify-center gap-6 md:gap-10 bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-6 max-w-md mx-auto">
          <div className="text-left">
            <p className="text-xs uppercase tracking-wider text-primary-foreground/40">Regular price</p>
            <p className="text-2xl md:text-3xl font-bold text-primary-foreground/30 line-through decoration-destructive/70 decoration-2">KES {EASTER_OFFER.originalPrice.toLocaleString()}</p>
          </div>
          <span className="text-2xl text-primary-foreground/20">→</span>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-success">Easter price</p>
            <p className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-success to-info bg-clip-text text-transparent">KES {EASTER_OFFER.offerPrice.toLocaleString()}</p>
          </div>
        </div>

        {/* Timer */}
        <div>
          <p className="text-xs uppercase tracking-wider text-primary-foreground/40 mb-3">⏳ Offer expires when Easter ends</p>
          <div className="flex justify-center gap-3">
            {[
              { val: timeLeft.days, label: "Days" },
              { val: timeLeft.hours, label: "Hours" },
              { val: timeLeft.mins, label: "Mins" },
              { val: timeLeft.secs, label: "Secs" },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="text-center">
                  <div className="w-14 h-12 md:w-16 md:h-14 flex items-center justify-center rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 text-xl md:text-2xl font-extrabold">
                    {String(item.val).padStart(2, "0")}
                  </div>
                  <p className="text-[10px] uppercase tracking-wider text-primary-foreground/40 mt-1">{item.label}</p>
                </div>
                {i < 3 && <span className="text-xl font-bold text-primary-foreground/20 -mt-4">:</span>}
              </div>
            ))}
          </div>
        </div>

        <Button
          size="lg"
          variant="continue"
          onClick={() => navigate("/enroll")}
          className="w-full max-w-md text-lg relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5" />
            Claim Your Easter Offer → KES {EASTER_OFFER.offerPrice.toLocaleString()}
          </span>
        </Button>

        <p className="text-xs text-primary-foreground/30">
          Visit <span className="text-info/70">learnaisimply.com</span> to enroll now
        </p>
      </div>
    </motion.section>
  );
}
