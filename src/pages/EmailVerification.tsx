import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, CheckCircle } from "lucide-react";

const EmailVerification = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    // Get email from localStorage or search params
    const storedEmail = localStorage.getItem("signupEmail");
    const paramEmail = searchParams.get("email");
    
    if (storedEmail) {
      setEmail(storedEmail);
    } else if (paramEmail) {
      setEmail(decodeURIComponent(paramEmail));
    } else {
      // If no email found, redirect back to signup
      navigate("/sign-up");
    }
  }, [navigate, searchParams]);

  // Handle resend countdown
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!verificationCode.trim()) {
        toast({
          title: "Verification code required",
          description: "Please enter the verification code sent to your email.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Verify the 6-digit OTP code sent to user's email
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: verificationCode,
        type: "signup",
      });

      if (error) {
        toast({
          title: "Verification failed",
          description: error.message || "Invalid or expired verification code. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Email is already verified by Supabase auth system
        setIsVerified(true);
        
        toast({
          title: "Email verified!",
          description: "Your email has been successfully verified. Redirecting to enrollment...",
        });

        // Clear the stored email
        localStorage.removeItem("signupEmail");

        // Redirect to enrollment after a short delay
        setTimeout(() => {
          navigate("/enroll");
        }, 2000);
      }
    } catch (error: any) {
      toast({
        title: "Something went wrong",
        description: error.message || "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) {
        toast({
          title: "Failed to resend",
          description: error.message || "Could not resend verification code. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Code resent",
          description: `A new verification code has been sent to ${email}`,
        });
        setResendCountdown(60);
      }
    } catch (error: any) {
      toast({
        title: "Something went wrong",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-sm border border-border p-8 md:p-10 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
              Email Verified!
            </h1>
            <p className="text-muted-foreground text-base mb-6">
              Your email has been successfully verified. You're all set to start learning!
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting you to the course enrollment page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-sm border border-border p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Mail className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
              Verify Your Email
            </h1>
            <p className="text-muted-foreground text-base">
              We've sent a verification code to<br />
              <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleVerifyCode} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="verificationCode" className="text-foreground text-base">
                Verification Code
              </Label>
              <Input
                id="verificationCode"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="h-12 text-base text-center tracking-widest"
                maxLength={6}
                required
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground">
                Check your email inbox (and spam folder) for the verification code.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-14 text-lg font-medium"
              disabled={isLoading || !verificationCode}
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </Button>
          </form>

          {/* Resend Section */}
          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Didn't receive the code?
            </p>
            <Button
              type="button"
              variant="outline"
              className="w-full h-12"
              onClick={handleResendCode}
              disabled={isResending || resendCountdown > 0}
            >
              {resendCountdown > 0
                ? `Resend in ${resendCountdown}s`
                : isResending
                ? "Sending..."
                : "Resend Code"}
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-secondary rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              The verification code expires in 24 hours. If you experience any issues, please try requesting a new code.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
