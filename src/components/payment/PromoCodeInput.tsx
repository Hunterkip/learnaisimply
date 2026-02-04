import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Ticket, Check, Loader2, X, Gift } from "lucide-react";

interface PromoCodeInputProps {
  userEmail: string;
  onPromoApplied: (promoData: {
    code: string;
    discountPercentage: number;
    originalAmount: number;
    discountedAmount: number;
    thankYouMessage: string | null;
  } | null) => void;
}

export function PromoCodeInput({ userEmail, onPromoApplied }: PromoCodeInputProps) {
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountPercentage: number;
    originalAmount: number;
    discountedAmount: number;
    thankYouMessage: string | null;
  } | null>(null);

  const validatePromoCode = async () => {
    if (!promoCode.trim()) {
      toast({
        title: "Enter a code",
        description: "Please enter your promo code",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);

    try {
      // Check if the promo code exists and is valid for this email
      const { data: promo, error } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", promoCode.trim().toUpperCase())
        .eq("email", userEmail.toLowerCase())
        .single();

      if (error || !promo) {
        toast({
          title: "Invalid Code",
          description: "This promo code is not valid for your email address",
          variant: "destructive",
        });
        setIsValidating(false);
        return;
      }

      // Check if already used
      if (promo.status === "used") {
        toast({
          title: "Code Already Used",
          description: "This promo code has already been redeemed",
          variant: "destructive",
        });
        setIsValidating(false);
        return;
      }

      // Check if expired
      if (new Date(promo.expires_at) < new Date()) {
        toast({
          title: "Code Expired",
          description: "This promo code has expired",
          variant: "destructive",
        });
        setIsValidating(false);
        return;
      }

      // Valid promo code!
      const promoData = {
        code: promo.code,
        discountPercentage: promo.discount_percentage,
        originalAmount: promo.original_amount,
        discountedAmount: promo.discounted_amount,
        thankYouMessage: promo.thank_you_message,
      };

      setAppliedPromo(promoData);
      onPromoApplied(promoData);

      // Show appropriate message based on discount percentage
      if (promo.discount_percentage === 100) {
        toast({
          title: "🎉 100% Discount Applied!",
          description: "Congratulations! You have full free access. Click proceed to continue.",
        });
      } else {
        toast({
          title: "Promo Code Applied! 🎉",
          description: `You get ${promo.discount_percentage}% off! Pay only KES ${promo.discounted_amount.toLocaleString()}`,
        });
      }
    } catch (error) {
      console.error("Error validating promo code:", error);
      toast({
        title: "Error",
        description: "Failed to validate promo code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    onPromoApplied(null);
  };

  if (appliedPromo) {
    return (
      <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
              <Gift className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-green-700 dark:text-green-300">
                  {appliedPromo.discountPercentage}% Discount Applied!
                </span>
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                Code: <span className="font-mono font-medium">{appliedPromo.code}</span>
              </p>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <span className="line-through text-muted-foreground">
                  KES {appliedPromo.originalAmount.toLocaleString()}
                </span>
                <span className="font-bold text-green-700 dark:text-green-300">
                  KES {appliedPromo.discountedAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={removePromo}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/50 border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Ticket className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Have a promo code?</span>
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Enter promo code"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
          className="font-mono uppercase"
          onKeyDown={(e) => e.key === "Enter" && validatePromoCode()}
        />
        <Button
          onClick={validatePromoCode}
          disabled={isValidating}
          variant="outline"
        >
          {isValidating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Apply"
          )}
        </Button>
      </div>
    </div>
  );
}
