import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, BookOpen, Code2, Clock, Video, Lightbulb, Lock, LogOut, Sparkles, Brain, Zap } from "lucide-react";
import { PaymentModeSelector } from "@/components/payment/PaymentModeSelector";

import { PaystackVerificationDialog } from "@/components/payment/PaystackVerificationDialog";
import { useToast } from "@/hooks/use-toast";

const included = [
  "Full course access (all 9 modules)",
  "Video + audio lessons",
  "Written lesson notes",
  "Lifetime access",
  "No subscriptions",
];

const trustItems = [
  {
    icon: Code2,
    title: "No coding required",
    description: "Everything is explained in plain language",
  },
  {
    icon: Clock,
    title: "Learn at your own pace",
    description: "Take your time with each lesson",
  },
  {
    icon: Video,
    title: "Video + audio lessons",
    description: "Watch, listen, or read — your choice",
  },
  {
    icon: Lightbulb,
    title: "Practical examples",
    description: "Real-life situations you'll recognize",
  },
];

const learningOutcomes = [
  "How AI works (without technical language)",
  "How to write clearer emails and documents",
  "How to plan, organize, and research with AI",
  "How to use AI for everyday life tasks",
  "How to use AI responsibly and safely",
];

const courseModules = [
  { number: 0, title: "Welcome & Orientation" },
  { number: 1, title: "Understanding AI" },
  { number: 2, title: "Prompting & Iteration" },
  { number: 3, title: "Communication with AI" },
  { number: 4, title: "Planning & Research" },
  { number: 5, title: "AI for Everyday Life" },
  { number: 6, title: "Creative AI" },
  { number: 7, title: "Wellbeing & Ethics" },
  { number: 8, title: "Course Wrap-Up" },
];

const typingTexts = [
  "Write emails that connect...",
  "Research topics in seconds...",
  "Plan your day smarter...",
  "Create content effortlessly...",
];

