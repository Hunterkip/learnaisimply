import { useState, ChangeEvent, FormEvent, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Ripple, AuthTabs, TechOrbitDisplay } from "@/components/blocks/modern-animated-sign-in";
import { z } from "zod";

// Types for form handling
type FormData = {
  email: string;
  password: string;
};

// Zod schema for input validation
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Please enter your password"),
});

export default function SignIn() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [googleRedirectTo, setGoogleRedirectTo] = useState<string | undefined>(undefined);

  useEffect(() => {
    setGoogleRedirectTo(`${window.location.origin}/enroll`);
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>, name: keyof FormData) => {
    setFormData((prev) => ({ ...prev, [name]: event.target.value }));
  };

  /**
   * Main Submit Handler
   * Performs real-time checks for existence and provider logic
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // 1. Basic Format Validation (Client-side)
    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      toast({
        title: "Check your details",
        description: validation.error.flatten().fieldErrors.email?.[0] || "Invalid input",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const cleanEmail = formData.email.trim().toLowerCase();

    try {
      // 2. REAL-TIME CHECK: Does the email exist and what is the provider?
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("auth_provider")
        .eq("email", cleanEmail)
        .maybeSingle();

      // Case: Email not found in the database
      if (!profile) {
        toast({
          title: "Account not found",
          description: "This email is not registered. Please check the spelling or create a new account.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Case: Email exists but signed up via Google
      if (profile.auth_provider === "google") {
        toast({
          title: "Google Login Required",
          description: "You created this account using Google. Please click the 'Sign in with Google' button below.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // 3. PROCEED: Manual Password Sign In
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: formData.password,
      });

      if (signInError) {
        toast({
          title: "Login failed",
          description: "Incorrect password. Please try again or reset your password.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // 4. SESSION & VERIFICATION CHECK
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user.email_confirmed_at) {
        navigate(`/email-verification?email=${encodeURIComponent(cleanEmail)}`);
        return;
      }

      // 5. REDIRECTION BASED ON ACCESS
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("has_access")
        .eq("id", session.user.id)
        .single();

      toast({ title: "Welcome back!", description: "Successfully logged in." });
      
      if (userProfile?.has_access) {
        navigate("/dashboard");
      } else {
        navigate("/enroll");
      }

    } catch (error) {
      console.error("SignIn Error:", error);
      toast({ title: "Error", description: "Something went wrong. Please try again later.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Google OAuth Handler with Manual Account Guard
   */
  const handleGoogleClick = async () => {
    // Optional: If email is typed, prevent manual users from using Google OAuth
    if (formData.email) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("auth_provider")
        .eq("email", formData.email.trim().toLowerCase())