import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Ripple, AuthTabs, TechOrbitDisplay } from "@/components/blocks/modern-animated-sign-in";
import { z } from "zod";

/* ============================= */
/* REQUIRED DEFINITIONS (FIXED)  */
/* ============================= */

type FormData = {
  email: string;
  password: string;
};

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

/**
 * Replace these with whatever icon components
 * your TechOrbitDisplay expects.
 */
const iconsArray = [{ label: "AI" }, { label: "ML" }, { label: "Data" }, { label: "Cloud" }, { label: "Code" }];

/* ============================= */
/* COMPONENT                     */
/* ============================= */

export default function SignIn() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [googleRedirectTo, setGoogleRedirectTo] = useState<string>();

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
        description:
          validation.error.flatten().fieldErrors.email?.[0] ||
          validation.error.flatten().fieldErrors.password?.[0] ||
          "Invalid input",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("auth_provider")
        .eq("email", formData.email)
        .maybeSingle();

      if (profile && profile.auth_provider === "google") {
        toast({
          title: "Google Account Detected",
          description: 'You created this account using Google. Please click "Sign in with Google".',
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

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

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user.email_confirmed_at) {
        navigate(`/email-verification?email=${encodeURIComponent(formData.email)}`);
        return;
      }

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
    } catch {
      toast({
        title: "Error",
        description: "Try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleClick = async () => {
    if (formData.email) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("auth_provider")
        .eq("email", formData.email)
        .maybeSingle();

      if (profile && profile.auth_provider === "manual") {
        toast({
          title: "Manual Account Detected",
          description: "This email is registered with a password. Please sign in manually.",
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
        type: "password" as const,
        placeholder: "Enter your password",
        onChange: (e: ChangeEvent<HTMLInputElement>) => handleInputChange(e, "password"),
      },
    ],
    submitButton: isLoading ? "Signing in..." : "Sign in",
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
          onGoogleClick={handleGoogleClick}
        />
      </span>
    </section>
  );
}
