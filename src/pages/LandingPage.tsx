import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Users, Lightbulb, Shield, Clock, Video, Code2, Check } from "lucide-react";
import confidentWomanImage from "@/assets/confident-woman-laptop.jpg";
import { Footer } from "@/components/homepage/Footer";

const services = [
  {
    icon: BookOpen,
    title: "Comprehensive AI Course",
    description: "9 carefully structured modules covering everything from AI basics to practical applications"
  },
  {
    icon: Users,
    title: "For Everyone",
    description: "Designed for professionals, business owners, teams, and everyday individuals"
  },
  {
    icon: Lightbulb,
    title: "Practical Learning",
    description: "Real-world examples and hands-on exercises you can apply immediately"
  },
  {
    icon: Shield,
    title: "Safe & Ethical",
    description: "Learn to use AI responsibly with built-in ethics and safety guidance"
  }
];

const features = [
  {
    icon: Code2,
    title: "No coding required",
    description: "Everything explained in plain language"
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
                Sign In
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
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="space-y-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
                AI Simplified
              </h1>
              <p className="text-xl md:text-2xl text-primary-foreground/90 font-medium">
                For Everyday People and Business
              </p>
              <p className="text-lg text-primary-foreground/80 leading-relaxed max-w-xl">
                AI Simplified is a practical, easy-to-follow course designed to help 
                everyday people and businesses understand and use AI confidently — 
                without coding, hype, or overwhelm.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/sign-up">
                  <Button 
                    size="lg" 
                    variant="continue"
                    className="text-lg px-8 w-full sm:w-auto"
                  >
                    Enroll Now — $29
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/log-in">
                  <Button 
                    size="lg" 
                    className="text-lg px-8 w-full sm:w-auto bg-transparent border-2 border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    Sign In
                  </Button>
                </Link>
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

      {/* Services Section */}
      <section className="bg-secondary py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
              What We Offer
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A complete learning experience designed to make AI accessible to everyone
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="flex flex-col items-center text-center p-6 bg-background rounded-xl shadow-sm"
              >
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <service.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-muted-foreground">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
              How You'll Learn
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex flex-col items-center text-center p-6"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Structure Section */}
      <section className="bg-secondary py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-3">
              Course Structure
            </h2>
            <p className="text-muted-foreground text-center text-lg mb-10">
              9 modules designed for progressive, stress-free learning
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
      <section id="pricing" className="bg-primary py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto text-center text-primary-foreground">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8">
              Join thousands of learners who are already using AI confidently.
            </p>
            
            <div className="text-5xl font-bold mb-2">
              $29
            </div>
            <p className="text-primary-foreground/70 mb-8">
              One-time payment • Lifetime access
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
              Already enrolled? Sign in to continue your learning journey.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
