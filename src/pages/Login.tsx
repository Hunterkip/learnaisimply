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

  // Check if user is already logged in
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

    // Validate inputs
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      const errorMessage = errors.email?.[0] || errors.password?.[0] || "Please check your details";
      toast({
        title: "Please check your details",
        description: errorMessage,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Unable to log in",
            description: "Please check your email and password and try again.",
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

      // Check if email is verified
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user.email_confirmed_at) {
        toast({
          title: "Email not verified",
          description: "Please verify your email to continue.",
          variant: "destructive",
        });
        navigate(`/email-verification?email=${encodeURIComponent(email)}`);
        return;
      }

      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      
      navigate("/enroll");
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
    <div className="min-h-screen bg-secondary flex items-center justify-center px-3 sm:px-4 py-8 sm:py-12">
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
        <div className="bg-card rounded-xl sm:rounded-2xl shadow-sm border border-border p-5 sm:p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground mb-2 sm:mb-3">
              Welcome Back
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Log in to continue your learning journey.
            </p>
          </div>

          {/* Google Sign In Button */}
          <GoogleAuthButton mode="signin" className="mb-4" />

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
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground text-sm sm:text-base">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-11 sm:h-12 text-sm sm:text-base"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground text-sm sm:text-base">
                  Password
                </Label>
                <Link 
                  to="/forgot-password" 
                  className="text-xs sm:text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 sm:h-12 text-sm sm:text-base"
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 sm:h-14 text-base sm:text-lg font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
          </form>
        </div>

        {/* Secondary Navigation */}
        <p className="text-center mt-5 sm:mt-6 text-muted-foreground text-sm">
          Don't have an account?{" "}
          <Link 
            to="/sign-up" 
            className="text-primary font-medium hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
