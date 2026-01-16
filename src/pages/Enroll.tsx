import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Check, Lock, CreditCard, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const included = [
  "Full course access (all 9 modules)",
  "Video + audio lessons",
  "Written lesson notes",
  "Lifetime access",
  "Certificate of completion"
];

const Enroll = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }

      setUserEmail(session.user.email || null);

      // Check if user already has access
      const { data: profile } = await supabase
        .from("profiles")
        .select("has_access")
        .eq("id", session.user.id)
        .single();

      if (profile?.has_access) {
        setHasAccess(true);
      }

      setIsLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handlePayment = async () => {
    // TODO: Integrate Stripe payment
    // For now, show a message that payment integration is coming
    toast({
      title: "Payment Coming Soon",
      description: "Stripe payment integration will be set up shortly.",
    });
  };

  const handleAccessCourse = () => {
    navigate("/course");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // If user already has access, show access button instead
  if (hasAccess) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="bg-card rounded-2xl shadow-sm border border-border p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-accent" />
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
                You're All Set!
              </h1>
              <p className="text-muted-foreground text-base">
                You have full access to the course. Start learning whenever you're ready.
              </p>
            </div>

            <Button 
              size="lg" 
              variant="continue"
              onClick={handleAccessCourse}
              className="w-full text-lg py-6 mb-4"
            >
              Go to Course
            </Button>

            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="w-full text-muted-foreground"
            >
              Log out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Welcome message */}
        <div className="text-center mb-6">
          <p className="text-muted-foreground">
            Logged in as <span className="font-medium text-foreground">{userEmail}</span>
          </p>
        </div>

        {/* Enrollment Card */}
        <div className="bg-card rounded-2xl shadow-sm border-2 border-accent/30 p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
              Complete Your Enrollment
            </h1>
            <p className="text-muted-foreground text-base">
              One-time payment for lifetime access
            </p>
          </div>

          {/* Price */}
          <div className="text-center mb-8">
            <div className="text-5xl font-bold text-foreground mb-2">
              $97
            </div>
            <p className="text-muted-foreground">
              One-time payment • No subscriptions
            </p>
          </div>
          
          {/* What's included */}
          <div className="space-y-4 mb-8">
            <h3 className="font-semibold text-foreground text-lg">
              What's included:
            </h3>
            <ul className="space-y-3">
              {included.map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                    <Check className="h-3 w-3 text-accent" />
                  </div>
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Payment Button */}
          <Button 
            size="lg" 
            variant="continue"
            onClick={handlePayment}
            className="w-full text-lg py-6 mb-6"
          >
            Pay $97 & Get Access
          </Button>
          
          {/* Payment info */}
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>Secure checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Powered by Stripe</span>
            </div>
          </div>
        </div>

        {/* Logout option */}
        <div className="text-center mt-6">
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="text-muted-foreground"
          >
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Enroll;
