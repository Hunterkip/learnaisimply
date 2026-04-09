import { Code2, Clock, Video, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

const trustItems = [
  {
    icon: Code2,
    title: "No coding required",
    description: "Everything explained in plain, everyday language",
    gradient: "from-accent/10 to-accent/5"
  },
  {
    icon: Clock,
    title: "Learn at your own pace",
    description: "Lifetime access — no deadlines, no pressure",
    gradient: "from-accent/10 to-accent/5"
  },
  {
    icon: Video,
    title: "Video + audio lessons",
    description: "Watch, listen, or read — however suits you best",
    gradient: "from-accent/10 to-accent/5"
  },
  {
    icon: Lightbulb,
    title: "Real-world examples",
    description: "Practical scenarios you'll actually use in daily life",
    gradient: "from-accent/10 to-accent/5"
  }
];

export function TrustSection() {
  return (
    <section className="relative bg-background py-20 md:py-28 premium-section">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="premium-card text-center group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mx-auto mb-5 transition-transform duration-500 group-hover:scale-110`}>
                <item.icon className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
