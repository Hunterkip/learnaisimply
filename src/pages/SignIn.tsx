import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthTabs } from "@/components/blocks/modern-animated-sign-in";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";

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

  const [formData, setFormData] = useState<FormData>({
    email: "",

    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [googleRedirectTo, setGoogleRedirectTo] = useState<string | undefined>(undefined);

  // Check if user is already logged in

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // Check if user has access

        const { data: profile } = await supabase

          .from("profiles")

          .select("has_access")

          .eq("id", session.user.id)

          .single();

        if (profile?.has_access) {
          navigate("/dashboard");
        } else {
          navigate("/enroll");
        }
      }
    };

    checkSession();
  }, [navigate]);

  // Fetch Google redirect/callback URL from payment_settings table

  useEffect(() => {
    const fetchRedirect = async () => {
      try {
        const { data, error } = await supabase

          .from("payment_settings")

          .select("payment_method")

          .single();

        if (!error && data?.payment_method) {
          setGoogleRedirectTo(`${window.location.origin}/enroll`);

          return;
        }
      } catch (err) {
        console.error("Failed to fetch google redirect from settings", err);
      }

      // Fallback

      setGoogleRedirectTo(`${window.location.origin}/enroll`);
    };

    fetchRedirect();
  }, []);

  const goToForgotPassword = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    event.preventDefault();

    navigate("/forgot-password");
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,

    name: keyof FormData,
  ) => {
    const value = event.target.value;

    setFormData((prevState) => ({
      ...prevState,

      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    // Validate inputs

    const result = loginSchema.safeParse(formData);

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
        email: formData.email,

        password: formData.password,
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

        setIsLoading(false);

        return;
      }

      // Check if email is verified

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user.email_confirmed_at) {
        toast({
          title: "Email not verified",

          description: "Please verify your email to continue.",

          variant: "destructive",
        });

        navigate(`/email-verification?email=${encodeURIComponent(formData.email)}`);

        setIsLoading(false);

        return;
      }

      // Check if user has access to the course

      const { data: profile } = await supabase

        .from("profiles")

        .select("has_access")

        .eq("id", session.user.id)

        .single();

      toast({
        title: "Welcome back!",

        description: "You have successfully logged in.",
      });

      // Redirect to dashboard if user has access, otherwise to enroll page

      if (profile?.has_access) {
        navigate("/dashboard");
      } else {
        navigate("/enroll");
      }
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

  const formFields = {
    header: "Welcome back",

    subHeader: "Sign in to your account",

    fields: [
      {
        label: "Email",

        required: true,

        type: "email" as const,

        placeholder: "Enter your email address",

        onChange: (event: ChangeEvent<HTMLInputElement>) => handleInputChange(event, "email"),
      },

      {
        label: "Password",

        required: true,

        type: "password" as const,

        placeholder: "Enter your password",

        onChange: (event: ChangeEvent<HTMLInputElement>) => handleInputChange(event, "password"),
      },
    ],

    submitButton: "Sign in",

    textVariantButton: "Forgot password?",
  };

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
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm group mb-8"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Home
          </Link>
          <div className="bg-card/90 backdrop-blur-xl rounded-2xl border border-border/50 p-8 shadow-2xl shadow-black/20">
            <AuthTabs
              formFields={formFields}
              goTo={goToForgotPassword}
              handleSubmit={handleSubmit}
              googleRedirectTo={googleRedirectTo}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
