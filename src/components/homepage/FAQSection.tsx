import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    question: "Is this course suitable if I've never used AI?",
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
    <section className="bg-secondary py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-background rounded-xl px-6 border border-border/50"
              >
                <AccordionTrigger className="text-left text-foreground font-medium text-lg hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
