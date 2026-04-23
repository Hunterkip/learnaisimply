import { ShieldCheck, Gift, MessageCircle, FileText, Award, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const freeBonuses = [
  {
    icon: MessageCircle,
    title: "Private WhatsApp Community",
    value: "KES 3,000",
    desc: "Direct access to fellow learners + weekly Q&A from instructors.",
  },
  {
    icon: FileText,
    title: "AI Quick-Start Guide (PDF)",
    value: "KES 1,500",
    desc: "30-page playbook you can download, print, and keep forever.",
  },
  {
    icon: Award,
    title: "Completion Recognition",
    value: "KES 2,000",
    desc: "Personalized acknowledgement letter when you finish all 9 modules.",
  },
  {
    icon: Sparkles,
    title: "Lifetime Updates",
    value: "KES 1,500",
    desc: "Every new lesson we add — yours forever, no extra payment.",
  },
];

const totalBonusValue = 8000;

export function GuaranteeAndBonuses() {
  return (
    <div className="space-y-5">
      {/* Money-Back Guarantee */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative bg-gradient-to-br from-success/10 via-success/5 to-transparent border-2 border-success/30 rounded-2xl p-5 sm:p-6 overflow-hidden"
      >
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-success/10 rounded-full blur-2xl" />
        <div className="relative flex items-start gap-4">
          <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-success/15 border border-success/30 flex items-center justify-center">
            <ShieldCheck className="h-7 w-7 text-success" strokeWidth={2.2} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="font-extrabold text-foreground text-base sm:text-lg">
                14-Day Money-Back Guarantee
              </h3>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-success/20 text-success">
                Risk-Free
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Try the full course for 14 days. If you don't feel more confident using AI by the end of
              Module 2, just email us — we'll refund every shilling. <strong className="text-foreground">No questions asked.</strong>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Free Bonuses Stack */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-accent" />
            <h3 className="font-bold text-foreground text-sm sm:text-base uppercase tracking-wide">
              FREE Bonuses Included
            </h3>
          </div>
          <span className="text-xs font-bold text-success bg-success/10 px-2 py-1 rounded-full">
            Worth KES {totalBonusValue.toLocaleString()}
          </span>
        </div>

        <ul className="space-y-3">
          {freeBonuses.map((bonus, i) => (
            <motion.li
              key={bonus.title}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="flex items-start gap-3"
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center mt-0.5">
                <bonus.icon className="h-4 w-4 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <h4 className="font-semibold text-foreground text-sm leading-tight">
                    {bonus.title}
                  </h4>
                  <span className="text-xs font-bold text-success line-through opacity-70 whitespace-nowrap">
                    {bonus.value}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{bonus.desc}</p>
              </div>
            </motion.li>
          ))}
        </ul>

        <div className="mt-4 pt-3 border-t border-dashed border-border flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">All bonuses today:</span>
          <div className="text-right">
            <span className="text-xs text-muted-foreground line-through mr-2">
              KES {totalBonusValue.toLocaleString()}
            </span>
            <span className="text-base font-extrabold text-success">FREE</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
