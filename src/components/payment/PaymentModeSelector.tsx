import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PaystackPaymentButton } from "./PaystackPaymentButton";
import { PromoCodeInput } from "./PromoCodeInput";

interface PaymentModeSelectorProps {
  plan?: "standard";
  userEmail: string;
  userName?: string;
}

const DEFAULT_PRICING = {
  standard: { usd: 19.38, kes: 2500 },
};

export function PaymentModeSelector({ plan = "standard", userEmail, userName }: PaymentModeSelectorProps) {
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [paystackEnabled, setPaystackEnabled] = useState(true);
  const [hasEligiblePromo, setHasEligiblePromo] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountPercentage: number;
    originalAmount: number;
    discountedAmount: number;
    thankYouMessage: string | null;
  } | null>(null);

  // Get effective pricing (with or without promo)
  const pricing = appliedPromo
    ? { usd: Math.round(appliedPromo.discountedAmount / 128.99), kes: appliedPromo.discountedAmount }
    : DEFAULT_PRICING[plan];

  // Check if user has an eligible promo code
  useEffect(() => {
    const checkPromoEligibility = async () => {
      if (!userEmail) return;

      try {
        const { data, error } = await supabase
          .from("promo_codes")
          .select("id")
          .eq("email", userEmail.toLowerCase())
          .eq("status", "pending")
          .gt("expires_at", new Date().toISOString())
          .limit(1);

        if (!error && data && data.length > 0) {
          setHasEligiblePromo(true);
        }
      } catch (err) {
        console.error("Error checking promo eligibility:", err);
      }
    };

    checkPromoEligibility();
  }, [userEmail]);

  // Fetch payment settings from admin
  useEffect(() => {
    const fetchPaymentSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("payment_settings")
          .select("*")
          .eq("payment_method", "paystack")
          .single();

        if (error) {
          console.error("Error fetching payment settings:", error);
        } else {
          setPaystackEnabled(data?.is_enabled ?? true);
        }
      } catch (err) {
        console.error("Error fetching payment settings:", err);
      } finally {
        setIsLoadingSettings(false);
      }
    };

    fetchPaymentSettings();
  }, []);

  const handlePromoApplied = (promoData: typeof appliedPromo) => {
    setAppliedPromo(promoData);
  };

  if (isLoadingSettings) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!paystackEnabled) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Payment is currently unavailable. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">Complete Your Enrollment</h3>
        <p className="text-muted-foreground text-sm md:text-base">Full Course Access • Lifetime Learning</p>
      </div>

      {/* Promo Code Input - only show if user has eligible promo OR they've already applied one */}
      {(hasEligiblePromo || appliedPromo) && (
        <PromoCodeInput userEmail={userEmail} onPromoApplied={handlePromoApplied} />
      )}

      <PaystackPaymentButton
        plan={plan}
        userEmail={userEmail}
        userName={userName}
        pricing={pricing}
        promoCode={appliedPromo?.code}
      />
    </div>
  );
}
