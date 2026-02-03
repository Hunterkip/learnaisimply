import { useState, ChangeEvent, FormEvent, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Ripple, AuthTabs, TechOrbitDisplay } from "@/components/blocks/modern-animated-sign-in";
import { z } from "zod";

// ... (iconsArray and loginSchema remain the same)

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
   * Redesigned Submit Handler
   * Checks for authentication provider mismatch
   */
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

    try {
      // 1. First, check the user's profile/metadata via an edge function or a public profile check
      // Note: For security, Supabase doesn't let you query other users' auth.users table directly.
      // We check our 'profiles' table which should store the 'auth_provider' from signup.
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("auth_provider")
        .eq("email", formData.email)
        .maybeSingle();

      // 2. If user exists and signed up with Google, reject manual password login
      if (profile && profile.auth_provider === "google") {
        toast({
          title: "Google Account Detected",
          description: 'You created this account using Google. Please click the "Sign in with Google" button instead.',
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // 3. Proceed with standard Password Sign In
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        toast({
          title: "Login failed",
          description: signInError.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // 4. Verification Check
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user.email_confirmed_at) {
        navigate(`/email-verification?email=${encodeURIComponent(formData.email)}`);
        return;
      }

      // 5. Success Redirection
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("has_access")
        .eq("id", session.user.id)
        .single();

      if (userProfile?.has_access) {
        navigate("/dashboard");
      } else {
        navigate("/enroll");
      }
    } catch (error) {
      toast({ title: "Error", description: "Try again later.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logic for Google Sign In
   * This logic would ideally be passed into your AuthTabs or handled via a wrapper
   */
  const handleGoogleClick = async () => {
    // If you want to prevent manual users from using Google:
    // This requires an email input field to be filled first to check.
    if (formData.email) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("auth_provider")
        .eq("email", formData.email)
        .maybeSingle();

      if (profile && profile.auth_provider === "manual") {
        toast({
          title: "Manual Account Detected",
          description: "This email is registered with a password. Please sign in using your email and password.",
          variant: "destructive",
        });
        return;
      }
    }

    // Standard Google Redirect
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
        type: "password" as const,
        placeholder: "Enter your password",
        onChange: (e: ChangeEvent<HTMLInputElement>) => handleInputChange(e, "password"),
      },
    ],
    submitButton: "Sign in",
    textVariantButton: "Forgot password?",
  };

  return (
    <section className="flex max-lg:justify-center">
      <span className="flex flex-col justify-center w-1/2 max-lg:hidden">
        <Ripple mainCircleSize={100} />
        <TechOrbitDisplay iconsArray={iconsArray} />
      </span>

      <span className="w-1/2 h-[100dvh] flex flex-col justify-center items-center max-lg:w-full max-lg:px-[10%]">
        <AuthTabs
          formFields={formFields}
          goTo={(e) => {
            e.preventDefault();
            navigate("/forgot-password");
          }}
          handleSubmit={handleSubmit}
          googleRedirectTo={googleRedirectTo}
          // Note: If AuthTabs doesn't have an onGoogleClick prop,
          // ensure your profiles table is updated correctly during signup
          // to include an 'auth_provider' column.
        />
      </span>
    </section>
  );
}
