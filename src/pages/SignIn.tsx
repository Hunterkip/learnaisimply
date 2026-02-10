import { useState, ChangeEvent, FormEvent, useEffect, ReactNode } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Ripple, AuthTabs, TechOrbitDisplay } from "@/components/blocks/modern-animated-sign-in";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/homepage/Footer";

type FormData = {
  email: string;

  password: string;
};

interface OrbitIcon {
  component: () => ReactNode;

  className: string;

  duration?: number;

  delay?: number;

  radius?: number;

  path?: boolean;

  reverse?: boolean;
}

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),

  password: z.string().min(1, "Please enter your password"),
});

const iconsArray: OrbitIcon[] = [
  {
    component: () => (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg"
        alt="HTML5"
        className="w-[30px] h-[30px]"
      />
    ),

    className: "size-[30px] border-none bg-transparent",

    duration: 20,

    delay: 20,

    radius: 100,

    path: false,

    reverse: false,
  },

  {
    component: () => (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg"
        alt="CSS3"
        className="w-[30px] h-[30px]"
      />
    ),

    className: "size-[30px] border-none bg-transparent",

    duration: 20,

    delay: 10,

    radius: 100,

    path: false,

    reverse: false,
  },

  {
    component: () => (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg"
        alt="TypeScript"
        className="w-[50px] h-[50px]"
      />
    ),

    className: "size-[50px] border-none bg-transparent",

    radius: 210,

    duration: 20,

    path: false,

    reverse: false,
  },

  {
    component: () => (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg"
        alt="JavaScript"
        className="w-[50px] h-[50px]"
      />
    ),

    className: "size-[50px] border-none bg-transparent",

    radius: 210,

    duration: 20,

    delay: 20,

    path: false,

    reverse: false,
  },

  {
    component: () => (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg"
        alt="TailwindCSS"
        className="w-[30px] h-[30px]"
      />
    ),

    className: "size-[30px] border-none bg-transparent",

    duration: 20,

    delay: 20,

    radius: 150,

    path: false,

    reverse: true,
  },

  {
    component: () => (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg"
        alt="React"
        className="w-[50px] h-[50px]"
      />
    ),

    className: "size-[50px] border-none bg-transparent",

    radius: 270,

    duration: 20,

    path: false,

    reverse: true,
  },

  {
    component: () => (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg"
        alt="Git"
        className="w-[50px] h-[50px]"
      />
    ),

    className: "size-[50px] border-none bg-transparent",

    radius: 320,

    duration: 20,

    delay: 20,

    path: false,

    reverse: false,
  },
];

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
    <div className="min-h-screen flex flex-col">
      <section className="flex-1 flex max-lg:justify-center">
        {/* Left Side */}
        <span className="flex flex-col justify-center w-1/2 max-lg:hidden">
          <Ripple mainCircleSize={100} />
          <TechOrbitDisplay iconsArray={iconsArray} />
        </span>

        {/* Right Side */}
        <span className="w-1/2 h-[100dvh] flex flex-col justify-center items-center max-lg:w-full max-lg:px-[10%] relative">
          <Link
            to="/"
            className="absolute top-6 left-6 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Home
          </Link>
          <AuthTabs
            formFields={formFields}
            goTo={goToForgotPassword}
            handleSubmit={handleSubmit}
            googleRedirectTo={googleRedirectTo}
          />
        </span>
      </section>
      <Footer />
    </div>
  );
}
