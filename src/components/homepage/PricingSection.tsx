import { Button } from "@/components/ui/button";
import { Check, Lock, CreditCard } from "lucide-react";

const included = [
  "Full course access (all 9 modules)",
  "Video + audio lessons",
  "Written lesson notes",
  "Lifetime access",
  "Certificate of completion"
];

export function PricingSection() {
  const handleEnroll = () => {
    // TODO: Integrate with Stripe payment
    console.log("Enroll clicked - Stripe integration pending");
  };

  return (
    <section id="pricing" className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-12">
            Enroll Today
          </h2>
          
          <div className="bg-secondary rounded-2xl p-8 md:p-10 border-2 border-accent/30 shadow-lg">
            {/* Price */}
            <div className="text-center mb-8">
              <div className="text-5xl font-bold text-foreground mb-2">
                $97
              </div>
              <p className="text-muted-foreground text-lg">
                One-time payment • Lifetime access
              </p>
            </div>
            
            {/* What's included */}
            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-foreground text-lg">
                What's included:
              </h3>
              <ul className="space-y-3">
                {included.map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                      <Check className="h-3 w-3 text-accent" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* CTA Button */}
            <Button 
              size="lg" 
              variant="continue"
              onClick={handleEnroll}
              className="w-full text-lg py-6 mb-6"
            >
              Enroll Now & Get Access
            </Button>
            
            {/* Payment info */}
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>Secure checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>Powered by Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
