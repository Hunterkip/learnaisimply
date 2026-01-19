import { Check } from "lucide-react";

const audiences = [
  "Professionals who want to work smarter",
  "Business owners looking to save time and grow",
  "Teams wanting practical AI skills",
  "Everyday individuals curious about AI",
  "Anyone who wants practical use, not technical theory"
];

export function WhoIsThisFor() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-4">
            Who This Course Is Designed For
          </h2>
          <p className="text-muted-foreground text-center mb-10 text-lg">
            This course is for professionals, business owners, teams, and everyday individuals who want to use AI practically — without needing a technical background.
          </p>
          
          <div className="bg-secondary rounded-2xl p-8 md:p-10">
            <ul className="space-y-4">
              {audiences.map((audience, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center mt-0.5">
                    <Check className="h-4 w-4 text-accent" />
                  </div>
                  <span className="text-foreground text-lg">{audience}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-center text-muted-foreground italic text-lg">
                You do not need prior experience with AI.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
