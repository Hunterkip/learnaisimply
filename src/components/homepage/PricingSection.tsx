import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Shield, Zap, Crown, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { isEasterOfferActive, getCurrentPricing, getTimeLeft } from "@/lib/easterOffer";

export function PricingSection() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0, expired: false });
  const offerActive = isEasterOfferActive();
  const pricing = getCurrentPricing();

  useEffect(() => {
    if (!offerActive) return;
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    setTimeLeft(getTimeLeft());
    return () => clearInterval(interval);
  }, [offerActive]);

  const features = [
    "All 9 in-depth course modules",
    "Video + audio lessons (50+ hrs)",
    "Downloadable lesson notes & guides",
    "Lifetime access — no subscriptions",
    "Shareable LinkedIn certificate",
    "100+ ready-to-use AI prompts",
    "Mobile + desktop access",
    "Free future updates",
  ];

  return (
    <section id="pricing" className="relative bg-secondary py-20 md:py-28 premium-section overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="premium-badge mb-6 inline-flex">
            <Crown className="h-4 w-4" /> Limited-Time Offer
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mt-4 mb-4">
            One Payment. <span className="gradient-text">Lifetime Access.</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            No subscriptions. No hidden fees. Just everything you need to master AI.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative">
            {/* Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-accent via-accent/50 to-accent rounded-3xl blur-xl opacity-30" />

            <div className="relative bg-card border-2 border-accent/30 rounded-3xl p-8 md:p-10 shadow-2xl">
              {/* Top badge */}
              {offerActive && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-destructive to-warning text-white text-xs font-bold uppercase tracking-wider px-5 py-1.5 rounded-full shadow-lg">
                  🔥 60% OFF — Easter Special
                </div>
              )}

              {/* Plan name */}
              <div className="text-center mb-6 mt-2">
                <h3 className="text-2xl font-bold text-foreground mb-2">AI Simplified — Complete</h3>
                <p className="text-sm text-muted-foreground">Everything you need to use AI confidently</p>
              </div>

              {/* Price */}
              <div className="text-center mb-8">
                {offerActive && (
                  <div className="text-lg text-muted-foreground line-through decoration-destructive decoration-2 mb-1">
                    KES 2,500
                  </div>
                )}
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-6xl md:text-7xl font-extrabold gradient-text">
                    KES {pricing.kes.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  ≈ ${pricing.usd} • One-time payment
                </p>
              </div>

              {/* Countdown */}
              {offerActive && (
                <div className="mb-8 bg-destructive/5 border border-destructive/20 rounded-2xl p-4">
                  <p className="text-center text-xs uppercase tracking-wider text-destructive font-semibold mb-3">
                    ⏳ Offer ends in
                  </p>
                  <div className="flex justify-center gap-2 md:gap-3">
                    {[
                      { val: timeLeft.days, label: "Days" },
                      { val: timeLeft.hours, label: "Hrs" },
                      { val: timeLeft.mins, label: "Min" },
                      { val: timeLeft.secs, label: "Sec" },
                    ].map((item) => (
                      <div key={item.label} className="text-center">
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-card border border-border flex items-center justify-center text-xl md:text-2xl font-extrabold text-foreground shadow-sm">
                          {String(item.val).padStart(2, "0")}
                        </div>
                        <p className="text-[10px] uppercase text-muted-foreground mt-1.5">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-foreground">
                    <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-accent" strokeWidth={3} />
                    </div>
                    <span className="text-sm md:text-base">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                size="lg"
                onClick={() => navigate("/sign-up")}
                className="w-full h-14 text-base font-semibold bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/30 group"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Enroll Now — KES {pricing.kes.toLocaleString()}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-border">
                {[
                  { icon: Shield, text: "30-day refund" },
                  { icon: Zap, text: "Instant access" },
                  { icon: Crown, text: "Lifetime updates" },
                ].map((badge) => (
                  <div key={badge.text} className="flex flex-col items-center gap-1.5 text-center">
                    <badge.icon className="h-4 w-4 text-accent" />
                    <span className="text-[11px] text-muted-foreground font-medium">{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Money-back guarantee */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-card border border-border rounded-2xl p-6 flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
              <Shield className="h-6 w-6 text-success" />
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-1">100% Risk-Free Guarantee</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Try the course for 30 days. If you don't feel more confident with AI, we'll refund every shilling — no questions asked.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
