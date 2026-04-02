import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Please enter your password"),
});

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/enroll");
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      const errorMessage = errors.email?.[0] || errors.password?.[0] || "Please check your details";
      toast({ title: "Please check your details", description: errorMessage, variant: "destructive" });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({ title: "Unable to log in", description: "Please check your email and password and try again.", variant: "destructive" });
        } else {
          toast({ title: "Something went wrong", description: error.message, variant: "destructive" });
        }
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user.email_confirmed_at) {
        toast({ title: "Email not verified", description: "Please verify your email to continue.", variant: "destructive" });
        navigate(`/email-verification?email=${encodeURIComponent(email)}`);
        return;
      }

      toast({ title: "Welcome back!", description: "You've successfully logged in." });
      navigate("/enroll");
    } catch (error) {
      toast({ title: "Something went wrong", description: "Please try again in a moment.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-primary">
      {/* Animated background matching SignIn */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,hsl(var(--accent)/0.15),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,hsl(var(--accent)/0.1),transparent_50%)]" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-accent/8 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
      </div>

      <section className="flex-1 flex items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm group mb-8"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Home
          </Link>

          <div className="bg-card/90 backdrop-blur-xl rounded-2xl border border-border/50 p-8 shadow-2xl shadow-black/20">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
                Welcome Back
              </h1>
              <p className="text-muted-foreground text-sm">
                Log in to continue your learning journey.
              </p>
            </div>

            {/* Google Sign In */}
            <GoogleAuthButton mode="signin" className="mb-4" />

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground text-sm">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-12"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-foreground text-sm">Password</Label>
                  <Link to="/forgot-password" className="text-xs text-accent hover:underline">Forgot password?</Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12"
                  required
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full h-14 text-base font-medium" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </div>

          <p className="text-center mt-5 text-primary-foreground/60 text-sm">
            Don't have an account?{" "}
            <Link to="/sign-up" className="text-accent font-medium hover:underline">Sign Up</Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Login;