const Enroll = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userLastName, setUserLastName] = useState<string>("");
  const [hasAccess, setHasAccess] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  const [showPaystackVerification, setShowPaystackVerification] = useState(false);
  const [paystackReference, setPaystackReference] = useState<string | null>(null);

  // Typing animation effect
  useEffect(() => {
    const text = typingTexts[currentTextIndex];

    if (isTyping) {
      if (displayedText.length < text.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(text.slice(0, displayedText.length + 1));
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      if (displayedText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, 30);
        return () => clearTimeout(timeout);
      } else {
        setCurrentTextIndex((prev) => (prev + 1) % typingTexts.length);
        setIsTyping(true);
      }
    }
  }, [displayedText, isTyping, currentTextIndex]);

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Handle Paystack callback
  useEffect(() => {
    const paystackRef = searchParams.get("ref");
    const isPaymentSuccess = searchParams.get("payment") === "success";

    if (isPaymentSuccess && paystackRef) {
      setPaystackReference(paystackRef);
      setShowPaystackVerification(true);
    }
  }, [searchParams]);

  useEffect(() => {
    let mounted = true;
    const redirectTo = searchParams.get("redirect_to") ?? "/";

    const checkAuth = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session) {
          navigate("/log-in");
          return;
        }

        // Ensure email is verified
        if (!session.user.email_confirmed_at) {
          navigate(`/email-verification?email=${encodeURIComponent(session.user.email ?? "")}`);
          return;
        }

        setUserEmail(session.user.email ?? "");

        // Fetch profile (graceful if not present)
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("has_access, plan, first_name, last_name, email")
          .eq("id", session.user.id)
          .single();

        if (profileError && (profileError as any).code !== "PGRST116") {
          // Log and inform user; continue where possible
          console.error("Profile fetch error:", profileError);
          toast({
            title: "Profile error",
            description: "We couldn't load your profile. Please try again.",
            variant: "destructive",
          });
        }

        // Sync email only if different
        if (session.user.email && profile?.email !== session.user.email) {
          try {
            await supabase
              .from("profiles")
              .update({ email: session.user.email, updated_at: new Date().toISOString() })
              .eq("id", session.user.id)
              .select();
          } catch (err) {
            console.warn("Failed to update profile email:", err);
          }
        }

        // If user already has access, redirect to dashboard
        if (profile?.has_access) {
          setHasAccess(true);
          // small UX delay before redirect
          setTimeout(() => navigate("/dashboard"), 300);
          return;
        }

        if (profile?.first_name) setUserName(profile.first_name);
        if (profile?.last_name) setUserLastName(profile.last_name);

        if (mounted) setIsLoading(false);
      } catch (err) {
        console.error("Enroll check failed:", err);
        toast({
          title: "Authentication error",
          description: "An error occurred finalizing sign-in. Please try again.",
          variant: "destructive",
        });
        navigate("/log-in");
      }
    };

    checkAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/log-in");
    });

    return () => {
      mounted = false;
      // listener may be undefined depending on supabase client typing
      try {
        listener?.subscription?.unsubscribe?.();
      } catch (e) {
        // ignore
      }
    };
  }, [navigate, searchParams, toast]);

  const handleAccessCourse = () => {
    navigate("/course");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handlePaymentVerified = async () => {
    // Re-check access status
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("has_access")
        .eq("id", session.user.id)
        .single();
      if (error) {
        console.warn("Error fetching profile after payment:", error);
        return;
      }
      if (profile?.has_access) {
        setHasAccess(true);
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (err) {
      console.error("Error verifying payment flow:", err);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (userName && userLastName) {
      return `${userName.charAt(0)}${userLastName.charAt(0)}`.toUpperCase();
    }
    if (userName) {
      return userName.charAt(0).toUpperCase();
    }
    if (!userEmail) return "U";
    return userEmail.charAt(0).toUpperCase();
  };

  // Get display name (last name or part before @)
  const getDisplayName = () => {
    if (userLastName) return userLastName;
    if (!userEmail) return "User";
    return userEmail.split("@")[0];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (hasAccess) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="bg-card rounded-2xl shadow-sm border border-border p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-accent" />
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">You're All Set!</h1>
              <p className="text-muted-foreground text-base">
                You have full access to the course. Start learning whenever you're ready.
              </p>
            </div>

            <Button size="lg" variant="continue" onClick={handleAccessCourse} className="w-full text-lg py-6 mb-4">
              Go to Course
            </Button>

            <Button variant="ghost" onClick={handleLogout} className="w-full text-muted-foreground">
              Log out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Top Welcome Bar with Avatar and Logout */}
      <div className="bg-foreground/95 text-background py-2 sm:py-3 px-3 sm:px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Avatar className="h-7 w-7 sm:h-8 sm:w-8 border-2 border-accent/50">
              <AvatarFallback className="bg-accent text-accent-foreground text-xs sm:text-sm font-medium">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs sm:text-sm truncate max-w-[150px] sm:max-w-none">
              Welcome, <span className="font-medium">{getDisplayName()}</span>
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-background/80 hover:text-background hover:bg-background/10 text-xs sm:text-sm px-2 sm:px-3"
          >
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Log out</span>
          </Button>
        </div>
      </div>

      {/* Hero Section with AI Gradient */}
      <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/80 text-primary-foreground relative overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-accent/5 animate-pulse" />
        <div className="absolute top-0 right-0 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-accent/15 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 py-10 sm:py-14 md:py-20 lg:py-24 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="space-y-4 sm:space-y-6 text-center md:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight drop-shadow-sm">
                AI Simplified
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-primary-foreground/90 font-medium">
                For Everyday People and Business
              </p>

              {/* AI Typing Effect Container */}
              <div className="bg-foreground/10 backdrop-blur-md rounded-xl p-4 sm:p-5 border border-primary-foreground/20 shadow-lg">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-destructive/80"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400/80"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-success/80"></div>
                  <span className="ml-2 text-xs text-primary-foreground/60">AI Assistant</span>
                </div>
                <div className="font-mono text-base sm:text-lg text-primary-foreground/90 min-h-[1.5rem] sm:min-h-[1.75rem]">
                  <span className="text-accent">→</span> {displayedText}
                  <span className={`${showCursor ? "opacity-100" : "opacity-0"} transition-opacity`}>|</span>
                </div>
              </div>

              <p className="text-base sm:text-lg text-primary-foreground/80 leading-relaxed max-w-xl mx-auto md:mx-0">
                Learn to use AI confidently — without coding, hype, or overwhelm.
              </p>
              <p className="text-primary-foreground/60 text-xs sm:text-sm">
                One-time payment • Lifetime access • No subscriptions
              </p>
            </div>

            {/* Right Side - AI Journey Preview - Hidden on mobile */}
            <div className="hidden md:flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="bg-foreground/10 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-primary-foreground/20 shadow-xl">
                  <div className="text-center mb-6">
                    <span className="text-sm text-primary-foreground/60 uppercase tracking-wider">Your AI Journey</span>
                  </div>

                  <div className="space-y-4">
                    {[
                      { icon: Sparkles, label: "Curious Beginner" },
                      { icon: Brain, label: "Understanding AI" },
                      { icon: Zap, label: "Confident User" },
                    ].map((stage, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-primary-foreground/10">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary-foreground/20">
                          <stage.icon className="h-5 w-5" />
                        </div>
                        <span className="font-medium text-primary-foreground/80">{stage.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/30 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locked Course Preview Section */}
      <section className="bg-muted py-10 sm:py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6 sm:mb-10">
              <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4">
                <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm font-medium">Course Preview</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground">What's Inside</h2>
            </div>

            {/* Blurred Course Content */}
            <div className="relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 filter blur-sm select-none pointer-events-none">
                {courseModules.map((module) => (
                  <div
                    key={module.number}
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-background rounded-xl shadow-sm"
                  >
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="text-accent font-semibold text-sm sm:text-base">{module.number}</span>
                    </div>
                    <span className="text-foreground font-medium text-sm sm:text-base">{module.title}</span>
                  </div>
                ))}
              </div>

              {/* Lock Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-muted/80 via-transparent to-muted/80">
                <div className="bg-card/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-xl border border-border text-center max-w-[280px] sm:max-w-sm mx-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Lock className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Unlock Full Course</h3>
                  <p className="text-muted-foreground text-sm sm:text-base mb-3 sm:mb-4">
                    Complete your enrollment to access all 9 modules
                  </p>
                  <Button
                    variant="continue"
                    size="sm"
                    className="sm:text-base"
                    onClick={() => document.getElementById("payment")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    Enroll Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-background py-8 sm:py-10 md:py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-sm sm:max-w-md mx-auto">
            <div className="bg-card rounded-xl sm:rounded-2xl shadow-sm border border-border p-4 sm:p-6 text-center">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-1 sm:mb-2">Full Course Access</h2>
              <p className="text-muted-foreground text-sm mb-3 sm:mb-4">One-time payment • Lifetime access</p>
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">
                <strong>KES 2,500</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-secondary py-10 sm:py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {trustItems.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-4 sm:p-6 bg-background rounded-xl shadow-sm"
              >
                <div className="w-10 h-10 sm:w-12 md:w-14 sm:h-12 md:h-14 rounded-full bg-accent/10 flex items-center justify-center mb-3 sm:mb-4">
                  <item.icon className="h-5 w-5 sm:h-6 md:h-7 sm:w-6 md:w-7 text-accent" />
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground mb-1 sm:mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="bg-background py-10 sm:py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground text-center mb-6 sm:mb-8">
              What You'll Learn
            </h2>
            <div className="bg-card rounded-xl sm:rounded-2xl shadow-sm border border-border p-5 sm:p-6 md:p-8">
              <ul className="space-y-3 sm:space-y-4">
                {learningOutcomes.map((item, index) => (
                  <li key={index} className="flex items-start sm:items-center gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-accent/20 flex items-center justify-center mt-0.5 sm:mt-0">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
                    </div>
                    <span className="text-foreground text-sm sm:text-base md:text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="bg-secondary py-10 sm:py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground text-center mb-6 sm:mb-8">
              What's Included
            </h2>
            <div className="bg-card rounded-xl sm:rounded-2xl shadow-sm border border-border p-5 sm:p-6 md:p-8">
              <ul className="space-y-3 sm:space-y-4">
                {included.map((item, index) => (
                  <li key={index} className="flex items-start sm:items-center gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-accent/20 flex items-center justify-center mt-0.5 sm:mt-0">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
                    </div>
                    <span className="text-foreground text-sm sm:text-base md:text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Section */}
      <section id="payment" className="bg-background py-10 sm:py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-sm sm:max-w-md md:max-w-xl mx-auto space-y-4 sm:space-y-6">
            <div className="bg-card rounded-xl sm:rounded-2xl shadow-sm border border-border p-4 sm:p-6 md:p-8">
              <PaymentModeSelector plan="standard" userEmail={userEmail} userName={userName || userLastName} />
            </div>

            

            <div className="text-center">
              <Link to="/payment-help" className="text-primary hover:underline text-sm sm:text-base">
                Having trouble with payment? Click here for help.
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Paystack Verification Dialog */}
      <PaystackVerificationDialog
        open={showPaystackVerification}
        onOpenChange={setShowPaystackVerification}
        reference={paystackReference || undefined}
        userEmail={userEmail}
        userName={userName || userLastName}
      />
    </div>
  );
};

export default Enroll;
