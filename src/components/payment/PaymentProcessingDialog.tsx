import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, AlertCircle, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { UnlockAnimation } from "./UnlockAnimation";

interface PaymentProcessingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentMethod: "mpesa" | "paypal";
  phoneNumber?: string;
  userEmail: string;
  userName?: string;
}

type PaymentStatus = "processing" | "waiting" | "success" | "failed" | "manual";

export function PaymentProcessingDialog({
  open,
  onOpenChange,
  paymentMethod,
  phoneNumber,
  userEmail,
  userName,
}: PaymentProcessingDialogProps) {
  const [status, setStatus] = useState<PaymentStatus>("processing");
  const [mpesaCode, setMpesaCode] = useState("");
  const [verifyPhone, setVerifyPhone] = useState(phoneNumber || "");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);

  // Poll for payment confirmation
  useEffect(() => {
    if (!open || paymentMethod !== "mpesa" || status !== "waiting") return;

    const interval = setInterval(async () => {
      // Check if user now has access
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
    }, 5000);

    return () => clearInterval(interval);
  }, [open, paymentMethod, status]);

  // Auto-transition from processing to waiting for M-Pesa
  useEffect(() => {
    if (open && paymentMethod === "mpesa" && status === "processing") {
      const timer = setTimeout(() => setStatus("waiting"), 3000);
      return () => clearTimeout(timer);
    }
  }, [open, paymentMethod, status]);

  // Show unlock animation when payment succeeds
  useEffect(() => {
    if (status === "success") {
      setShowUnlockAnimation(true);
    }
  }, [status]);

  const handleManualVerification = async () => {
    if (!mpesaCode.trim() || !verifyPhone.trim()) {
      setError("Please enter both the M-Pesa code and phone number");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      // First check if this M-Pesa code has already been used (prevent duplicate payments)
      const { data: existingTransaction } = await supabase
        .from("payment_transactions")
        .select("*")
        .or(`mpesa_receipt_number.eq.${mpesaCode.toUpperCase().trim()},checkout_request_id.eq.${mpesaCode.toUpperCase().trim()}`)
        .single();

      // If code exists and is NOT from this user's email, it's been used already
      if (existingTransaction && existingTransaction.account_reference !== userEmail) {
        setError("This M-Pesa code has already been used. If this is your payment, please contact support.");
        setIsVerifying(false);
        return;
      }

      // If code exists and is from this user but already completed, it's expired
      if (existingTransaction && existingTransaction.status === "completed" && existingTransaction.account_reference === userEmail) {
        setError("This payment has already been processed. Your course access is active.");
        setIsVerifying(false);
        return;
      }

      // Check payment_transactions for matching completed transaction
      const { data: transaction, error: txError } = await supabase
        .from("payment_transactions")
        .select("*")
        .or(`mpesa_receipt_number.eq.${mpesaCode.toUpperCase().trim()},checkout_request_id.eq.${mpesaCode.toUpperCase().trim()}`)
        .eq("status", "completed")
        .single();

      if (txError || !transaction) {
        setError("Could not find a completed payment with this code. Please check and try again, or contact support.");
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
        {status === "processing" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-mpesa" />
                Processing Payment
              </DialogTitle>
              <DialogDescription>
                {paymentMethod === "mpesa" 
                  ? "Sending payment request to your phone..."
                  : "Connecting to PayPal..."
                }
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center py-8">
              <div className="w-16 h-16 rounded-full bg-mpesa/10 flex items-center justify-center mb-4">
                <Loader2 className="h-8 w-8 animate-spin text-mpesa" />
              </div>
              <p className="text-muted-foreground text-center">
                Please wait while we process your request...
              </p>
            </div>
          </>
        )}

        {status === "waiting" && paymentMethod === "mpesa" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-mpesa" />
                Check Your Phone
              </DialogTitle>
              <DialogDescription>
                An M-Pesa payment request has been sent to {phoneNumber}
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div className="bg-mpesa/10 rounded-lg p-4 text-center">
                <p className="text-foreground font-medium mb-2">
                  Enter your M-Pesa PIN when prompted
                </p>
                <p className="text-sm text-muted-foreground">
                  We're waiting for confirmation from Safaricom...
                </p>
              </div>
              
              <div className="flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-mpesa mr-2" />
                <span className="text-sm text-muted-foreground">Waiting for confirmation...</span>
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
                  Enter M-Pesa Code Manually
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
                Enter the M-Pesa confirmation code from your SMS
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mpesa-code">M-Pesa Confirmation Code</Label>
                <Input
                  id="mpesa-code"
                  placeholder="e.g., SJK1234ABC"
                  value={mpesaCode}
                  onChange={(e) => setMpesaCode(e.target.value.toUpperCase())}
                  className="uppercase"
                />
                <p className="text-xs text-muted-foreground">
                  Find this in your M-Pesa confirmation SMS
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
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
                  {error}
                </div>
              )}

              <Button 
                className="w-full bg-mpesa hover:bg-mpesa/90"
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

        {status === "failed" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                Payment Failed
              </DialogTitle>
              <DialogDescription>
                We couldn't process your payment
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 text-center">
              <p className="text-muted-foreground mb-4">
                Please try again or contact support for assistance.
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
