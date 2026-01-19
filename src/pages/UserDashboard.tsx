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
  Clock, 
  Trophy,
  LogOut,
  Sparkles
} from "lucide-react";
import { courseModules } from "@/data/courseData";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

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

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/log-in");
        return;
      }

      setUserEmail(session.user.email || "");
      setUserName(session.user.email?.split("@")[0] || "Learner");

      const { data: profile } = await supabase
        .from("profiles")
        .select("has_access, plan")
        .eq("id", session.user.id)
        .single();

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-primary-foreground/30">
              <AvatarImage src="" />
              <AvatarFallback className="bg-accent text-accent-foreground text-lg font-semibold">
                {getInitials(userEmail)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-semibold">Welcome back, {userName}!</h1>
              <p className="text-primary-foreground/70 text-sm">{userEmail}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Log out
          </Button>
        </div>
      </header>

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
    </div>
  );
};

export default UserDashboard;
