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
      const userEmail = user.email?.toLowerCase() || "";

      // Check if this email already exists in profiles with a different auth provider
      const { data: existingProfile, error: profileError } = await supabase
        .from("profiles")
        .select("id, has_access, auth_provider, first_name, last_name")
        .eq("email", userEmail)
        .maybeSingle();

      // Case 1: Email exists with manual (password) provider - block Google login
      if (existingProfile && existingProfile.auth_provider === "manual" && existingProfile.id !== user.id) {
        await supabase.auth.signOut();
        toast({
          title: "Email already registered",
          description: "This email is registered with a password. Please log in using your email and password instead.",
          variant: "destructive",
        });
        navigate("/log-in");
        return;
      }

      // Case 2: Profile exists and matches current user (returning Google user)
      if (existingProfile && existingProfile.id === user.id) {
        if (existingProfile.auth_provider === "manual") {
          // This shouldn't happen but handle gracefully
          await supabase.auth.signOut();
          toast({
            title: "Please use password login",
            description: "Your account uses email and password authentication.",
            variant: "destructive",
          });
          navigate("/log-in");
          return;
        }

        // Welcome back existing Google user
        if (existingProfile.has_access) {
          toast({
            title: `Welcome back${existingProfile.first_name ? `, ${existingProfile.first_name}` : ""}!`,
            description: "Redirecting to your dashboard...",
          });
          navigate("/dashboard");
        } else {
          navigate("/enroll");
        }
        return;
      }

      // Case 3: No profile exists - new Google user, profile will be created by trigger
      // The handle_new_user trigger will create the profile automatically
      toast({
        title: "Account created successfully!",
        description: "Welcome! Let's get you enrolled.",
      });
      navigate("/enroll");
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
