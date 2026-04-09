import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "Do I need to be good with technology?",
    answer: "Not at all. This course is designed for beginners. We explain everything in plain language, step by step. If you can use email and browse the web, you're ready for this course."
  },
  {
    question: "How long does the course take?",
    answer: "The course contains about 8–10 hours of content, but you can take as long as you need. There are no deadlines. Most learners complete it within 2–4 weeks at a comfortable pace."
  },
  {
    question: "Can I learn at my own pace?",
    answer: "Absolutely. You have lifetime access to all lessons. Watch them whenever suits you — morning, evening, or weekends. There's no rush."
  },
  {
    question: "Is this suitable if I've never used AI?",
    answer: "Yes, this is exactly who the course is for. We start from the very beginning and build your understanding gradually. No prior AI experience is expected or required."
  },
  {
    question: "Will this help me in daily life, not just work?",
    answer: "Definitely. We cover both professional and personal uses — from writing emails to planning trips, organizing your home, and even creative projects."
  },
  {
    question: "How do I access the course after payment?",
    answer: "After you complete your payment, you'll receive an email with login details. You can start learning immediately — the entire course will be available in your account."
  },
  {
    question: "What if I have questions during the course?",
    answer: "Each lesson includes detailed notes and examples. If you need additional support, you can reach out to our team through the course platform."
  }
];

export function FAQSection() {
  return (
    <section className="relative bg-secondary py-20 md:py-28 premium-section">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span className="premium-badge mb-6 inline-flex">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mt-4">
              Questions? We've Got Answers.
            </h2>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="premium-card px-6 border-border/30 data-[state=open]:border-accent/20"
                >
                  <AccordionTrigger className="text-left text-foreground font-semibold text-base hover:no-underline py-5 hover:text-accent transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
