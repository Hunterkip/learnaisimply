import { motion } from "framer-motion";

const modules = [
  { number: 0, title: "Welcome & Orientation", lessons: 3 },
  { number: 1, title: "Understanding AI", lessons: 4 },
  { number: 2, title: "Prompting & Iteration", lessons: 5 },
  { number: 3, title: "Communication with AI", lessons: 4 },
  { number: 4, title: "Planning & Research", lessons: 4 },
  { number: 5, title: "AI for Everyday Life", lessons: 4 },
  { number: 6, title: "Creative AI", lessons: 3 },
  { number: 7, title: "Wellbeing & Ethics", lessons: 3 },
  { number: 8, title: "Course Wrap-Up", lessons: 2 },
];

export function CourseStructure() {
  return (
    <section className="relative bg-secondary py-20 md:py-28 premium-section">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span className="premium-badge mb-6 inline-flex">9 Modules</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mt-4 mb-4">
              A Clear Path from Beginner to Confident
            </h2>
            <p className="text-muted-foreground text-lg">
              Short lessons. Clear explanations. Zero pressure.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="premium-card group"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground group-hover:scale-110">
                    {module.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-foreground font-semibold text-sm block">
                      {module.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {module.lessons} lessons
                    </span>
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
