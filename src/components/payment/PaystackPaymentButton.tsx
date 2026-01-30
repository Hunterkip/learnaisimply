import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, Lock, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PaystackPaymentButtonProps {
  plan?: "standard";
  userEmail: string;
  userName?: string;
  pricing: { usd: number; kes: number };
}

export function PaystackPaymentButton({ 
  plan = "standard", 
  userEmail, 
  userName,
  pricing 
}: PaystackPaymentButtonProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaystackClick = async () => {
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke("paystack-initialize", {
        body: {
          plan: plan,
          userEmail: userEmail,
          userName: userName,
        },
      });

      if (error || !data?.success) {
        console.error("Paystack error:", error || data?.message);
        toast({
          title: "Payment Error",
          description: data?.message || "Failed to initiate payment. Please try again.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // Redirect to Paystack checkout
      window.location.href = data.authorizationUrl;
    } catch (err) {
      console.error("Paystack error:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Card */}
      <div className="bg-gradient-to-br from-paystack/5 to-paystack/10 border border-paystack/20 rounded-2xl p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-paystack/10 mb-2">
            <CreditCard className="h-7 w-7 text-paystack" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Secure Payment</h3>
          <p className="text-muted-foreground text-sm">
            Pay with Card, Bank Transfer, or Mobile Money
          </p>
        </div>

        {/* Price Display */}
        <div className="bg-card rounded-xl p-4 text-center border border-border">
          <div className="text-3xl md:text-4xl font-bold text-foreground">
            KES {pricing.kes.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            ≈ ${pricing.usd} USD • One-time payment
          </div>
        </div>

        {/* Pay Button */}
        <Button
          size="lg"
          className="w-full h-14 text-lg bg-paystack hover:bg-paystack/90 text-white font-medium"
          onClick={handlePaystackClick}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              Pay Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Lock className="h-4 w-4" />
          <span>Secured by Paystack</span>
        </div>
      </div>
    </div>
  );
}
