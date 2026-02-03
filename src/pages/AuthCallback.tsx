import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

      // Get profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("has_access, auth_provider")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        navigate("/log-in");
        return;
      }

      // 🚨 Enforce provider rules
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

      // ✅ Correct routing
      if (profile.has_access) {
        navigate("/dashboard");
      } else {
        navigate("/enroll");
      }
    };

    processOAuth();
  }, [navigate, toast]);

  return null;
}
