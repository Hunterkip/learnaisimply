import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Brain, CheckCircle2, Trophy, Sparkles, Target, User, Mail } from "lucide-react";
import { GlowCard } from "@/components/ui/spotlight-card";

interface Question {
  id: string;
  question: string;
  options: { label: string; value: number }[];
  category: string;
}

const questions: Question[] = [
  {
    id: "q1",
    category: "AI Awareness",
    question: "How familiar are you with AI tools like ChatGPT, Copilot, or Gemini?",
    options: [
      { label: "I've never used any AI tool before", value: 1 },
      { label: "I've heard of them but haven't really tried them", value: 2 },
      { label: "I've experimented a few times with basic prompts", value: 3 },
      { label: "I use AI tools regularly in my work or daily life", value: 4 },
    ],
  },
  {
    id: "q2",
    category: "Practical Application",
    question: "How much of your daily work involves repetitive tasks that could be automated?",
    options: [
      { label: "I'm not sure what could be automated", value: 1 },
      { label: "A little — mostly simple things like emails or scheduling", value: 2 },
      { label: "Quite a bit — reports, data entry, content creation", value: 3 },
      { label: "A lot — I already know exactly what needs automating", value: 4 },
    ],
  },
  {
    id: "q3",
    category: "Learning Readiness",
    question: "What's your main goal for learning AI?",
    options: [
      { label: "I just want to understand what AI is all about", value: 1 },
      { label: "I want to use AI to save time on everyday tasks", value: 2 },
      { label: "I want to boost my career or business with AI skills", value: 3 },
      { label: "I want to master AI tools and automate my workflows", value: 4 },
    ],
  },
];

const getReadinessLevel = (percent: number) => {
  if (percent < 30) return { level: "Beginner", color: "text-destructive", desc: "You're at the start of your AI journey. Our course is designed exactly for people like you — no experience needed." };
  if (percent < 55) return { level: "Intermediate", color: "text-yellow-500", desc: "You have some AI awareness. Our course will fill critical gaps and give you practical, hands-on skills." };
  if (percent < 80) return { level: "Advanced", color: "text-accent", desc: "You have solid AI knowledge. Our course will help you master advanced techniques and automation strategies." };
  return { level: "AI Ready", color: "text-success", desc: "You're well-versed in AI! Our course can sharpen your edge with professional-grade workflows and certification." };
};

export default function Assessment() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const totalSteps = questions.length + 1; // questions + lead capture
  const progress = ((currentStep + 1) / (totalSteps + 1)) * 100;

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    // Auto-advance after selection
    setTimeout(() => {
      if (currentStep < questions.length) {
        setCurrentStep((prev) => prev + 1);
      }
    }, 300);
  };

  const calculateScore = () => {
    const totalPossible = questions.length * 4;
    const totalScore = Object.values(answers).reduce((sum, v) => sum + v, 0);
    return Math.round((totalScore / totalPossible) * 100);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      toast({ title: "Please enter a valid email", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const calculatedScore = calculateScore();
    setScore(calculatedScore);
    const readiness = getReadinessLevel(calculatedScore);

    try {
      // Upsert to handle duplicate emails
      const { error } = await supabase.from("quiz_leads").upsert(
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          readiness_score: calculatedScore,
          readiness_level: readiness.level,
          profession: null,
          comfort_level: answers["q2"] || null,
          repetitive_task: null,
          current_ai_usage: null,
          values_certificate: null,
          hours_to_save: null,
          status: "unregistered",
        },
        { onConflict: "email", ignoreDuplicates: false }
      );

      if (error) {
        // If upsert fails (no unique constraint), try insert
        await supabase.from("quiz_leads").insert({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          readiness_score: calculatedScore,
          readiness_level: readiness.level,
          status: "unregistered",
        });
      }

      setShowResults(true);
    } catch (err) {
      console.error("Error saving assessment:", err);
      // Still show results even if save fails
      setShowResults(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const readiness = getReadinessLevel(score);

  if (showResults) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Minimal branding only */}
        <div className="bg-card border-b border-border px-4 py-4">
          <div className="container mx-auto text-center">
            <span className="text-lg font-bold text-foreground">AI Simplified</span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg"
          >
            <div className="bg-card rounded-2xl shadow-xl border border-border p-8 md:p-10 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <Trophy className="h-10 w-10 text-accent" />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Your AI Readiness Score</h1>
                <div className="text-6xl font-extrabold text-accent my-4">{score}%</div>
                <div className={`text-xl font-semibold ${readiness.color}`}>
                  {readiness.level}
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">{readiness.desc}</p>

              <div className="space-y-3 pt-4">
                <Button
                  size="lg"
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-14 text-base"
                  onClick={() => navigate("/sign-up")}
                >
                  Sign Up & Start Learning
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full h-14 text-base"
                  onClick={() => navigate("/log-in")}
                >
                  Already have an account? Sign In
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal branding only - no navigation during assessment */}
      <div className="bg-card border-b border-border px-4 py-4">
        <div className="container mx-auto text-center">
          <span className="text-lg font-bold text-foreground">AI Simplified</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Progress */}
        <div className="bg-card border-b border-border px-4 py-3">
          <div className="container mx-auto max-w-2xl">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>AI Readiness Assessment</span>
              <span>{currentStep + 1} of {totalSteps}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait">
              {currentStep < questions.length ? (
                <motion.div
                  key={`q-${currentStep}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div>
                    <span className="text-xs font-medium text-accent uppercase tracking-wider">
                      {questions[currentStep].category}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-2">
                      {questions[currentStep].question}
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {questions[currentStep].options.map((option) => {
                      const isSelected = answers[questions[currentStep].id] === option.value;
                      return (
                        <GlowCard
                          key={option.value}
                          glowColor="green"
                          customSize
                          className={`cursor-pointer transition-all duration-200 !p-0 !gap-0 !grid-rows-1 ${
                            isSelected
                              ? "!border-accent !bg-accent/5 shadow-sm"
                              : "hover:!border-accent/30"
                          }`}
                        >
                          <button
                            onClick={() => handleAnswer(questions[currentStep].id, option.value)}
                            className="w-full text-left p-4"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                isSelected ? "border-accent bg-accent" : "border-muted-foreground/30"
                              }`}>
                                {isSelected && <CheckCircle2 className="h-3 w-3 text-accent-foreground" />}
                              </div>
                              <span className={`text-sm md:text-base ${isSelected ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                                {option.label}
                              </span>
                            </div>
                          </button>
                        </GlowCard>
                      );
                    })}
                  </div>

                  {currentStep > 0 && (
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentStep((prev) => prev - 1)}
                      className="text-muted-foreground"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="lead-capture"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                      <Sparkles className="h-8 w-8 text-accent" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                      Your results are ready!
                    </h2>
                    <p className="text-muted-foreground text-lg">
                      Enter your details to see your personalized AI Readiness Score.
                    </p>
                  </div>

                  <div className="space-y-4 max-w-sm mx-auto">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="h-12"
                      />
                    </div>

                    <Button
                      size="lg"
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-14 text-base mt-4"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Calculating..." : "Check My Score"}
                      {!isSubmitting && <Target className="ml-2 h-5 w-5" />}
                    </Button>
                  </div>

                  <div className="text-center">
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentStep((prev) => prev - 1)}
                      className="text-muted-foreground"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      
    </div>
  );
}
