import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ManualPaymentVerificationProps {
  userEmail: string;
  onPaymentVerified?: () => void;
}

type VerificationType = "mpesa" | "paystack";

export function ManualPaymentVerification({ userEmail, onPaymentVerified }: ManualPaymentVerificationProps) {
  const { toast } = useToast();
  const [verificationType, setVerificationType] = useState<VerificationType | null>(null);
  const [paymentCode, setPaymentCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleVerifyPayment = async () => {
    if (!paymentCode.trim()) {
      setError(`Please enter the ${verificationType === "mpesa" ? "M-Pesa" : "Paystack"} payment code`);
      return;
    }

    if (verificationType === "mpesa" && !phoneNumber.trim()) {
      setError("Please enter the phone number that made the payment");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      // Find the payment transaction
      let transaction;
      
      if (verificationType === "mpesa") {
        // For M-Pesa, search by receipt number or checkout request ID
        const { data: txData } = await supabase
          .from("payment_transactions")
          .select("*")
          .or(`mpesa_receipt_number.eq.${paymentCode.toUpperCase().trim()},checkout_request_id.eq.${paymentCode.toUpperCase().trim()}`)
          .eq("payment_method", "mpesa")
          .eq("status", "completed")
          .single();
        
        transaction = txData;
      } else {
        // For Paystack, search by checkout request ID
        const { data: txData } = await supabase
          .from("payment_transactions")
          .select("*")
          .eq("checkout_request_id", paymentCode.toUpperCase().trim())
          .eq("payment_method", "paystack")
          .eq("status", "completed")
          .single();
        
        transaction = txData;
      }

      if (!transaction) {
        setError(`Could not find a completed ${verificationType === "mpesa" ? "M-Pesa" : "Paystack"} payment with this code. Please verify the code is correct.`);
        setIsVerifying(false);
        return;
      }

      // Check if this payment is already being used by another user
      if (transaction.account_reference !== userEmail) {
        setError("This payment code has already been used by another account. This is an expired payment.");
        setIsVerifying(false);
        return;
      }

      // For M-Pesa, verify phone number matches if stored
      if (verificationType === "mpesa" && transaction.phone_number && transaction.phone_number !== phoneNumber.trim()) {
        setError("The phone number does not match the payment record. Please check and try again.");
        setIsVerifying(false);
        return;
      }

      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("Your session has expired. Please log in again.");
        setIsVerifying(false);
        return;
      }

      // Update user's profile to grant access
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ has_access: true, plan: "standard" })
        .eq("id", session.user.id);

      if (updateError) {
        setError("Failed to activate your access. Please contact support.");
        setIsVerifying(false);
        return;
      }

      setSuccess(true);
      toast({
        title: "Success!",
        description: "Your payment has been verified and your course access is now active!",
      });

      // Call callback if provided
      if (onPaymentVerified) {
        onPaymentVerified();
      }

      // Reset form
      setTimeout(() => {
        setPaymentCode("");
        setPhoneNumber("");
        setVerificationType(null);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Verification error:", err);
      setError("An error occurred during verification. Please try again or contact support.");
    } finally {
      setIsVerifying(false);
    }
  };

  if (!verificationType) {
    return (
      <Card className="p-6 bg-card border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Already Paid?</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          If you've completed a payment but your course access hasn't activated, you can manually verify it here.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => setVerificationType("mpesa")}
            className="border-mpesa text-mpesa hover:bg-mpesa/10"
          >
            Verify M-Pesa Payment
          </Button>
          <Button
            variant="outline"
            onClick={() => setVerificationType("paystack")}
            className="border-paystack text-paystack hover:bg-paystack/10"
          >
            Verify Paystack Payment
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card border border-border">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setVerificationType(null);
            setError("");
            setSuccess(false);
          }}
          className="text-muted-foreground"
        >
          ← Back
        </Button>
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-4">
        Verify {verificationType === "mpesa" ? "M-Pesa" : "Paystack"} Payment
      </h3>

      {success ? (
        <div className="space-y-4">
          <div className="bg-success/10 text-success rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium">Payment verified successfully! Your course access is now active.</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {verificationType === "mpesa" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="mpesa-code">M-Pesa Confirmation Code</Label>
                <Input
                  id="mpesa-code"
                  placeholder="e.g., SJK1234ABC"
                  value={paymentCode}
                  onChange={(e) => setPaymentCode(e.target.value.toUpperCase())}
                  className="uppercase"
                  disabled={isVerifying}
                />
                <p className="text-xs text-muted-foreground">
                  Find this in your M-Pesa confirmation SMS
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mpesa-phone">Phone Number Used for Payment</Label>
                <Input
                  id="mpesa-phone"
                  type="tel"
                  placeholder="0712345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isVerifying}
                />
                <p className="text-xs text-muted-foreground">
                  The exact phone number you used to make the payment
                </p>
              </div>
            </>
          )}

          {verificationType === "paystack" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="paystack-code">Paystack Reference Code</Label>
                <Input
                  id="paystack-code"
                  placeholder="e.g., AISIMPLY-STANDARD-1234567890"
                  value={paymentCode}
                  onChange={(e) => setPaymentCode(e.target.value.toUpperCase())}
                  className="uppercase"
                  disabled={isVerifying}
                />
                <p className="text-xs text-muted-foreground">
                  Find this in your Paystack confirmation email or receipt
                </p>
              </div>
            </>
          )}

          {error && (
            <div className="bg-destructive/10 text-destructive rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <Button
            onClick={handleVerifyPayment}
            disabled={isVerifying || !paymentCode.trim() || (verificationType === "mpesa" && !phoneNumber.trim())}
            className={`w-full ${verificationType === "mpesa" ? "bg-mpesa hover:bg-mpesa/90" : "bg-paystack hover:bg-paystack/90"}`}
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
            Need help? <a href="/payment-help" className="text-primary underline">Contact support</a>
          </p>
        </div>
      )}
    </Card>
  );
}
