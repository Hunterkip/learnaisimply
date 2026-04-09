import { Video, Headphones, FileText, Infinity } from "lucide-react";
import { motion } from "framer-motion";

const formats = [
  {
    icon: Video,
    title: "Pre-recorded video lessons",
    description: "Watch at your convenience, pause and replay anytime",
    number: "01"
  },
  {
    icon: Headphones,
    title: "Audio versions",
    description: "Listen while you commute, walk, or relax",
    number: "02"
  },
  {
    icon: FileText,
    title: "Written notes & guides",
    description: "Reference material you can revisit anytime",
    number: "03"
  },
  {
    icon: Infinity,
    title: "Lifetime access",
    description: "Learn at your pace — your course never expires",
    number: "04"
  }
];

export function HowYouLearn() {
  return (
    <section className="relative bg-background py-20 md:py-28 premium-section">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span className="premium-badge mb-6 inline-flex">Flexible Learning</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mt-4 mb-4">
              Learn Your Way
            </h2>
            <p className="text-muted-foreground text-lg">
              Multiple formats so you can learn in the way that suits you best.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {formats.map((format, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="premium-card group"
              >
                <div className="flex items-start gap-5">
                  <div className="relative">
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-110">
                      <format.icon className="h-7 w-7 text-accent" />
                    </div>
                    <span className="absolute -top-2 -right-2 text-[10px] font-bold text-accent bg-accent/10 rounded-full w-6 h-6 flex items-center justify-center">
                      {format.number}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-foreground font-bold text-base mb-1.5">
                      {format.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {format.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
