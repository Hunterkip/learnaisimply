import { Gift, FileText, MessageSquare, Users, Award } from "lucide-react";
import { motion } from "framer-motion";

const bonuses = [
  {
    icon: FileText,
    title: "100+ AI Prompt Templates",
    desc: "Plug-and-play prompts for emails, content, research and more",
    value: "KES 1,500",
  },
  {
    icon: MessageSquare,
    title: "Private WhatsApp Community",
    desc: "Connect with 500+ Kenyan AI learners for tips and support",
    value: "KES 2,000",
  },
  {
    icon: Users,
    title: "Monthly Live Q&A Sessions",
    desc: "Get your questions answered by our AI experts every month",
    value: "KES 3,000",
  },
  {
    icon: Award,
    title: "Verified LinkedIn Certificate",
    desc: "Stand out to employers with a recognized AI literacy credential",
    value: "KES 1,500",
  },
];

export function BonusStack() {
  const totalValue = 8000;

  return (
    <section className="relative bg-background py-20 md:py-28 premium-section">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="premium-badge mb-6 inline-flex">
            <Gift className="h-4 w-4" /> Free Bonuses
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mt-4 mb-4">
            Plus <span className="gradient-text">KES {totalValue.toLocaleString()}</span> in Free Bonuses
          </h2>
          <p className="text-muted-foreground text-lg">
            Enroll today and get instant access to these exclusive bonuses — included free.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {bonuses.map((bonus, i) => (
            <motion.div
              key={bonus.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="premium-card group relative overflow-hidden"
            >
              {/* Free badge */}
              <div className="absolute top-4 right-4 bg-success text-success-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                Free Bonus
              </div>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                  <bonus.icon className="h-7 w-7 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground text-base md:text-lg mb-1.5 pr-20">
                    {bonus.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {bonus.desc}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Value:{" "}
                    <span className="line-through decoration-destructive">{bonus.value}</span>{" "}
                    <span className="text-success font-bold ml-1">FREE today</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Total value strip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-10 max-w-4xl mx-auto bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 border-2 border-dashed border-accent/30 rounded-2xl p-6 text-center"
        >
          <p className="text-sm text-muted-foreground mb-2">Total bonus value</p>
          <p className="text-4xl font-extrabold text-foreground">
            <span className="line-through decoration-destructive decoration-4 text-muted-foreground">
              KES {totalValue.toLocaleString()}
            </span>{" "}
            <span className="gradient-text">FREE</span>
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Yours when you enroll today
          </p>
        </motion.div>
      </div>
    </section>
  );
}
