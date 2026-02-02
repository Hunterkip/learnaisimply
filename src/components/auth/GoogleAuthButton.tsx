import { useState, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface GoogleAuthButtonProps {
  mode: "signin" | "signup";
  className?: string;
}

export const GoogleAuthButton = forwardRef<HTMLButtonElement, GoogleAuthButtonProps>(({ mode, className }, ref) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/enroll`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        console.error("Google auth error:", error);
        toast({
          title: "Authentication Error",
          description: error.message || "Failed to sign in with Google. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
      // If successful, the page will redirect to Google
    } catch (err) {
      console.error("Google auth error:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Button
      ref={ref}
      type="button"
      variant="outline"
      className={`w-full h-12 text-base font-medium ${className}`}
      onClick={handleGoogleAuth}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <>
          <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.9999 12.24C21.9999 11.4933 21.9333 10.76 21.8066 10.0533H12.3333V14.16H17.9533C17.7333 15.3467 17.0133 16.3733 15.9666 17.08V19.68H19.5266C21.1933 18.16 21.9999 15.4533 21.9999 12.24Z" fill="#4285F4"/>
            <path d="M12.3333 22C15.2333 22 17.6866 21.0533 19.5266 19.68L15.9666 17.08C15.0199 17.7333 13.7933 18.16 12.3333 18.16C9.52659 18.16 7.14659 16.28 6.27992 13.84H2.59326V16.5133C4.38659 20.0267 8.05992 22 12.3333 22Z" fill="#34A853"/>
            <path d="M6.2799 13.84C6.07324 13.2267 5.9599 12.58 5.9599 11.92C5.9599 11.26 6.07324 10.6133 6.2799 10L2.59326 7.32667C1.86659 8.78667 1.45326 10.32 1.45326 11.92C1.45326 13.52 1.86659 15.0533 2.59326 16.5133L6.2799 13.84Z" fill="#FBBC05"/>
            <path d="M12.3333 5.68C13.8933 5.68 15.3133 6.22667 16.3866 7.24L19.6 4.02667C17.68 2.29333 15.2266 1.33333 12.3333 1.33333C8.05992 1.33333 4.38659 3.97333 2.59326 7.32667L6.27992 10C7.14659 7.56 9.52659 5.68 12.3333 5.68Z" fill="#EA4335"/>
          </svg>
          {mode === "signin" ? "Continue with Google" : "Sign up with Google"}
        </>
      )}
    </Button>
  );
});

GoogleAuthButton.displayName = 'GoogleAuthButton';
