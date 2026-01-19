import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Phone, ArrowRight, Lock, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type PaymentMode = "paypal" | "mpesa";

interface PaymentModeSelectorProps {
  plan: 'standard' | 'mastery';
  userEmail: string;
  onPaypalPayment: () => void;
}

const PRICING = {
  standard: { usd: 20, kes: 2500 },
  mastery: { usd: 40, kes: 5000 },
};

export function PaymentModeSelector({ 
  plan,
  userEmail,
  onPaypalPayment,
}: PaymentModeSelectorProps) {
  const { toast } = useToast();
  const [selectedMode, setSelectedMode] = useState<PaymentMode | null>(null);
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const pricing = PRICING[plan];

  const validatePhone = (phone: string) => {
    const cleanPhone = phone.replace(/[\s\-\+]/g, "");
    const kenyaPhoneRegex = /^(0|254)?7\d{8}$/;
    return kenyaPhoneRegex.test(cleanPhone);
  };

  const handleMpesaSubmit = async () => {
    if (!validatePhone(mpesaPhone)) {
      setPhoneError("Please enter a valid Kenyan phone number (e.g., 0712345678)");
      return;
    }
    setPhoneError("");
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('mpesa-stk-push', {
        body: {
          phoneNumber: mpesaPhone,
          amount: pricing.kes,
          accountReference: userEmail,
          plan: plan,
        },
      });

      if (error) {
        console.error('STK Push error:', error);
        toast({
          title: "Payment Error",
          description: "Failed to initiate M-Pesa payment. Please try again.",
          variant: "destructive",
        });
      } else if (data?.success) {
        toast({
          title: "Check Your Phone",
          description: "An M-Pesa payment request has been sent to your phone. Enter your PIN to complete.",
        });
      } else {
        toast({
          title: "Payment Failed",
          description: data?.message || "Failed to initiate payment",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('STK Push error:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Choose Payment Method
        </h3>
        <p className="text-muted-foreground">
          {plan === 'mastery' ? 'Mastery Path' : 'Standard Path'} — KES {pricing.kes.toLocaleString()} / ${pricing.usd}
        </p>
      </div>

      {/* Payment Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* PayPal Option */}
        <Card 
          className={cn(
            "p-4 cursor-pointer transition-all border-2",
            selectedMode === "paypal" 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/50"
          )}
          onClick={() => setSelectedMode("paypal")}
        >
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              selectedMode === "paypal" ? "bg-primary/20" : "bg-muted"
            )}>
              <CreditCard className={cn(
                "h-6 w-6",
                selectedMode === "paypal" ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">PayPal</h4>
              <p className="text-sm text-muted-foreground">Card or PayPal balance</p>
            </div>
            {selectedMode === "paypal" && (
              <Check className="h-5 w-5 text-primary" />
            )}
          </div>
        </Card>

        {/* M-Pesa Option */}
        <Card 
          className={cn(
            "p-4 cursor-pointer transition-all border-2",
            selectedMode === "mpesa" 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/50"
          )}
          onClick={() => setSelectedMode("mpesa")}
        >
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              selectedMode === "mpesa" ? "bg-primary/20" : "bg-muted"
            )}>
              <Phone className={cn(
                "h-6 w-6",
                selectedMode === "mpesa" ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">M-Pesa</h4>
              <p className="text-sm text-muted-foreground">STK Push / Paybill</p>
            </div>
            {selectedMode === "mpesa" && (
              <Check className="h-5 w-5 text-primary" />
            )}
          </div>
        </Card>
      </div>

      {/* Payment Details */}
      {selectedMode === "paypal" && (
        <div className="bg-muted/50 rounded-xl p-6 space-y-4">
          <div className="text-center space-y-2">
            <p className="text-foreground">
              You'll be redirected to PayPal to complete your payment securely.
            </p>
            <p className="text-sm text-muted-foreground">
              After payment, return to this site and log in to access your course.
            </p>
          </div>
          <Button 
            size="lg" 
            variant="continue"
            className="w-full text-lg"
            onClick={onPaypalPayment}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : `Pay with PayPal — $${pricing.usd}`}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}

      {selectedMode === "mpesa" && (
        <div className="bg-muted/50 rounded-xl p-6 space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mpesa-phone" className="text-foreground">
                M-Pesa Phone Number
              </Label>
              <Input
                id="mpesa-phone"
                type="tel"
                placeholder="0712345678"
                value={mpesaPhone}
                onChange={(e) => {
                  setMpesaPhone(e.target.value);
                  setPhoneError("");
                }}
                className="h-12 text-base"
              />
              {phoneError && (
                <p className="text-sm text-destructive">{phoneError}</p>
              )}
              <p className="text-sm text-muted-foreground">
                You'll receive an STK push to complete payment
              </p>
            </div>
          </div>
          
          <Button 
            size="lg" 
            variant="continue"
            className="w-full text-lg"
            onClick={handleMpesaSubmit}
            disabled={isProcessing || !mpesaPhone}
          >
            {isProcessing ? "Processing..." : `Pay with M-Pesa — KES ${pricing.kes.toLocaleString()}`}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            After payment confirmation, your course access will be unlocked automatically.
          </p>
        </div>
      )}

      {/* Security Note */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Lock className="h-4 w-4" />
        <span>Secure payment processing</span>
      </div>
    </div>
  );
}
