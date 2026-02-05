import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, AlertCircle, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { UnlockAnimation } from "./UnlockAnimation";

interface PaystackVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reference?: string;
  userEmail: string;
  userName?: string;
}

type PaymentStatus = "verifying" | "waiting" | "success" | "failed" | "manual";

export function PaystackVerificationDialog({
  open,
  onOpenChange,
  reference,
  userEmail,
  userName,
}: PaystackVerificationDialogProps) {
  const [status, setStatus] = useState<PaymentStatus>("verifying");
  const [paystackCode, setPaystackCode] = useState("");
  const [verifyPhone, setVerifyPhone] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);

  // Auto-verify with Paystack on open
  useEffect(() => {
    if (!open || !reference || status !== "verifying") return;

    const verifyPaystackPayment = async () => {
      try {
        // Get auth session for authenticated request
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          console.error("No auth session for verification");
          setStatus("waiting");
          return;
        }

        const { data, error } = await supabase.functions.invoke("paystack-verify", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          body: {
            reference,
          },
        });

        if (error || !data?.success) {
          console.log("Paystack verification pending, waiting for webhook or manual entry");
          setStatus("waiting");
          return;
        }

        console.log("Paystack payment verified successfully");
        setStatus("success");
      } catch (err) {
        console.error("Paystack verification error:", err);
        setStatus("waiting");
      }
    };

    verifyPaystackPayment();
  }, [open, reference, status]);

  // Poll for payment confirmation from webhook
  useEffect(() => {
    if (!open || status !== "waiting") return;

    const interval = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("has_access")
          .eq("id", session.user.id)
          .single();

        if (profile?.has_access) {
          setStatus("success");
          clearInterval(interval);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [open, status]);

  // Show unlock animation when payment succeeds
  useEffect(() => {
    if (status === "success") {
      setShowUnlockAnimation(true);
    }
  }, [status]);

  const handleManualVerification = async () => {
    if (!paystackCode.trim() || !verifyPhone.trim()) {
      setError("Please enter both the Paystack reference code and phone number");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      // First check if this Paystack code has already been used (prevent duplicate payments)
      const { data: existingTransaction } = await supabase
        .from("payment_transactions")
        .select("*")
        .eq("checkout_request_id", paystackCode.toUpperCase().trim())
        .single();

      // If code exists and is NOT from this user's email, it's been used already
      if (existingTransaction && existingTransaction.account_reference !== userEmail) {
        setError("Expired payment - This Paystack reference has already been used. If this is your payment, please contact support.");
        setIsVerifying(false);
        return;
      }

      // If code exists and is from this user but already completed, it's expired
      if (existingTransaction && existingTransaction.status === "completed" && existingTransaction.account_reference === userEmail) {
        setError("This payment has already been processed. Your course access is active.");
        setIsVerifying(false);
        return;
      }

      // Check payment_transactions for matching transaction
      const { data: transaction, error: txError } = await supabase
        .from("payment_transactions")
        .select("*")
        .eq("checkout_request_id", paystackCode.toUpperCase().trim())
        .eq("status", "completed")
        .eq("payment_method", "paystack")
        .single();

      if (txError || !transaction) {
        setError("Could not find a completed Paystack payment with this reference. Please check and try again.");
        setIsVerifying(false);
        return;
      }

      // Verify phone number matches (if stored in metadata)
      const transactionPhone = transaction.phone_number;
      if (transactionPhone && transactionPhone !== verifyPhone.trim()) {
        setError("The phone number does not match the payment record. Please verify and try again.");
        setIsVerifying(false);
        return;
      }

      // Update user's profile to grant access
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from("profiles")
          .update({ has_access: true, plan: "standard" })
          .eq("id", session.user.id);

        setStatus("success");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError("An error occurred. Please try again or contact support.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleShowManual = () => {
    setStatus("manual");
  };

  const handleUnlockAnimationClose = (isOpen: boolean) => {
    setShowUnlockAnimation(isOpen);
    if (!isOpen) {
      onOpenChange(false);
    }
  };

  // If showing unlock animation, render that instead
  if (showUnlockAnimation) {
    return (
      <UnlockAnimation 
        open={showUnlockAnimation}
        onOpenChange={handleUnlockAnimationClose}
        userName={userName}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {status === "verifying" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-paystack" />
                Verifying Payment
              </DialogTitle>
              <DialogDescription>
                Verifying your Paystack payment...
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center py-8">
              <div className="w-16 h-16 rounded-full bg-paystack/10 flex items-center justify-center mb-4">
                <Loader2 className="h-8 w-8 animate-spin text-paystack" />
              </div>
              <p className="text-muted-foreground text-center">
                Please wait while we confirm your payment...
              </p>
            </div>
          </>
        )}

        {status === "waiting" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-paystack" />
                Payment Confirmation
              </DialogTitle>
              <DialogDescription>
                Confirming your Paystack payment
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div className="bg-paystack/10 rounded-lg p-4 text-center">
                <p className="text-foreground font-medium mb-2">
                  Waiting for payment confirmation
                </p>
                <p className="text-sm text-muted-foreground">
                  This usually takes a few seconds...
                </p>
              </div>
              
              <div className="flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-paystack mr-2" />
                <span className="text-sm text-muted-foreground">Confirming...</span>
              </div>

              <div className="border-t pt-4 mt-4">
                <p className="text-sm text-muted-foreground text-center mb-3">
                  Already paid but confirmation is delayed?
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleShowManual}
                >
                  Enter Reference Code Manually
                </Button>
              </div>
            </div>
          </>
        )}

        {status === "manual" && (
          <>
            <DialogHeader>
              <DialogTitle>Manual Payment Verification</DialogTitle>
              <DialogDescription>
                Enter your Paystack transaction details
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paystack-code">Paystack Reference Code</Label>
                <Input
                  id="paystack-code"
                  placeholder="e.g., AISIMPLY-STANDARD-1234567890"
                  value={paystackCode}
                  onChange={(e) => setPaystackCode(e.target.value.toUpperCase())}
                  className="uppercase"
                />
                <p className="text-xs text-muted-foreground">
                  Find this in your Paystack confirmation email or receipt
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="verify-phone">Phone Number Used</Label>
                <Input
                  id="verify-phone"
                  type="tel"
                  placeholder="0712345678"
                  value={verifyPhone}
                  onChange={(e) => setVerifyPhone(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  The phone number used for the payment (if applicable)
                </p>
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button 
                className="w-full bg-paystack hover:bg-paystack/90"
                onClick={handleManualVerification}
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  "Verify Payment"
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                If your payment isn't found, please{" "}
                <a href="/payment-help" className="text-primary underline">contact support</a>
              </p>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-success">
                <CheckCircle className="h-5 w-5" />
                Payment Confirmed
              </DialogTitle>
              <DialogDescription>
                Your payment has been verified successfully
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 text-center">
              <p className="text-muted-foreground mb-4">
                Your course access is being activated...
              </p>
              <Loader2 className="h-6 w-6 animate-spin text-paystack mx-auto" />
            </div>
          </>
        )}

        {status === "failed" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                Verification Failed
              </DialogTitle>
              <DialogDescription>
                We couldn't verify your payment
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 text-center">
              <p className="text-muted-foreground mb-4">
                {error || "Please try again or contact support for assistance."}
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
