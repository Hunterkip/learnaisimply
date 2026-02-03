import { useState, ChangeEvent, FormEvent, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Ripple, AuthTabs, TechOrbitDisplay } from "@/components/blocks/modern-animated-sign-in";
import { z } from "zod";

type FormData = {
  email: string;
  password: string;
};

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

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
      const { data: profile } = await supabase
        .from("profiles")
        .select("auth_provider")
        .eq("email", cleanEmail)
        .maybeSingle();

      if (!profile) {
        toast({
          title: "Account not found",
          description: "This email is not registered. Please check the spelling.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (profile.auth_provider === "google") {
        toast({
          title: "Google Login Required",
          description: "This account uses Google. Please click the Google button below.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: formData.password,
      });

      if (signInError) {
        toast({
          title: "Login failed",
          description: "Incorrect password.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user.email_confirmed_at) {
        navigate(`/email-verification?email=${encodeURIComponent(cleanEmail)}`);
        return;
      }

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("has_access")
        .eq("id", session.user.id)
        .single();

      toast({ title: "Welcome back!", description: "Successfully logged in." });
      navigate(userProfile?.has_access ? "/dashboard" : "/enroll");

    } catch (error) {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleClick = async () => {
    if (formData.email) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("auth_provider")
        .eq("email", formData.email.trim().toLowerCase())
        .maybeSingle();

      if (profile?.auth_provider === "manual") {
        toast({
          title: "Manual Account Detected",
          description: "Please sign in using your email and password.",
          variant: "destructive",
        });
        return;
      }
    }

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: googleRedirectTo },
    });
  };

  const formFields = {
    header: "Welcome back",
    subHeader: "Sign in to your account",
    fields: [
      {
        label: "Email",
        required: true,
        type: "email" as const,
        placeholder: "Enter your email address",
        onChange: (e: ChangeEvent<HTMLInputElement>) => handleInputChange(e, "email"),
      },
      {
        label: "Password",
        required: true,
        type: "password" as const