import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Brain, Sparkles, Mail, User, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface QuizProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOTAL_STEPS = 8; // 7 questions + 1 results

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    rotateY: direction > 0 ? 15 : -15,
  }),
  center: {
    x: 0,
    opacity: 1,
    rotateY: 0,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    rotateY: direction > 0 ? -15 : 15,
  }),
};

export function AIReadinessQuiz({ isOpen, onClose }: QuizProps) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState({
    profession: "",
    comfortLevel: 5,
    repetitiveTask: "",
    currentAiUsage: "",
    valuesCertificate: "",
    hoursToSave: 5,
    name: "",
    email: "",
  });
  const [score, setScore] = useState<number | null>(null);

  const updateAnswer = (key: string, value: string | number | boolean) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const next = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const prev = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const calculateScore = () => {
    let s = 0;
    // Comfort level inverted (lower = more need)
    s += Math.max(0, 10 - answers.comfortLevel) * 2;
    // No current AI usage = higher need
    if (answers.currentAiUsage === "none") s += 20;
    else if (answers.currentAiUsage === "basic") s += 12;
    else s += 5;
    // Hours to save
    s += Math.min(answers.hoursToSave * 2, 20);
    // Values certificate
    if (answers.valuesCertificate === "yes") s += 10;
    // Normalize to 100
    return Math.min(Math.round((s / 70) * 100), 100);
  };

  const handleSubmit = async () => {
    if (!answers.name.trim() || !answers.email.trim()) {
      toast.error("Please enter your name and email");
      return;
    }
    setSubmitting(true);
    const readinessScore = calculateScore();
    setScore(readinessScore);

    try {
      await supabase.from("quiz_leads").insert({
        name: answers.name.trim(),
        email: answers.email.trim().toLowerCase(),
        profession: answers.profession,
        comfort_level: answers.comfortLevel,
        repetitive_task: answers.repetitiveTask,
        current_ai_usage: answers.currentAiUsage,
        values_certificate: answers.valuesCertificate === "yes",
        hours_to_save: answers.hoursToSave,
        readiness_score: readinessScore,
      });
    } catch {
      // Silently fail — still show results
    }

    setSubmitting(false);
    next();
  };

  const getScoreLabel = (s: number) => {
    if (s >= 75) return { label: "High Potential", color: "text-green-500", message: "You have a massive opportunity to transform your workflow with AI. This course is exactly what you need!" };
    if (s >= 45) return { label: "Growing Readiness", color: "text-yellow-500", message: "You're on the right track but there's significant room to level up. Our course will fill the gaps." };
    return { label: "AI Explorer", color: "text-blue-500", message: "You're already comfortable with AI! Our course will help you master advanced techniques and earn your certificate." };
  };

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-foreground">What is your primary profession or industry?</h3>
            <p className="text-sm text-muted-foreground">This helps us personalize your AI recommendations.</p>
            <RadioGroup value={answers.profession} onValueChange={(v) => updateAnswer("profession", v)} className="space-y-3">
              {["Business Owner / Entrepreneur", "Marketing / Sales", "Education / Training", "Healthcare", "Finance / Accounting", "Technology / IT", "Other"].map((opt) => (
                <Label key={opt} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-all hover:bg-primary/5">
                  <RadioGroupItem value={opt} />
                  <span className="text-sm">{opt}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>
        );
      case 1:
        return (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-foreground">How comfortable are you using AI tools like ChatGPT?</h3>
            <p className="text-sm text-muted-foreground">1 = Never used AI &nbsp;|&nbsp; 10 = Power user</p>
            <div className="flex items-center gap-2 flex-wrap justify-center pt-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => updateAnswer("comfortLevel", n)}
                  className={`w-11 h-11 rounded-xl text-sm font-bold transition-all duration-200 ${
                    answers.comfortLevel === n
                      ? "bg-primary text-primary-foreground scale-110 shadow-lg"
                      : "bg-secondary text-foreground hover:bg-primary/20 hover:scale-105"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-center text-sm font-medium text-primary">Your level: {answers.comfortLevel}/10</p>
          </div>
        );
      case 2:
        return (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-foreground">What's the #1 repetitive task that eats up your work week?</h3>
            <p className="text-sm text-muted-foreground">AI can automate many common tasks. Let's find your biggest time-saver.</p>
            <Textarea
              value={answers.repetitiveTask}
              onChange={(e) => updateAnswer("repetitiveTask", e.target.value)}
              placeholder="e.g., Writing emails, creating reports, scheduling meetings..."
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-foreground">Are you currently using AI for any of these?</h3>
            <RadioGroup value={answers.currentAiUsage} onValueChange={(v) => updateAnswer("currentAiUsage", v)} className="space-y-3">
              {[
                { value: "none", label: "I'm not using AI at all yet" },
                { value: "basic", label: "Basic use (ChatGPT for simple questions)" },
                { value: "moderate", label: "Content generation or data analysis" },
                { value: "advanced", label: "Multiple AI tools integrated into my workflow" },
              ].map((opt) => (
                <Label key={opt.value} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-all hover:bg-primary/5">
                  <RadioGroupItem value={opt.value} />
                  <span className="text-sm">{opt.label}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>
        );
      case 4:
        return (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-foreground">Would a Certificate of AI Proficiency help your career?</h3>
            <p className="text-sm text-muted-foreground">Stand out to employers and clients with verified AI skills.</p>
            <RadioGroup value={answers.valuesCertificate} onValueChange={(v) => updateAnswer("valuesCertificate", v)} className="space-y-3">
              {[
                { value: "yes", label: "Yes, it would boost my credibility" },
                { value: "maybe", label: "Maybe, I'd like to learn more" },
                { value: "no", label: "Not a priority right now" },
              ].map((opt) => (
                <Label key={opt.value} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-all hover:bg-primary/5">
                  <RadioGroupItem value={opt.value} />
                  <span className="text-sm">{opt.label}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>
        );
      case 5:
        return (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-foreground">How many hours per week would you like to save with AI?</h3>
            <p className="text-sm text-muted-foreground">Most professionals save 5–15 hours per week after our course.</p>
            <div className="flex items-center gap-2 flex-wrap justify-center pt-4">
              {[1, 2, 3, 5, 8, 10, 15, 20].map((n) => (
                <button
                  key={n}
                  onClick={() => updateAnswer("hoursToSave", n)}
                  className={`px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                    answers.hoursToSave === n
                      ? "bg-primary text-primary-foreground scale-110 shadow-lg"
                      : "bg-secondary text-foreground hover:bg-primary/20 hover:scale-105"
                  }`}
                >
                  {n}h
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              That's <span className="font-bold text-primary">{answers.hoursToSave * 4} hours/month</span> you could reclaim!
            </p>
          </div>
        );
      case 6:
        return (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-foreground">Where should we send your AI Readiness Score?</h3>
            <p className="text-sm text-muted-foreground">Enter your details to get your personalized results and free roadmap.</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quiz-name" className="flex items-center gap-2 text-sm font-medium">
                  <User className="h-4 w-4 text-primary" /> Your Name
                </Label>
                <Input
                  id="quiz-name"
                  value={answers.name}
                  onChange={(e) => updateAnswer("name", e.target.value)}
                  placeholder="Enter your full name"
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quiz-email" className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="h-4 w-4 text-primary" /> Email Address
                </Label>
                <Input
                  id="quiz-email"
                  type="email"
                  value={answers.email}
                  onChange={(e) => updateAnswer("email", e.target.value)}
                  placeholder="you@example.com"
                  maxLength={255}
                />
              </div>
            </div>
          </div>
        );
      case 7:
        if (score === null) return null;
        const info = getScoreLabel(score);
        return (
          <div className="space-y-6 text-center">
            <motion.div
              initial={{ scale: 0, rotateZ: -180 }}
              animate={{ scale: 1, rotateZ: 0 }}
              transition={{ type: "spring", duration: 0.8, bounce: 0.4 }}
              className="mx-auto w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <span className="text-3xl font-bold text-primary">{score}%</span>
            </motion.div>
            <div>
              <p className={`text-lg font-bold ${info.color}`}>{info.label}</p>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{info.message}</p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 rounded-xl bg-accent/10 border border-accent/20"
            >
              <Sparkles className="h-5 w-5 text-accent mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground">Limited-Time Offer</p>
              <p className="text-xs text-muted-foreground mt-1">
                Enroll now and start your AI journey for just <strong className="text-primary">KES 2,500</strong> — one-time, lifetime access.
              </p>
            </motion.div>
            <div className="flex flex-col gap-3">
              <Link to="/sign-up" onClick={onClose}>
                <Button variant="continue" className="w-full h-12 text-base">
                  Enroll Now & Transform Your Career
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" onClick={onClose} className="text-sm">
                Maybe later
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0: return !!answers.profession;
      case 1: return true;
      case 2: return !!answers.repetitiveTask.trim();
      case 3: return !!answers.currentAiUsage;
      case 4: return !!answers.valuesCertificate;
      case 5: return true;
      case 6: return !!answers.name.trim() && !!answers.email.trim();
      default: return false;
    }
  };

  const handleClose = () => {
    setStep(0);
    setScore(null);
    setAnswers({ profession: "", comfortLevel: 5, repetitiveTask: "", currentAiUsage: "", valuesCertificate: "", hoursToSave: 5, name: "", email: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0 gap-0 border-none" style={{ perspective: "1000px" }}>
        {/* Header */}
        <div className="p-5 pb-3 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">AI Readiness Assessment</h2>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            {step < 7 ? `Question ${step + 1} of 7` : "Your Results"}
          </p>
        </div>

        {/* Content */}
        <div className="p-5 min-h-[320px] flex items-start">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full"
              style={{ transformStyle: "preserve-3d" }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        {step < 7 && (
          <div className="p-5 pt-3 border-t border-border flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={prev} disabled={step === 0} className="gap-1">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            {step < 6 ? (
              <Button onClick={next} disabled={!canProceed()} className="gap-1">
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!canProceed() || submitting} className="gap-1">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                {submitting ? "Processing..." : "Get My Score"}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
