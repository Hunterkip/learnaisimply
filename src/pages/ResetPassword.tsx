import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react";
import { z } from "zod";
import { Footer } from "@/components/homepage/Footer";

const passwordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);

  useEffect(() => {
    // Check if user came from a valid reset link
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsValidSession(true);
      } else {
        toast({
          title: "Invalid or expired link",
          description: "Please request a new password reset link.",
          variant: "destructive",
        });
        navigate("/forgot-password");
      }
    };
    checkSession();
  }, [navigate, toast]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = passwordSchema.safeParse({ password, confirmPassword });
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      const errorMessage = errors.password?.[0] || errors.confirmPassword?.[0] || "Please check your details";
      toast({
        title: "Please check your details",
        description: errorMessage,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        toast({
          title: "Something went wrong",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setIsSuccess(true);
      toast({
        title: "Password updated!",
        description: "Your password has been successfully reset.",
      });

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/log-in");
      }, 3000);
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

  if (!isValidSession) {
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Main Card */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-8 md:p-10">
          {isSuccess ? (
            /* Success State */
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-accent" />
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
                Password Updated!
              </h1>
              <p className="text-muted-foreground text-base mb-6">
                Your password has been successfully reset. Redirecting you to login...
              </p>
              <Link to="/log-in">
                <Button className="w-full">
                  Go to Login
                </Button>
              </Link>
            </div>
          ) : (
            /* Form State */
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
                  Reset Your Password
                </h1>
                <p className="text-muted-foreground text-base">
                  Enter your new password below.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground text-base">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-12 text-base pr-12"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    At least 8 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground text-base">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-12 text-base pr-12"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Reset Password"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;
