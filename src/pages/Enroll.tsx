import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, BookOpen, Code2, Clock, Video, Lightbulb, Lock, LogOut, Sparkles, Brain, Zap } from "lucide-react";
import { PaymentModeSelector } from "@/components/payment/PaymentModeSelector";
import { PaystackVerificationDialog } from "@/components/payment/PaystackVerificationDialog";
import { useToast } from "@/hooks/use-toast";

const included = [
  "Full course access (all 9 modules)",
  "Video + audio lessons",
  "Written lesson notes",
  "Lifetime access",
  "No subscriptions"
];

const trustItems = [
  {
    icon: Code2,
    title: "No coding required",
    description: "Everything is explained in plain language"
  },
  {
    icon: Clock,
    title: "Learn at your own pace",
    description: "Take your time with each lesson"
  },
  {
    icon: Video,
    title: "Video + audio lessons",
    description: "Watch, listen, or read — your choice"
  },
  {
    icon: Lightbulb,
    title: "Practical examples",
    description: "Real-life situations you'll recognize"
  }
];

const learningOutcomes = [
  "How AI works (without technical language)",
  "How to write clearer emails and documents",
  "How to plan, organize, and research with AI",
  "How to use AI for everyday life tasks",
  "How to use AI responsibly and safely"
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
  { number: 8, title: "Course Wrap-Up" }
];

const typingTexts = [
  "Write emails that connect...",
  "Research topics in seconds...",
  "Plan your day smarter...",
  "Create content effortlessly..."
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
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/log-in");
        return;
      }

      // Check if email is verified
      const { data: profile } = await supabase
        .from("profiles")
        .select("has_access, plan, first_name, last_name")
        .eq("id", session.user.id)
        .single();

      if (!session.user.email_confirmed_at) {
        // Email not verified, redirect to verification page
        navigate(`/email-verification?email=${encodeURIComponent(session.user.email || "")}`);
        return;
      }

      setUserEmail(session.user.email || "");

      // Update profile email if needed
      if (session.user.email) {
        await supabase
          .from("profiles")
          .update({ email: session.user.email })
          .eq("id", session.user.id);
      }

      if (profile) {
        if (profile.has_access) {
          setHasAccess(true);
          // Redirect to dashboard directly instead of showing dialogue
          setTimeout(() => {
            navigate("/dashboard");
          }, 500);
          return;
        }
        if (profile.first_name) {
          setUserName(profile.first_name);
        }
        if (profile.last_name) {
          setUserLastName(profile.last_name);
        }
      }

      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/log-in");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);


  const handleAccessCourse = () => {
    navigate("/course");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
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
    <div className="min-h-screen">
      {/* Top Welcome Bar with Avatar and Logout */}
      <div className="bg-foreground/95 text-background py-3 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border-2 border-accent/50">
              <AvatarFallback className="bg-accent text-accent-foreground text-sm font-medium">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">
              Welcome back, <span className="font-medium">{getDisplayName()}</span>
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLogout}
            className="text-background/80 hover:text-background hover:bg-background/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log out
          </Button>
        </div>
      </div>

      {/* Hero Section with AI Gradient */}
      <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/80 text-primary-foreground relative overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-accent/5 animate-pulse" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/15 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="space-y-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight drop-shadow-sm">
                AI Simplified
              </h1>
              <p className="text-xl md:text-2xl text-primary-foreground/90 font-medium">
                For Everyday People and Business
              </p>
              
              {/* AI Typing Effect Container */}
              <div className="bg-foreground/10 backdrop-blur-md rounded-xl p-5 border border-primary-foreground/20 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-destructive/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                  <div className="w-3 h-3 rounded-full bg-success/80"></div>
                  <span className="ml-2 text-xs text-primary-foreground/60">AI Assistant</span>
                </div>
                <div className="font-mono text-lg text-primary-foreground/90 min-h-[1.75rem]">
                  <span className="text-accent">→</span> {displayedText}
                  <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
                </div>
              </div>

              <p className="text-lg text-primary-foreground/80 leading-relaxed max-w-xl">
                Learn to use AI confidently — without coding, hype, or overwhelm.
              </p>
              <p className="text-primary-foreground/60 text-sm">
                One-time payment • Lifetime access • No subscriptions
              </p>
            </div>

            {/* Right Side - AI Journey Preview */}
            <div className="hidden md:flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="bg-foreground/10 backdrop-blur-md rounded-2xl p-8 border border-primary-foreground/20 shadow-xl">
                  <div className="text-center mb-6">
                    <span className="text-sm text-primary-foreground/60 uppercase tracking-wider">Your AI Journey</span>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { icon: Sparkles, label: "Curious Beginner" },
                      { icon: Brain, label: "Understanding AI" },
                      { icon: Zap, label: "Confident User" }
                    ].map((stage, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-4 p-3 rounded-lg bg-primary-foreground/10"
                      >
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary-foreground/20">
                          <stage.icon className="h-5 w-5" />
                        </div>
                        <span className="font-medium text-primary-foreground/80">
                          {stage.label}
                        </span>
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
      <section className="bg-muted py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full mb-4">
                <Lock className="h-4 w-4" />
                <span className="text-sm font-medium">Course Preview</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
                What's Inside
              </h2>
            </div>
            
            {/* Blurred Course Content */}
            <div className="relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 filter blur-sm select-none pointer-events-none">
                {courseModules.map((module) => (
                  <div 
                    key={module.number}
                    className="flex items-center gap-4 p-4 bg-background rounded-xl shadow-sm"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="text-accent font-semibold">{module.number}</span>
                    </div>
                    <span className="text-foreground font-medium">{module.title}</span>
                  </div>
                ))}
              </div>
              
              {/* Lock Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-muted/80 via-transparent to-muted/80">
                <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-border text-center max-w-sm">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Unlock Full Course
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Complete your enrollment to access all 9 modules
                  </p>
                  <Button 
                    variant="continue" 
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
      <section className="bg-background py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 text-center">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Full Course Access
              </h2>
              <p className="text-muted-foreground mb-4">One-time payment • Lifetime access</p>
              <div className="text-4xl font-bold text-primary mb-1">KES 1</div>
              <div className="text-muted-foreground">≈ $1 USD</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-secondary py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustItems.map((item, index) => (
              <div 
                key={index}
                className="flex flex-col items-center text-center p-6 bg-background rounded-xl shadow-sm"
              >
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <item.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-8">
              What You'll Learn
            </h2>
            <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
              <ul className="space-y-4">
                {learningOutcomes.map((item, index) => (
                  <li key={index} className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                      <Check className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-foreground text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="bg-secondary py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-8">
              What's Included
            </h2>
            <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
              <ul className="space-y-4">
                {included.map((item, index) => (
                  <li key={index} className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                      <Check className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-foreground text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Section */}
      <section id="payment" className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 md:p-8">
              <PaymentModeSelector
                plan="standard"
                userEmail={userEmail}
                userName={userName || userLastName}
              />
            </div>

            <div className="mt-6 text-center">
              <Link 
                to="/payment-help" 
                className="text-primary hover:underline text-base"
              >
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
