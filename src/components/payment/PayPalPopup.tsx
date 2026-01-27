import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { UnlockAnimation } from "./UnlockAnimation";
import { PayPalIcon } from "@/components/icons/PaymentIcons";

interface PayPalPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  approvalUrl: string;
  orderId: string;
  userEmail: string;
  userName?: string;
}

type PaymentStatus = "waiting" | "capturing" | "success" | "failed";

export function PayPalPopup({
  open,
  onOpenChange,
  approvalUrl,
  orderId,
  userEmail,
  userName,
}: PayPalPopupProps) {
  const [status, setStatus] = useState<PaymentStatus>("waiting");
  const [error, setError] = useState("");
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);
  const popupRef = useRef<Window | null>(null);
  const pollIntervalRef = useRef<number | null>(null);

  // Open popup window
  const openPayPalWindow = useCallback(() => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    popupRef.current = window.open(
      approvalUrl,
      'PayPal Payment',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );
  }, [approvalUrl]);

  // Capture the payment after user approves
  const capturePayment = useCallback(async () => {
    setStatus("capturing");
    setError("");

    try {
      const { data, error: captureError } = await supabase.functions.invoke('paypal-capture-order', {
        body: {
          orderId: orderId,
          userEmail: userEmail,
        },
      });

      if (captureError || !data?.success) {
        console.error('PayPal capture error:', captureError || data?.message);
        setError(data?.message || "Failed to complete payment. Please contact support.");
        setStatus("failed");
        return;
      }

      console.log('PayPal payment captured:', data);
      setStatus("success");
    } catch (err) {
      console.error('PayPal capture error:', err);
      setError("An unexpected error occurred. Please contact support.");
      setStatus("failed");
    }
  }, [orderId, userEmail]);

  // Poll for popup closure and URL changes
  useEffect(() => {
    if (!open || !popupRef.current) return;

    pollIntervalRef.current = window.setInterval(() => {
      try {
        // Check if popup is closed
        if (popupRef.current?.closed) {
          clearInterval(pollIntervalRef.current!);
          
          // If still waiting, user might have completed or cancelled
          if (status === "waiting") {
            // Try to capture - if it fails, payment wasn't completed
            capturePayment();
          }
          return;
        }

        // Try to check the popup URL (will throw cross-origin error on PayPal pages)
        const popupUrl = popupRef.current?.location?.href;
        
        if (popupUrl && (popupUrl.includes('payment=success') || popupUrl.includes('token='))) {
          // User approved, close popup and capture
          popupRef.current?.close();
          clearInterval(pollIntervalRef.current!);
          capturePayment();
        } else if (popupUrl && popupUrl.includes('payment=cancelled')) {
          // User cancelled
          popupRef.current?.close();
          clearInterval(pollIntervalRef.current!);
          setError("Payment was cancelled.");
          setStatus("failed");
        }
      } catch (e) {
        // Cross-origin error - popup is on PayPal domain, continue polling
      }
    }, 500);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [open, status, capturePayment]);

  // Open popup when dialog opens
  useEffect(() => {
    if (open && approvalUrl) {
      openPayPalWindow();
    }
  }, [open, approvalUrl, openPayPalWindow]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
    };
  }, []);

  // Show unlock animation when payment succeeds
  useEffect(() => {
    if (status === "success") {
      setShowUnlockAnimation(true);
    }
  }, [status]);

  const handleUnlockAnimationClose = (isOpen: boolean) => {
    setShowUnlockAnimation(isOpen);
    if (!isOpen) {
      onOpenChange(false);
    }
  };

  const handleRetryPayment = () => {
    setStatus("waiting");
    setError("");
    openPayPalWindow();
  };

  const handleOpenPopup = () => {
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.focus();
    } else {
      openPayPalWindow();
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
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen && popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-md">
        {status === "waiting" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <PayPalIcon className="h-5 w-5 text-paypal" />
                Complete PayPal Payment
              </DialogTitle>
              <DialogDescription>
                A new window has opened for PayPal payment
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div className="bg-paypal/10 rounded-lg p-4 text-center">
                <p className="text-foreground font-medium mb-2">
                  Complete your payment in the popup window
                </p>
                <p className="text-sm text-muted-foreground">
                  Once you complete the payment, this page will update automatically.
                </p>
              </div>
              
              <div className="flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-paypal mr-2" />
                <span className="text-sm text-muted-foreground">Waiting for payment completion...</span>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleOpenPopup}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open PayPal Window
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Popup blocked?{" "}
                <button 
                  onClick={handleOpenPopup}
                  className="text-primary underline"
                >
                  Click here to open PayPal
                </button>
              </p>
            </div>
          </>
        )}

        {status === "capturing" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-paypal" />
                Processing Payment
              </DialogTitle>
              <DialogDescription>
                Completing your PayPal payment...
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center py-8">
              <div className="w-16 h-16 rounded-full bg-paypal/10 flex items-center justify-center mb-4">
                <Loader2 className="h-8 w-8 animate-spin text-paypal" />
              </div>
              <p className="text-muted-foreground text-center">
                Please wait while we confirm your payment...
              </p>
            </div>
          </>
        )}

        {status === "failed" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                Payment Issue
              </DialogTitle>
              <DialogDescription>
                {error || "We couldn't complete your payment"}
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg text-center">
                {error || "The payment could not be completed. Please try again."}
              </div>
              
              <Button 
                className="w-full bg-paypal hover:bg-paypal/90"
                onClick={handleRetryPayment}
              >
                Try Again
              </Button>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                If you completed payment but see this error,{" "}
                <a href="/payment-help" className="text-primary underline">contact support</a>
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
