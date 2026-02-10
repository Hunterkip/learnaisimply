import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BookOpen, 
  Play, 
  CheckCircle2, 
  Trophy,
  Sparkles,
  Brain
} from "lucide-react";
import { courseModules } from "@/data/courseData";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/homepage/Footer";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  
  // Animation states
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [currentStage, setCurrentStage] = useState(0);

  const aiPhrases = [
    "Writing emails effortlessly...",
    "Creating content in seconds...",
    "Making smarter decisions...",
    "Boosting productivity daily...",
  ];

  const progressStages = [
    { label: "Beginner", icon: "🌱" },
    { label: "Explorer", icon: "🔍" },
    { label: "Learner", icon: "📚" },
    { label: "Confident", icon: "💪" },
    { label: "Pro User", icon: "🚀" },
  ];

  // Calculate all lessons and progress
  const allLessons = useMemo(() => {
    return courseModules.flatMap((module) => module.lessons);
  }, []);

  const progressPercent = useMemo(() => {
    return Math.round((completedLessons.length / allLessons.length) * 100);
  }, [completedLessons, allLessons]);

  const completedModules = useMemo(() => {
    return courseModules.filter(module => 
      module.lessons.every(lesson => completedLessons.includes(lesson.id))
    ).length;
  }, [completedLessons]);

  // Typing animation effect
  useEffect(() => {
    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let timeout: NodeJS.Timeout;

    const type = () => {
      const currentPhrase = aiPhrases[currentPhraseIndex];

      if (!isDeleting) {
        setDisplayedText(currentPhrase.slice(0, currentCharIndex + 1));
        currentCharIndex++;

        if (currentCharIndex === currentPhrase.length) {
          isDeleting = true;
          timeout = setTimeout(type, 2000);
          return;
        }
      } else {
        setDisplayedText(currentPhrase.slice(0, currentCharIndex - 1));
        currentCharIndex--;

        if (currentCharIndex === 0) {
          isDeleting = false;
          currentPhraseIndex = (currentPhraseIndex + 1) % aiPhrases.length;
        }
      }

      timeout = setTimeout(type, isDeleting ? 30 : 80);
    };

    timeout = setTimeout(type, 500);
    return () => clearTimeout(timeout);
  }, []);

  // Progress stage animation
  useEffect(() => {
    const stageFromProgress = Math.floor((progressPercent / 100) * (progressStages.length - 1));
    
    const interval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < stageFromProgress) return prev + 1;
        return prev;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [progressPercent]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/log-in");
        return;
      }

      setUserEmail(session.user.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("has_access, plan, first_name, last_name")
        .eq("id", session.user.id)
        .single();

      if (profile?.first_name && profile?.last_name) {
        setFirstName(profile.first_name);
        setLastName(profile.last_name);
        setUserName(`${profile.first_name} ${profile.last_name}`);
      } else {
        setUserName(session.user.email?.split("@")[0] || "Learner");
      }

      if (!profile?.has_access) {
        navigate("/enroll");
        return;
      }

      setHasAccess(true);
      
      // Load completed lessons from localStorage
      const savedProgress = localStorage.getItem("completedLessons");
      if (savedProgress) {
        setCompletedLessons(JSON.parse(savedProgress));
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  // Logout is now handled by the Navbar component

  const getInitials = (email: string) => {
    return email.slice(0, 2).toUpperCase();
  };

  const getProgressLevel = () => {
    if (progressPercent === 0) return "Getting Started";
    if (progressPercent < 25) return "Curious Beginner";
    if (progressPercent < 50) return "Active Learner";
    if (progressPercent < 75) return "Confident User";
    if (progressPercent < 100) return "Almost There!";
    return "AI Pro";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Animated Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground py-12 px-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Welcome Message */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm">
                <Sparkles className="h-4 w-4" />
                <span>Welcome back!</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                Hello, {userName}! 👋
              </h1>
              
              <p className="text-lg text-primary-foreground/80">
                Continue your AI journey and master the skills that matter.
              </p>

              {/* Typing Animation */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-sm text-primary-foreground/60 mb-2">With AI, you're now...</p>
                <p className="text-xl font-medium h-8">
                  {displayedText}
                  <span className="animate-pulse">|</span>
                </p>
              </div>

              <Button 
                size="lg"
                variant="continue"
                onClick={() => navigate("/course")}
                className="text-lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Continue Learning
              </Button>
            </div>

            {/* AI Progress Journey Visualization */}
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold mb-6 text-center">Your AI Journey</h3>
                
                {/* Progress Stages */}
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-6 left-0 right-0 h-1 bg-white/20 rounded-full">
                    <div 
                      className="h-full bg-accent rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${(currentStage / (progressStages.length - 1)) * 100}%` }}
                    />
                  </div>

                  {/* Stage Points */}
                  <div className="flex justify-between relative">
                    {progressStages.map((stage, index) => (
                      <div 
                        key={stage.label}
                        className={`flex flex-col items-center transition-all duration-500 ${
                          index <= currentStage ? 'opacity-100' : 'opacity-40'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 transition-all duration-300 ${
                          index <= currentStage 
                            ? 'bg-accent scale-110' 
                            : 'bg-white/20'
                        }`}>
                          {stage.icon}
                        </div>
                        <span className="text-xs text-center font-medium">{stage.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current Status */}
                <div className="mt-8 text-center p-4 bg-white/5 rounded-xl">
                  <p className="text-sm text-primary-foreground/70">Current Level</p>
                  <p className="text-2xl font-bold flex items-center justify-center gap-2">
                    <Trophy className="h-6 w-6 text-accent" />
                    {getProgressLevel()}
                  </p>
                  <p className="text-sm text-primary-foreground/60 mt-1">
                    {progressPercent}% Complete
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        {/* Progress Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Main Progress Card */}
          <div className="md:col-span-2 bg-card rounded-2xl shadow-sm border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Your Progress</h2>
                <p className="text-muted-foreground text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  {getProgressLevel()}
                </p>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Course Completion</span>
                <span className="font-medium text-foreground">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-3" />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{completedLessons.length}</div>
                <div className="text-xs text-muted-foreground">Lessons Done</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{completedModules}</div>
                <div className="text-xs text-muted-foreground">Modules Complete</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{allLessons.length - completedLessons.length}</div>
                <div className="text-xs text-muted-foreground">Lessons Left</div>
              </div>
            </div>
          </div>

          {/* Quick Action Card */}
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-sm p-6 text-primary-foreground">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Play className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-semibold">Continue Learning</h2>
            </div>
            <p className="text-primary-foreground/80 text-sm mb-6">
              Pick up where you left off and keep building your AI skills.
            </p>
            <Button 
              variant="continue" 
              className="w-full"
              onClick={() => navigate("/course")}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Go to Course
            </Button>
          </div>
        </div>

        {/* Module Progress */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Module Progress</h2>
          <div className="space-y-4">
            {courseModules.map((module) => {
              const moduleLessons = module.lessons;
              const completedInModule = moduleLessons.filter(l => completedLessons.includes(l.id)).length;
              const modulePercent = Math.round((completedInModule / moduleLessons.length) * 100);
              const isComplete = modulePercent === 100;

              return (
                <div 
                  key={module.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isComplete ? 'bg-success text-success-foreground' : 'bg-muted'
                  }`}>
                    {isComplete ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium text-muted-foreground">{module.id.split('-')[0]}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-foreground truncate">{module.title}</h3>
                      <span className="text-sm text-muted-foreground ml-2">
                        {completedInModule}/{moduleLessons.length}
                      </span>
                    </div>
                    <Progress value={modulePercent} className="h-2" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserDashboard;
