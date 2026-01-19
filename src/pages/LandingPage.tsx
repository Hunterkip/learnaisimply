import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock, Video, Shield, Star, Check, ArrowRight } from "lucide-react";
import { Footer } from "@/components/homepage/Footer";

const features = [
  {
    icon: Clock,
    title: "Self-Paced",
    description: "Access anytime, take as long as you need."
  },
  {
    icon: Video,
    title: "Multi-Format",
    description: "Watch, listen, or read — your choice."
  },
  {
    icon: Shield,
    title: "No Experience",
    description: "Prior technical knowledge is not required."
  },
  {
    icon: Star,
    title: "Lifetime Access",
    description: "No deadlines. Your course never expires."
  }
];

const standardFeatures = [
  "All 9 Modules",
  "Audio/Video Versions",
  "Written Notes",
  "Certificate"
];

const masteryFeatures = [
  "All Modules",
  "Gemini Tutor Pro",
  "Priority Support",
  "Lifetime Updates",
  "Community Access"
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="bg-primary text-primary-foreground py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="text-xl font-semibold">AI Simplified</div>
          <div className="flex items-center gap-4">
            <Link to="/log-in">
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">
                Log In
              </Button>
            </Link>
            <Link to="/sign-up">
              <Button variant="continue" size="sm">
                Enroll Now
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight mb-4">
            AI Simplified
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 font-medium mb-6">
            For Everyday People and Business
          </p>
          <p className="text-lg text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto mb-8">
            A practical, easy-to-follow course designed to help everyday people and businesses 
            understand and use AI confidently — without coding, hype, or overwhelm.
          </p>
          <Link to="/sign-up">
            <Button 
              size="lg" 
              variant="continue"
              className="text-lg px-8"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-background py-12 md:py-16 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-primary mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-secondary py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Choose Your Learning Path
            </h2>
            <p className="text-muted-foreground text-lg">
              Select the plan that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Standard Path */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Standard Path
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-primary">KSH 2,500</span>
                <span className="text-muted-foreground ml-2">/ $20</span>
              </div>
              <ul className="space-y-4 mb-8">
                {standardFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-accent" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/sign-up?plan=standard">
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-base border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Enroll as Standard Path
                </Button>
              </Link>
            </div>

            {/* Mastery Path */}
            <div className="bg-card rounded-2xl shadow-sm border-2 border-primary p-8 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  RECOMMENDED
                </span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Mastery Path
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-primary">KSH 5,000</span>
                <span className="text-muted-foreground ml-2">/ $40</span>
              </div>
              <ul className="space-y-4 mb-8">
                {masteryFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-accent" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/sign-up?plan=mastery">
                <Button 
                  variant="continue"
                  className="w-full h-12 text-base"
                >
                  Enroll as Mastery Path
                </Button>
              </Link>
            </div>
          </div>

          <p className="text-center text-muted-foreground mt-8 text-sm">
            Already enrolled? <Link to="/log-in" className="text-primary hover:underline">Sign in</Link> to continue your learning journey.
          </p>
        </div>
      </section>

      {/* Who Is This For Section */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
              Who Is This Course For?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              This course is designed for professionals, business owners, teams, and everyday individuals 
              who want to use AI practically in work and daily life — without needing a technical background.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {["Business Owners", "Professionals", "Teams", "Everyday Individuals"].map((audience) => (
                <span 
                  key={audience}
                  className="px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium"
                >
                  {audience}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto text-center text-primary-foreground">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8">
              Join thousands of learners who are already using AI confidently.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/sign-up">
                <Button 
                  size="lg" 
                  variant="continue"
                  className="w-full sm:w-auto text-lg px-8"
                >
                  Enroll Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/log-in">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-lg px-8 bg-transparent border-2 border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Sign In
                </Button>
              </Link>
            </div>

            <p className="text-primary-foreground/60 text-sm mt-6">
              One-time payment • Lifetime access • No subscriptions
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
