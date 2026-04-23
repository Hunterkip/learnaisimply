import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mail } from "lucide-react";
import { z } from "zod";
import { Footer } from "@/components/homepage/Footer";

const emailSchema = z.string().email("Please enter a valid email address");

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Cooldown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const sendResetEmail = async () => {
    setIsLoading(true);

    const result = emailSchema.safeParse(email);
    if (!result.success) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Something went wrong",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setIsEmailSent(true);
      setResendCooldown(60); // 60 second cooldown
      toast({
        title: "Check your email",
        description: "We've sent you a password reset link.",
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendResetEmail();
  };

  const handleResendEmail = async () => {
    if (resendCooldown > 0) return;
    await sendResetEmail();
  };

  const handleTryAnotherEmail = () => {
    setIsEmailSent(false);
    setEmail("");
    setResendCooldown(0);
  };

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Back to Login */}
          <Link
            to="/log-in"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>

          {/* Main Card */}
          <div className="bg-card rounded-2xl shadow-sm border border-border p-8 md:p-10">
            {isEmailSent ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="h-8 w-8 text-accent" />
                </div>
                <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">Check Your Email</h1>
                <p className="text-muted-foreground text-base mb-6">
                  We've sent a password reset link to <strong>{email}</strong>. Click the link in the email to reset your password.
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Didn't receive the email? Check your spam folder or resend.
                </p>
                <div className="space-y-3">
                  <Button variant="default" onClick={handleResendEmail} disabled={resendCooldown > 0 || isLoading} className="w-full">
                    {isLoading ? "Sending..." : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Reset Link"}
                  </Button>
                  <Button variant="outline" onClick={handleTryAnotherEmail} className="w-full">
                    Try Another Email
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">Forgot Password?</h1>
                  <p className="text-muted-foreground text-base">
                    No worries! Enter your email and we'll send you a reset link.
                  </p>
                </div>
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground text-base">Email address</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="h-12 text-base" required disabled={isLoading} />
                  </div>
                  <Button type="submit" className="w-full h-14 text-lg font-medium" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>
              </>
            )}
          </div>

          <p className="text-center mt-6 text-muted-foreground">
            Remember your password?{" "}
            <Link to="/log-in" className="text-primary font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
