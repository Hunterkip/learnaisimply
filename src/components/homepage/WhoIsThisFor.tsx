import { Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const audiences = [
  { text: "Professionals who want to work smarter", highlight: "work smarter" },
  { text: "Business owners looking to save time and grow", highlight: "save time" },
  { text: "Teams wanting practical AI skills", highlight: "practical AI skills" },
  { text: "Everyday individuals curious about AI", highlight: "curious about AI" },
  { text: "Anyone who wants practical use, not technical theory", highlight: "practical use" },
];

export function WhoIsThisFor() {
  return (
    <section className="relative bg-primary text-primary-foreground py-20 md:py-28 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/[0.06] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/[0.04] rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span className="premium-badge mb-6 inline-flex">Who is this for?</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-4 mb-5">
              Built for People Who{" "}
              <span className="gradient-text">Want Results</span>
            </h2>
            <p className="text-primary-foreground/60 text-lg max-w-xl mx-auto">
              Whether you're a professional, business owner, or just curious — this course meets you where you are.
            </p>
          </motion.div>

          <div className="bg-primary-foreground/[0.04] backdrop-blur-sm rounded-3xl border border-primary-foreground/10 p-8 md:p-10">
            <ul className="space-y-5">
              {audiences.map((audience, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center transition-all duration-300 group-hover:bg-accent/30 group-hover:scale-110">
                    <Check className="h-4 w-4 text-accent" />
                  </div>
                  <span className="text-primary-foreground/90 text-lg font-medium">{audience.text}</span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-primary-foreground/10">
              <p className="text-center text-primary-foreground/50 italic text-base flex items-center justify-center gap-2">
                <ArrowRight className="h-4 w-4 text-accent" />
                No prior experience with AI required
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
