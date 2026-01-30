import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PaystackPaymentButton } from "./PaystackPaymentButton";

interface PaymentModeSelectorProps {
  plan?: "standard";
  userEmail: string;
  userName?: string;
}

const PRICING = {
  standard: { usd: 20, kes: 2500 },
};

export function PaymentModeSelector({ plan = "standard", userEmail, userName }: PaymentModeSelectorProps) {
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [paystackEnabled, setPaystackEnabled] = useState(true);

  const pricing = PRICING[plan];

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
    <div className="w-full">
      <div className="text-center mb-6">
        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">Complete Your Enrollment</h3>
        <p className="text-muted-foreground text-sm md:text-base">Full Course Access • Lifetime Learning</p>
      </div>

      <PaystackPaymentButton 
        plan={plan}
        userEmail={userEmail}
        userName={userName}
        pricing={pricing}
      />
    </div>
  );
}
