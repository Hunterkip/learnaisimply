import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Lock, BookOpen, Code2, Clock, Video, Lightbulb, ArrowRight } from "lucide-react";
import confidentWomanImage from "@/assets/confident-woman-laptop.jpg";

const included = [
  "Full course access (all 9 modules)",
  "Video + audio lessons",
  "Written lesson notes",
  "Lifetime access"
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

const PAYPAL_PAYMENT_LINK = "https://www.paypal.com/ncp/payment/4ZXYM57QPZW94";

const Enroll = () => {
  const navigate = useNavigate();
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handlePayment = () => {
    window.location.href = PAYPAL_PAYMENT_LINK;
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
      {/* Hero Section - Matching Homepage */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="space-y-6">
              <p className="text-primary-foreground/70 text-sm">
                Welcome back, <span className="text-primary-foreground">{userEmail}</span>
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
                AI for Adults 40+
              </h1>
              <p className="text-xl md:text-2xl text-primary-foreground/90 font-medium">
                A Practical Guide to Using AI at Work and in Life
              </p>
              <p className="text-lg text-primary-foreground/80 leading-relaxed max-w-xl">
                Use AI confidently — without fear, hype, or technical complexity.
                This course is designed for adults aged 40 and above who want to 
                understand and use AI calmly and practically in work and everyday life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  variant="continue"
                  onClick={handlePayment}
                  className="text-lg px-8"
                >
                  Enroll Now — $97
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <p className="text-primary-foreground/60 text-sm">
                One-time payment • Lifetime access • No subscriptions
              </p>
            </div>

            {/* Right Side - Image */}
            <div className="hidden md:flex justify-center">
              <div className="relative w-full max-w-md">
                <img 
                  src={confidentWomanImage} 
                  alt="Confident professional woman using a laptop"
                  className="rounded-2xl shadow-lg w-full h-auto object-cover"
                />
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/15 rounded-full blur-3xl"></div>
              </div>
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

      {/* Course Structure Section */}
      <section className="bg-secondary py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-3">
              How the Course Is Structured
            </h2>
            <p className="text-muted-foreground text-center text-lg mb-10">
              Short lessons. Clear explanations. No pressure.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="bg-background py-16 md:py-20">
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

      {/* Final CTA Section */}
      <section className="bg-secondary py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Get lifetime access to all course materials for a one-time payment.
            </p>
            
            <div className="text-5xl font-bold text-foreground mb-2">
              $97
            </div>
            <p className="text-muted-foreground mb-8">
              One-time payment
            </p>

            <Button 
              size="lg" 
              variant="continue"
              onClick={handlePayment}
              className="w-full max-w-sm text-lg py-6 mb-4"
            >
              Enroll Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
              <Lock className="h-4 w-4" />
              <span>Secure checkout via PayPal</span>
            </div>

            <div className="max-w-md mx-auto space-y-4">
              <p className="text-muted-foreground text-base leading-relaxed">
                After completing payment on PayPal, please return to this website and log in using the email you registered with to access your course. If you need assistance, WhatsApp support is available.
              </p>
              <Link 
                to="/payment-help" 
                className="text-primary hover:underline text-base inline-block"
              >
                Having trouble after payment? Click here for help.
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Logout Footer */}
      <div className="bg-background py-8 text-center border-t border-border">
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="text-muted-foreground"
        >
          Log out
        </Button>
      </div>
    </div>
  );
};

export default Enroll;
