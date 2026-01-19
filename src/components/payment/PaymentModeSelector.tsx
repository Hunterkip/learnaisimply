import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Lock, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PayPalIcon, MpesaIcon } from "@/components/icons/PaymentIcons";
import { PaymentProcessingDialog } from "./PaymentProcessingDialog";

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
  const [showProcessingDialog, setShowProcessingDialog] = useState(false);
  const [activePaymentMethod, setActivePaymentMethod] = useState<"mpesa" | "paypal">("mpesa");

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
    setActivePaymentMethod("mpesa");
    setShowProcessingDialog(true);

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
        setShowProcessingDialog(false);
      } else if (!data?.success) {
        toast({
          title: "Payment Failed",
          description: data?.message || "Failed to initiate payment",
          variant: "destructive",
        });
        setShowProcessingDialog(false);
      }
      // If success, dialog stays open and handles the flow
    } catch (err) {
      console.error('STK Push error:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setShowProcessingDialog(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaypalClick = () => {
    setActivePaymentMethod("paypal");
    // Open PayPal in new window
    window.open("https://www.paypal.com/ncp/payment/4ZXYM57QPZW94", "_blank", "noopener,noreferrer");
    setShowProcessingDialog(true);
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
              ? "border-paypal bg-paypal/5" 
              : "border-border hover:border-paypal/50"
          )}
          onClick={() => setSelectedMode("paypal")}
        >
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              selectedMode === "paypal" ? "bg-paypal/20" : "bg-muted"
            )}>
              <PayPalIcon className={cn(
                selectedMode === "paypal" ? "text-paypal" : "text-muted-foreground"
              )} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">PayPal</h4>
              <p className="text-sm text-muted-foreground">Card or PayPal balance</p>
            </div>
            {selectedMode === "paypal" && (
              <Check className="h-5 w-5 text-paypal" />
            )}
          </div>
        </Card>

        {/* M-Pesa Option */}
        <Card 
          className={cn(
            "p-4 cursor-pointer transition-all border-2",
            selectedMode === "mpesa" 
              ? "border-mpesa bg-mpesa/5" 
              : "border-border hover:border-mpesa/50"
          )}
          onClick={() => setSelectedMode("mpesa")}
        >
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              selectedMode === "mpesa" ? "bg-mpesa/20" : "bg-muted"
            )}>
              <MpesaIcon className={cn(
                selectedMode === "mpesa" ? "text-mpesa" : "text-muted-foreground"
              )} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">M-Pesa</h4>
              <p className="text-sm text-muted-foreground">STK Push / Paybill</p>
            </div>
            {selectedMode === "mpesa" && (
              <Check className="h-5 w-5 text-mpesa" />
            )}
          </div>
        </Card>
      </div>

      {/* Payment Details */}
      {selectedMode === "paypal" && (
        <div className="bg-paypal/5 border border-paypal/20 rounded-xl p-6 space-y-4">
          <div className="text-center space-y-2">
            <p className="text-foreground">
              A new window will open for PayPal payment.
            </p>
            <p className="text-sm text-muted-foreground">
              Complete payment in the new window, then return here.
            </p>
          </div>
          <Button 
            size="lg" 
            className="w-full text-lg bg-paypal hover:bg-paypal/90 text-white"
            onClick={handlePaypalClick}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : `Pay with PayPal — $${pricing.usd}`}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}

      {selectedMode === "mpesa" && (
        <div className="bg-mpesa/5 border border-mpesa/20 rounded-xl p-6 space-y-4">
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
                className="h-12 text-base border-mpesa/30 focus:border-mpesa"
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
            className="w-full text-lg bg-mpesa hover:bg-mpesa/90 text-white"
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

      {/* Payment Processing Dialog */}
      <PaymentProcessingDialog
        open={showProcessingDialog}
        onOpenChange={setShowProcessingDialog}
        paymentMethod={activePaymentMethod}
        phoneNumber={mpesaPhone}
        userEmail={userEmail}
      />
    </div>
  );
}
