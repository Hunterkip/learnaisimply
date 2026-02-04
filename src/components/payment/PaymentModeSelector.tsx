import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PaystackPaymentButton } from "./PaystackPaymentButton";
import { PromoCodeInput } from "./PromoCodeInput";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
        console.error("Error fetching settings:", err);
      } finally {
        setIsLoadingSettings(false);
      }
    };
    fetchPaymentSettings();
  }, []);

  // HANDLE 100% DISCOUNT ENROLLMENT
  const handleFreeEnrollment = async () => {
    if (!appliedPromo) return;

    setIsProcessing(true);
    try {
      // 1. Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error("Please log in to continue.");
        navigate("/log-in");
        return;
      }

      // 2. Mark the promo code as 'used' so it expires immediately
      const { error: promoError } = await supabase
        .from("promo_codes")
        .update({ status: "used", used_at: new Date().toISOString() })
        .eq("code", appliedPromo.code)
        .eq("email", userEmail);

      if (promoError) throw promoError;

      // 3. Grant course access by updating has_access in profiles
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ has_access: true, plan: "standard" })
        .eq("id", session.user.id);

      if (profileError) throw profileError;

      toast.success("🎉 100% Discount Applied! Welcome to the course!");

      // 4. Redirect to dashboard
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Enrollment failed:", error);
      toast.error("Failed to complete enrollment. Please try again.");
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

  // Check if 100% discount applied
  const isFreeEnrollment = appliedPromo && appliedPromo.discountPercentage === 100;

  return (
    <div className="w-full space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">Complete Your Enrollment</h3>
        <p className="text-muted-foreground text-sm md:text-base">Full Course Access • Lifetime Learning</p>
      </div>

      <PromoCodeInput userEmail={userEmail} onPromoApplied={setAppliedPromo} />

      {/* 100% Discount - Show Congratulations Message */}
      {isFreeEnrollment ? (
        <div className="space-y-4">
          <div className="bg-success/10 border-2 border-success/30 rounded-xl p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center">
              <span className="text-3xl">🎉</span>
            </div>
            <h4 className="text-xl font-bold text-success mb-2">
              Congratulations!
            </h4>
            <p className="text-success/80 mb-1">
              Your 100% discount has been applied!
            </p>
            <p className="text-sm text-muted-foreground">
              You have full access to the course — no payment required.
            </p>
          </div>
          <button
            onClick={handleFreeEnrollment}
            disabled={isProcessing}
            className="w-full bg-success hover:bg-success/90 text-success-foreground py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? <Loader2 className="animate-spin h-5 w-5" /> : "🚀 Proceed to Dashboard"}
          </button>
        </div>
      ) : appliedPromo ? (
        /* Partial Discount - Show remaining amount message */
        <div className="space-y-4">
          <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 text-center">
            <p className="text-accent font-medium">
              🎁 {appliedPromo.discountPercentage}% discount applied!
            </p>
            <p className="text-sm text-accent/80 mt-1">
              Pay only <span className="font-bold">KES {pricing.kes.toLocaleString()}</span> (was KES {appliedPromo.originalAmount.toLocaleString()})
            </p>
          </div>
          <PaystackPaymentButton
            plan={plan}
            userEmail={userEmail}
            userName={userName}
            pricing={pricing}
            promoCode={appliedPromo.code}
            discountPercentage={appliedPromo.discountPercentage}
            originalAmount={appliedPromo.originalAmount}
          />
        </div>
      ) : (
        /* No Discount - Standard payment */
        <PaystackPaymentButton
          plan={plan}
          userEmail={userEmail}
          userName={userName}
          pricing={pricing}
          promoCode={undefined}
        />
      )}
    </div>
  );
}
