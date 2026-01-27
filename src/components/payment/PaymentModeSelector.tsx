import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Lock, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PayPalIcon, MpesaIcon } from "@/components/icons/PaymentIcons";
import { PaymentProcessingDialog } from "./PaymentProcessingDialog";
import { PayPalPopup } from "./PayPalPopup";

type PaymentMode = "paypal" | "mpesa";

interface PaymentModeSelectorProps {
  plan: 'standard' | 'mastery';
  userEmail: string;
  userName?: string;
}

interface PaymentSetting {
  payment_method: string;
  is_enabled: boolean;
  display_order: number;
}

const PRICING = {
  standard: { usd: 20, kes: 15 },
  mastery: { usd: 40, kes: 5000 },
};

export function PaymentModeSelector({ 
  plan,
  userEmail,
  userName,
}: PaymentModeSelectorProps) {
  const { toast } = useToast();
  const [selectedMode, setSelectedMode] = useState<PaymentMode | null>(null);
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showProcessingDialog, setShowProcessingDialog] = useState(false);
  const [activePaymentMethod, setActivePaymentMethod] = useState<"mpesa" | "paypal">("mpesa");
  const [paymentSettings, setPaymentSettings] = useState<PaymentSetting[]>([]);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  
  // PayPal popup state
  const [showPayPalPopup, setShowPayPalPopup] = useState(false);
  const [paypalApprovalUrl, setPaypalApprovalUrl] = useState("");
  const [paypalOrderId, setPaypalOrderId] = useState("");

  const pricing = PRICING[plan];

  // Fetch payment settings from admin
  useEffect(() => {
    const fetchPaymentSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('payment_settings')
          .select('*')
          .order('display_order', { ascending: true });

        if (error) {
          console.error('Error fetching payment settings:', error);
        } else {
          setPaymentSettings(data || []);
        }
      } catch (err) {
        console.error('Error fetching payment settings:', err);
      } finally {
        setIsLoadingSettings(false);
      }
    };

    fetchPaymentSettings();
  }, []);

  const isPaymentEnabled = (method: string) => {
    const setting = paymentSettings.find(s => s.payment_method === method);
    return setting?.is_enabled ?? true;
  };

  const getEnabledPaymentMethods = () => {
    return paymentSettings
      .filter(s => s.is_enabled)
      .sort((a, b) => a.display_order - b.display_order)
      .map(s => s.payment_method);
  };

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
      // Use Lipana.dev for M-Pesa payments
      const { data, error } = await supabase.functions.invoke('lipana-stk-push', {
        body: {
          phoneNumber: mpesaPhone,
          amount: pricing.kes,
          userEmail: userEmail,
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

  const handlePaypalClick = async () => {
    setIsProcessing(true);
    setActivePaymentMethod("paypal");

    try {
      // Create PayPal order via edge function (secrets hidden)
      const { data, error } = await supabase.functions.invoke('paypal-create-order', {
        body: {
          plan: plan,
          userEmail: userEmail,
        },
      });

      if (error || !data?.success) {
        console.error('PayPal order error:', error || data?.message);
        toast({
          title: "Payment Error",
          description: data?.message || "Failed to initiate PayPal payment. Please try again.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // Store order details and show popup
      setPaypalApprovalUrl(data.approvalUrl);
      setPaypalOrderId(data.orderId);
      setShowPayPalPopup(true);
    } catch (err) {
      console.error('PayPal error:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoadingSettings) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const enabledMethods = getEnabledPaymentMethods();
  const mpesaEnabled = isPaymentEnabled('mpesa');
  const paypalEnabled = isPaymentEnabled('paypal');

  if (enabledMethods.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Payment methods are currently unavailable. Please try again later.
        </p>
      </div>
    );
  }

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
      <div className={cn(
        "grid gap-4",
        enabledMethods.length === 1 ? "grid-cols-1 max-w-sm mx-auto" : "grid-cols-1 sm:grid-cols-2"
      )}>
        {/* PayPal Option - shown based on display order */}
        {paypalEnabled && (
          <Card 
            className={cn(
              "p-4 cursor-pointer transition-all border-2 overflow-hidden",
              selectedMode === "paypal" 
                ? "border-paypal bg-paypal-light" 
                : "border-border hover:border-paypal/50 bg-card"
            )}
            onClick={() => setSelectedMode("paypal")}
            style={{ order: paymentSettings.find(s => s.payment_method === 'paypal')?.display_order || 2 }}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                selectedMode === "paypal" ? "bg-paypal text-white" : "bg-paypal/10"
              )}>
                <PayPalIcon className="h-6 w-6" />
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
        )}

        {/* M-Pesa Option - shown based on display order */}
        {mpesaEnabled && (
          <Card 
            className={cn(
              "p-4 cursor-pointer transition-all border-2 overflow-hidden",
              selectedMode === "mpesa" 
                ? "border-mpesa bg-mpesa-light" 
                : "border-border hover:border-mpesa/50 bg-card"
            )}
            onClick={() => setSelectedMode("mpesa")}
            style={{ order: paymentSettings.find(s => s.payment_method === 'mpesa')?.display_order || 1 }}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                selectedMode === "mpesa" ? "bg-mpesa text-white" : "bg-mpesa/10"
              )}>
                <MpesaIcon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">M-Pesa</h4>
                <p className="text-sm text-muted-foreground">Lipa na M-Pesa</p>
              </div>
              {selectedMode === "mpesa" && (
                <Check className="h-5 w-5 text-mpesa" />
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Payment Details */}
      {selectedMode === "paypal" && paypalEnabled && (
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
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                Pay with PayPal — ${pricing.usd}
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      )}

      {selectedMode === "mpesa" && mpesaEnabled && (
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
                You'll receive an M-Pesa STK Push prompt on your phone
              </p>
            </div>
          </div>
          
          <Button 
            size="lg" 
            className="w-full text-lg bg-mpesa hover:bg-mpesa/90 text-white"
            onClick={handleMpesaSubmit}
            disabled={isProcessing || !mpesaPhone}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                Pay with M-Pesa — KES {pricing.kes.toLocaleString()}
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
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

      {/* Payment Processing Dialog for M-Pesa */}
      <PaymentProcessingDialog
        open={showProcessingDialog}
        onOpenChange={setShowProcessingDialog}
        paymentMethod={activePaymentMethod}
        phoneNumber={mpesaPhone}
        userEmail={userEmail}
        userName={userName}
      />

      {/* PayPal Popup Dialog */}
      <PayPalPopup
        open={showPayPalPopup}
        onOpenChange={setShowPayPalPopup}
        approvalUrl={paypalApprovalUrl}
        orderId={paypalOrderId}
        userEmail={userEmail}
        userName={userName}
      />
    </div>
  );
}
