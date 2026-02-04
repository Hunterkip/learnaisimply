import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const processOAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        toast({
          title: "Authentication failed",
          description: "Please try again.",
          variant: "destructive",
        });
        navigate("/log-in");
        return;
      }

      const user = data.session.user;
      const userEmail = user.email;

      // Get profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("has_access, auth_provider, first_name, last_name")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        // Profile doesn't exist - this is a new Google user
        // Check if the email already exists with a different provider (manual)
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("auth_provider")
          .eq("email", userEmail?.toLowerCase() || "")
          .single();

        if (existingProfile && existingProfile.auth_provider === "manual") {
          // Email exists with manual provider - sign out and show error
          await supabase.auth.signOut();
          toast({
            title: "Email already registered",
            description: "This email is registered with a password. Please log in using your email and password instead.",
            variant: "destructive",
          });
          navigate("/log-in");
          return;
        }

        // Otherwise continue - profile will be created by trigger
        navigate("/enroll");
        return;
      }

      // 🚨 Enforce provider rules - manual account trying to use Google
      if (profile.auth_provider === "manual") {
        await supabase.auth.signOut();
        toast({
          title: "Manual account detected",
          description: "Please log in using your email and password.",
          variant: "destructive",
        });
        navigate("/log-in");
        return;
      }

      // ✅ Correct routing based on access
      if (profile.has_access) {
        toast({
          title: `Welcome back${profile.first_name ? `, ${profile.first_name}` : ""}!`,
          description: "Redirecting to your dashboard...",
        });
        navigate("/dashboard");
      } else {
        navigate("/enroll");
      }
    };

    processOAuth();
  }, [navigate, toast]);

  // Show loading spinner while processing
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-4 text-muted-foreground">Signing you in...</p>
      </div>
    </div>
  );
}
