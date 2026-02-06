import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Eye, EyeOff, X } from "lucide-react";
import { GlowCard } from "@/components/ui/spotlight-card";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";

const signUpSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name is too long"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name is too long"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SignUpModal({ isOpen, onClose, onSuccess }: SignUpModalProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate inputs
    const result = signUpSchema.safeParse({ firstName, lastName, email, password, confirmPassword });
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      const errorMessage = 
        errors.firstName?.[0] || 
        errors.lastName?.[0] || 
        errors.email?.[0] || 
        errors.password?.[0] || 
        errors.confirmPassword?.[0] || 
        "Please check your details";
      toast({
        title: "Please check your details",
        description: errorMessage,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast({
            title: "Account already exists",
            description: "This email is already registered. Please log in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Something went wrong",
            description: error.message,
            variant: "destructive",
          });
        }
        setIsLoading(false);
        return;
      }

      // Create profile with first and last name
      if (data.user) {
        await supabase
          .from("profiles")
          .upsert({
            id: data.user.id,
            email: email,
            first_name: firstName,
            last_name: lastName,
            has_access: false,
          });
      }

      // Store email in localStorage for verification page
      localStorage.setItem("signupEmail", email);

      toast({
        title: "Check your email",
        description: "We've sent you a verification code. Please check your inbox.",
      });
      
      // Store email in session storage for verification page access
      sessionStorage.setItem("signupEmail", email);
      
      resetForm();
      handleClose();
      
      // Navigate to email verification page
      onSuccess?.();
      navigate(`/email-verification?email=${encodeURIComponent(email)}`);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <GlowCard glowColor="purple" customSize className="relative w-full h-full max-w-2xl max-h-screen mx-4">
        <div className="relative bg-card rounded-2xl shadow-lg border border-border h-full flex flex-col justify-center overflow-y-auto max-h-[calc(100vh-4rem)]">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-accent/10 transition-colors z-10"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          </button>

          {/* Content */}
          <div className="p-6 md:p-8 flex flex-col justify-center">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
              Create Your Account
            </h1>
            <p className="text-muted-foreground text-base">
              Learn at your own pace. No technical background required.
            </p>
          </div>

          {/* Google Sign Up Button */}
          <GoogleAuthButton mode="signup" className="mb-4" />

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-foreground text-base">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="h-12 text-base"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-foreground text-base">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="h-12 text-base"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground text-base">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-12 text-base"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground text-base">
                Create a password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 text-base pr-10"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                At least 6 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground text-base">
                Confirm password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 text-base pr-10"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
              {isLoading ? "Creating account..." : "Create My Account"}
            </Button>
          </form>

          {/* Reassurance */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              You won't be charged at this stage.<br />
              You'll only pay when you choose to start the course.
            </p>
          </div>
          </div>
        </div>
      </GlowCard>
    </div>
  );
}
