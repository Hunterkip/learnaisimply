import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Wanjiku Kamau",
    role: "HR Manager, Nairobi",
    initials: "WK",
    color: "from-rose-500 to-pink-600",
    rating: 5,
    quote:
      "I used to spend 3 hours writing reports. Now ChatGPT does the heavy lifting in 20 minutes. This course paid for itself in week one.",
    outcome: "Saves 12 hrs/week",
  },
  {
    name: "Brian Otieno",
    role: "Small Business Owner, Kisumu",
    initials: "BO",
    color: "from-blue-500 to-indigo-600",
    rating: 5,
    quote:
      "Honestly, I was skeptical. But the lessons are so simple my mum could follow them. I now run my whole business with AI.",
    outcome: "Doubled monthly sales",
  },
  {
    name: "Grace Achieng",
    role: "Teacher, Mombasa",
    initials: "GA",
    color: "from-emerald-500 to-teal-600",
    rating: 5,
    quote:
      "I create lesson plans, quizzes, and parent emails in minutes. My students think I'm a tech genius now 😄",
    outcome: "10x lesson prep speed",
  },
  {
    name: "Samuel Mwangi",
    role: "Marketing Consultant, Nairobi",
    initials: "SM",
    color: "from-amber-500 to-orange-600",
    rating: 5,
    quote:
      "Best 999 bob I've ever spent. The prompt techniques alone are worth 10x the price. Already recommended to 8 colleagues.",
    outcome: "Landed 3 new clients",
  },
  {
    name: "Faith Njeri",
    role: "Freelance Writer, Nakuru",
    initials: "FN",
    color: "from-purple-500 to-violet-600",
    rating: 5,
    quote:
      "From zero to confidently using AI in 2 weeks. The audio lessons are perfect — I learn while doing house chores.",
    outcome: "3x writing income",
  },
  {
    name: "David Kipchoge",
    role: "Accountant, Eldoret",
    initials: "DK",
    color: "from-cyan-500 to-blue-600",
    rating: 5,
    quote:
      "I was scared of AI replacing me. Now I use it as my assistant and finish work by 3pm. Game changer.",
    outcome: "Promoted within 2 months",
  },
];

export function Testimonials() {
  return (
    <section className="relative bg-background py-20 md:py-28 premium-section overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="premium-badge mb-6 inline-flex">⭐ 4.9/5 from 500+ Kenyans</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mt-4 mb-4">
            Real Stories from <span className="gradient-text">Real Learners</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Join hundreds of professionals across Kenya already saving hours and earning more with AI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="premium-card group relative"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-accent/20 group-hover:text-accent/40 transition-colors" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-warning text-warning" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground text-base leading-relaxed mb-6">
                "{t.quote}"
              </p>

              {/* Outcome badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-semibold mb-5">
                ✓ {t.outcome}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {[
            { num: "500+", label: "Active learners" },
            { num: "4.9★", label: "Average rating" },
            { num: "92%", label: "Completion rate" },
            { num: "30-day", label: "Money-back" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-extrabold gradient-text">{stat.num}</p>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
