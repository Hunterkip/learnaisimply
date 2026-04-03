import { useState, useCallback, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate, Link, useSearchParams, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Eye, EyeOff, ArrowLeft, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Please enter your password"),
});

const signUpSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const emailFormatRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const typoSuggestions: Record<string, string> = {
  'gmial.com': 'gmail.com', 'gmal.com': 'gmail.com', 'gamil.com': 'gmail.com',
  'gmaill.com': 'gmail.com', 'gnail.com': 'gmail.com', 'yahooo.com': 'yahoo.com',
  'hotmal.com': 'hotmail.com', 'hotmial.com': 'hotmail.com',
  'outloo.com': 'outlook.com', 'outlok.com': 'outlook.com',
};

export default function AuthPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isSignUpRoute = location.pathname === "/sign-up";
  const tabFromParam = searchParams.get("tab");
  const initialTab = tabFromParam === "signin" ? "signin" : tabFromParam === "signup" || isSignUpRoute ? "signup" : "signin";
  const [activeTab, setActiveTab] = useState<"signin" | "signup">(initialTab);

  // Sign in state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Sign up state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid' | 'exists'>('idle');
  const [emailError, setEmailError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase.from("profiles").select("has_access").eq("id", session.user.id).single();
        navigate(profile?.has_access ? "/dashboard" : "/enroll");
      }
    };
    checkSession();
  }, [navigate]);

  // Email validation for signup
  const validateEmail = useCallback(async (emailValue: string) => {
    const trimmed = emailValue.trim().toLowerCase();
    if (!trimmed) { setEmailStatus('idle'); setEmailError(null); return; }
    if (!emailFormatRegex.test(trimmed)) { setEmailStatus('invalid'); setEmailError('Please enter a valid email format'); return; }
    const domain = trimmed.split('@')[1];
    if (typoSuggestions[domain]) { setEmailStatus('invalid'); setEmailError(`Did you mean ${trimmed.replace(domain, typoSuggestions[domain])}?`); return; }
    setEmailStatus('checking'); setEmailError(null);
    try {
      const { data: existing, error } = await supabase.from("profiles").select("email, auth_provider").eq("email", trimmed).maybeSingle();
      if (error) { setEmailStatus('valid'); return; }
      if (existing) {
        setEmailStatus('exists');
        setEmailError(existing.auth_provider === 'google' ? 'Already registered with Google. Sign in with Google.' : 'Already registered. Please sign in.');
      } else { setEmailStatus('valid'); setEmailError(null); }
    } catch { setEmailStatus('valid'); }
  }, []);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setTimeout(() => validateEmail(e.target.value), 500);
  };

  // Sign in handler
  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = loginSchema.safeParse({ email: loginEmail, password: loginPassword });
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      toast({ title: "Check your details", description: errors.email?.[0] || errors.password?.[0] || "Invalid input", variant: "destructive" });
      setIsLoading(false); return;
    }
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
      if (error) {
        toast({ title: "Unable to log in", description: error.message.includes("Invalid login") ? "Check your email and password." : error.message, variant: "destructive" });
        setIsLoading(false); return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user.email_confirmed_at) {
        toast({ title: "Email not verified", description: "Please verify your email.", variant: "destructive" });
        navigate(`/email-verification?email=${encodeURIComponent(loginEmail)}`);
        setIsLoading(false); return;
      }
      const { data: profile } = await supabase.from("profiles").select("has_access").eq("id", session.user.id).single();
      toast({ title: "Welcome back!" });
      navigate(profile?.has_access ? "/dashboard" : "/enroll");
    } catch { toast({ title: "Something went wrong", variant: "destructive" }); }
    finally { setIsLoading(false); }
  };

  // Sign up handler
  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    if (emailStatus === 'exists' || emailStatus === 'invalid') {
      toast({ title: "Check your email", description: emailError || "Invalid email", variant: "destructive" }); return;
    }
    setIsLoading(true);
    const result = signUpSchema.safeParse({ firstName, lastName, email, password, confirmPassword });
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      toast({ title: "Check your details", description: errors.firstName?.[0] || errors.lastName?.[0] || errors.email?.[0] || errors.password?.[0] || errors.confirmPassword?.[0] || "Invalid", variant: "destructive" });
      setIsLoading(false); return;
    }
    try {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { first_name: firstName, last_name: lastName } } });
      if (error) {
        if (error.message.includes("already registered")) {
          setEmailStatus('exists'); setEmailError('Already registered. Please sign in.');
        }
        toast({ title: "Error", description: error.message, variant: "destructive" });
        setIsLoading(false); return;
      }
      if (data.user) {
        await supabase.from("profiles").upsert({ id: data.user.id, email: email.toLowerCase(), first_name: firstName, last_name: lastName, has_access: false, auth_provider: 'manual' });
      }
      localStorage.setItem("signupEmail", email);
      toast({ title: "Check your email", description: "We've sent you a verification code." });
      navigate(`/email-verification?email=${encodeURIComponent(email)}`);
    } catch { toast({ title: "Something went wrong", variant: "destructive" }); }
    finally { setIsLoading(false); }
  };

  const inputClass = "h-9 text-sm bg-primary/30 border-border/40 text-foreground placeholder:text-muted-foreground/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.15),0_1px_0_hsl(var(--border)/0.3)] focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.15),0_0_0_3px_hsl(var(--accent)/0.25)] transition-shadow";
  const labelClass = "text-primary-foreground/80 text-xs font-medium";

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-primary">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,hsl(var(--accent)/0.15),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,hsl(var(--accent)/0.1),transparent_50%)]" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-accent/8 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
      </div>

      <section className="flex-1 flex items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-sm">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground transition-colors text-xs group mb-4">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Home
          </Link>

          {/* Card */}
          <div className="bg-primary/60 backdrop-blur-xl rounded-2xl border border-accent/15 p-5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
            {/* Tab Toggle */}
            <div className="flex rounded-lg bg-primary/80 border border-border/30 p-0.5 mb-4">
              <button
                onClick={() => setActiveTab("signin")}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                  activeTab === "signin"
                    ? "bg-accent text-accent-foreground shadow-[0_2px_8px_hsl(var(--accent)/0.3)]"
                    : "text-primary-foreground/50 hover:text-primary-foreground/80"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                  activeTab === "signup"
                    ? "bg-accent text-accent-foreground shadow-[0_2px_8px_hsl(var(--accent)/0.3)]"
                    : "text-primary-foreground/50 hover:text-primary-foreground/80"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Header */}
            <div className="text-center mb-3">
              <h1 className="text-lg font-semibold text-primary-foreground">
                {activeTab === "signin" ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-primary-foreground/50 text-xs">
                {activeTab === "signin" ? "Sign in to continue learning." : "No technical background required."}
              </p>
            </div>

            {/* Google Button */}
            <GoogleAuthButton
              mode={activeTab === "signin" ? "signin" : "signup"}
              className="mb-2 [&>button]:h-9 [&>button]:text-sm [&>button]:bg-primary/40 [&>button]:border-border/30 [&>button]:text-primary-foreground [&>button]:shadow-[0_3px_0_0_hsl(var(--border)/0.4),0_4px_8px_-2px_rgba(0,0,0,0.2)] [&>button]:active:shadow-[0_1px_0_0_hsl(var(--border)/0.4)] [&>button]:active:translate-y-[2px] [&>button]:transition-all"
            />

            {/* Divider */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/30" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-primary/60 px-2 text-primary-foreground/40">or email</span>
              </div>
            </div>

            {/* SIGN IN FORM */}
            {activeTab === "signin" && (
              <form onSubmit={handleSignIn} className="space-y-2.5">
                <div className="space-y-1">
                  <Label htmlFor="login-email" className={labelClass}>Email</Label>
                  <Input id="login-email" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="you@example.com" className={inputClass} required disabled={isLoading} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password" className={labelClass}>Password</Label>
                    <Link to="/forgot-password" className="text-[10px] text-accent hover:underline">Forgot?</Link>
                  </div>
                  <Input id="login-password" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••••" className={inputClass} required disabled={isLoading} />
                </div>
                <Button type="submit" className="w-full h-9 text-sm font-medium shadow-[0_3px_0_0_hsl(var(--accent)/0.4),0_4px_10px_-2px_rgba(0,0,0,0.25)] active:shadow-[0_1px_0_0_hsl(var(--accent)/0.4)] active:translate-y-[2px] transition-all" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            )}

            {/* SIGN UP FORM */}
            {activeTab === "signup" && (
              <form onSubmit={handleSignUp} className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="first-name" className={labelClass}>First Name</Label>
                    <Input id="first-name" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" className={inputClass} required disabled={isLoading} />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="last-name" className={labelClass}>Last Name</Label>
                    <Input id="last-name" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" className={inputClass} required disabled={isLoading} />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="signup-email" className={labelClass}>Email</Label>
                  <div className="relative">
                    <Input id="signup-email" type="email" value={email} onChange={handleEmailChange} placeholder="you@example.com"
                      className={`${inputClass} pr-8 ${emailStatus === 'invalid' || emailStatus === 'exists' ? 'border-destructive' : emailStatus === 'valid' ? 'border-green-500/50' : ''}`}
                      required disabled={isLoading} />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      {emailStatus === 'checking' && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
                      {emailStatus === 'valid' && <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />}
                      {(emailStatus === 'invalid' || emailStatus === 'exists') && <XCircle className="h-3.5 w-3.5 text-destructive" />}
                    </div>
                  </div>
                  {emailError && (
                    <p className="text-[10px] text-destructive">
                      {emailError}
                      {emailStatus === 'exists' && (
                        <button type="button" onClick={() => setActiveTab("signin")} className="ml-1 underline hover:text-accent">Sign in</button>
                      )}
                    </p>
                  )}
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="signup-password" className={labelClass}>Password</Label>
                  <div className="relative">
                    <Input id="signup-password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={`${inputClass} pr-8`} required disabled={isLoading} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-primary-foreground/40 hover:text-primary-foreground/70">
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-primary-foreground/40">Min 6 characters</p>
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="signup-confirm" className={labelClass}>Confirm Password</Label>
                  <div className="relative">
                    <Input id="signup-confirm" type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className={`${inputClass} pr-8`} required disabled={isLoading} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-primary-foreground/40 hover:text-primary-foreground/70">
                      {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full h-9 text-sm font-medium shadow-[0_3px_0_0_hsl(var(--accent)/0.4),0_4px_10px_-2px_rgba(0,0,0,0.25)] active:shadow-[0_1px_0_0_hsl(var(--accent)/0.4)] active:translate-y-[2px] transition-all" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Account"}
                </Button>
                <p className="text-center text-[10px] text-primary-foreground/40 pt-1">
                  You won't be charged now. Pay only when you start.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
