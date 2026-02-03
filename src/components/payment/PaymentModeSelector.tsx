import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PaystackPaymentButton } from "./PaystackPaymentButton";
import { PromoCodeInput } from "./PromoCodeInput";
import { useNavigate } from "react-router-dom"; // Assuming you use react-router

interface PaymentModeSelectorProps {
  plan?: "standard";
  userEmail: string;
  userName?: string;
}

const DEFAULT_PRICING = {
  standard: { usd: 19.38, kes: 2500 },
};

export function PaymentModeSelector({ plan = "standard", userEmail, userName }: PaymentModeSelectorProps) {
  const navigate = useNavigate();
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [paystackEnabled, setPaystackEnabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountPercentage: number;
    originalAmount: number;
    discountedAmount: number;
    thankYouMessage: string | null;
  } | null>(null);

  // Math logic for pricing
  const pricing = appliedPromo
    ? {
        usd: Math.round(appliedPromo.discountedAmount / 128.99),
        kes: appliedPromo.discountedAmount,
      }
    : DEFAULT_PRICING[plan];

  useEffect(() => {
    const fetchPaymentSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("payment_settings")
          .select("*")
          .eq("payment_method", "paystack")
          .single();

        if (!error) setPaystackEnabled(data?.is_enabled ?? true);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setIsLoadingSettings(false);
      }
    };
    fetchPaymentSettings();
  }, []);

  // AUTOMATIC REDIRECT FOR 100% DISCOUNT
  const handleFreeEnrollment = async () => {
    setIsProcessing(true);
    try {
      // Add your logic here to grant course access in Supabase
      // e.g., await supabase.from('enrollments').insert({ email: userEmail, plan: 'standard' })

      // Redirect to success page or course dashboard
      navigate("/dashboard?status=success");
    } catch (error) {
      console.error("Enrollment failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoadingSettings) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">Complete Your Enrollment</h3>
        <p className="text-muted-foreground text-sm md:text-base">Full Course Access • Lifetime Learning</p>
      </div>

      <PromoCodeInput userEmail={userEmail} onPromoApplied={setAppliedPromo} />

      {/* Logic Switch: If Price is 0, show "Claim Access", otherwise show Paystack */}
      {pricing.kes === 0 ? (
        <button
          onClick={handleFreeEnrollment}
          disabled={isProcessing}
          className="w-full bg-primary text-white py-4 rounded-lg font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          {isProcessing ? <Loader2 className="animate-spin" /> : "Claim Full Access Now →"}
        </button>
      ) : (
        <PaystackPaymentButton
          plan={plan}
          userEmail={userEmail}
          userName={userName}
          pricing={pricing}
          promoCode={appliedPromo?.code}
        />
      )}
    </div>
  );
}
