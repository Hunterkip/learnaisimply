import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Eye, EyeOff, ArrowLeft, CheckCircle2, XCircle, Loader2 } from "lucide-react";
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

// Email format validation regex - more strict than basic email regex
const emailFormatRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Common email domain validation
const commonEmailDomains = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com',
  'aol.com', 'live.com', 'msn.com', 'protonmail.com', 'mail.com'
];

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Email validation states
  const [emailStatus, setEmailStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid' | 'exists'>('idle');
  const [emailError, setEmailError] = useState<string | null>(null);

  // Debounced email validation
  const validateEmail = useCallback(async (emailValue: string) => {
    const trimmedEmail = emailValue.trim().toLowerCase();
    
    // Reset if empty
    if (!trimmedEmail) {
      setEmailStatus('idle');
      setEmailError(null);
      return;
    }

    // Check basic format first
    if (!emailFormatRegex.test(trimmedEmail)) {
      setEmailStatus('invalid');
      setEmailError('Please enter a valid email format (e.g., name@example.com)');
      return;
    }

    // Check for common typos in popular domains
    const domain = trimmedEmail.split('@')[1];
    const typoSuggestions: Record<string, string> = {
      'gmial.com': 'gmail.com',
      'gmal.com': 'gmail.com',
      'gamil.com': 'gmail.com',
      'gmaill.com': 'gmail.com',
      'gnail.com': 'gmail.com',
      'yahooo.com': 'yahoo.com',
      'yaho.com': 'yahoo.com',
      'hotmal.com': 'hotmail.com',
      'hotmial.com': 'hotmail.com',
      'outloo.com': 'outlook.com',
      'outlok.com': 'outlook.com',
    };

    if (typoSuggestions[domain]) {
      setEmailStatus('invalid');
      setEmailError(`Did you mean ${trimmedEmail.replace(domain, typoSuggestions[domain])}?`);
      return;
    }

    // Start checking database
    setEmailStatus('checking');
    setEmailError(null);

    try {
      // Check if email already exists in our database
      const { data: existingProfile, error } = await supabase
        .from("profiles")
        .select("email, auth_provider")
        .eq("email", trimmedEmail)
        .maybeSingle();

      if (error) {
        console.error("Error checking email:", error);
        setEmailStatus('valid');
        return;
      }

      if (existingProfile) {
        setEmailStatus('exists');
        if (existingProfile.auth_provider === 'google') {
          setEmailError('This email is already registered with Google. Please sign in with Google instead.');
        } else {
          setEmailError('This email is already registered. Please log in instead.');
        }
      } else {
        setEmailStatus('valid');
        setEmailError(null);
      }
    } catch (err) {
      console.error("Email validation error:", err);
      setEmailStatus('valid'); // Default to valid on error to not block signup
    }
  }, []);

  // Handle email change with debounce
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    // Clear previous timeout
    const timeoutId = setTimeout(() => {
      validateEmail(value);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't proceed if email already exists
    if (emailStatus === 'exists') {
      toast({
        title: "Email already registered",
        description: "Please log in or use a different email address.",
        variant: "destructive",
      });
      return;
    }

    if (emailStatus === 'invalid') {
      toast({
        title: "Invalid email",
        description: emailError || "Please check your email address.",
        variant: "destructive",
      });
      return;
    }

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
          setEmailStatus('exists');
          setEmailError('This email is already registered. Please log in instead.');
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
        return;
      }

      // Create profile with first and last name
      if (data.user) {
        await supabase
          .from("profiles")
          .upsert({
            id: data.user.id,
            email: email.toLowerCase(),
            first_name: firstName,
            last_name: lastName,
            has_access: false,
            auth_provider: 'manual',
          });
      }

      // Store email in localStorage for verification page
      localStorage.setItem("signupEmail", email);

      toast({
        title: "Check your email",
        description: "We've sent you a verification code. Please check your inbox.",
      });
      
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

  return (
    <div
      className="min-h-screen bg-secondary flex items-center justify-center px-3 sm:px-4 py-8 sm:py-12"
      style={{
        backgroundImage:
          "radial-gradient(circle at calc(var(--global-xp,0.5) * 100%) calc(var(--global-yp,0.5) * 100%), hsla(var(--global-hue,280) 80% 60% / 0.12), transparent 20%), linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.2))",
        backgroundBlendMode: 'screen, normal',
      }}
    >
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Back to Home */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 sm:mb-6 transition-colors text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Main Card */}
        <GlowCard glowColor="purple" customSize className="w-full max-w-md mx-auto">
          <div className="bg-card rounded-xl sm:rounded-2xl shadow-sm border border-border p-5 sm:p-6 md:p-8 w-full h-full">
          {/* Header */}
          <div className="text-center mb-5 sm:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground mb-2 sm:mb-3">
              Create Your Account
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="firstName" className="text-foreground text-sm sm:text-base">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="h-11 sm:h-12 text-sm sm:text-base"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="lastName" className="text-foreground text-sm sm:text-base">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="h-11 sm:h-12 text-sm sm:text-base"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="email" className="text-foreground text-sm sm:text-base">
                Email address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="you@example.com"
                  className={`h-11 sm:h-12 text-sm sm:text-base pr-10 ${
                    emailStatus === 'invalid' || emailStatus === 'exists' 
                      ? 'border-destructive focus-visible:ring-destructive' 
                      : emailStatus === 'valid' 
                        ? 'border-green-500 focus-visible:ring-green-500' 
                        : ''
                  }`}
                  required
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {emailStatus === 'checking' && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                  {emailStatus === 'valid' && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                  {(emailStatus === 'invalid' || emailStatus === 'exists') && (
                    <XCircle className="h-4 w-4 text-destructive" />
                  )}
                </div>
              </div>
              {emailError && (
                <p className={`text-xs sm:text-sm ${
                  emailStatus === 'exists' ? 'text-destructive' : 'text-amber-500'
                }`}>
                  {emailError}
                  {emailStatus === 'exists' && (
                    <Link to="/log-in" className="ml-1 underline hover:text-primary">
                      Log in here
                    </Link>
                  )}
                </p>
              )}
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="password" className="text-foreground text-sm sm:text-base">
                Create a password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 sm:h-12 text-sm sm:text-base pr-10"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                </button>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                At least 6 characters
              </p>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground text-sm sm:text-base">
                Confirm password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 sm:h-12 text-sm sm:text-base pr-10"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 sm:h-14 text-base sm:text-lg font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create My Account"}
            </Button>
          </form>

          {/* Reassurance */}
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border">
            <p className="text-center text-xs sm:text-sm text-muted-foreground">
              You won't be charged at this stage.<br />
              You'll only pay when you choose to start the course.
            </p>
          </div>
          </div>
        </GlowCard>

        {/* Secondary Navigation */}
        <p className="text-center mt-5 sm:mt-6 text-muted-foreground text-sm">
          Already have an account?{" "}
          <Link 
            to="/log-in" 
            className="text-primary font-medium hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
