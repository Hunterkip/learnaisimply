import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, BookOpen, LayoutDashboard, LogIn, UserPlus, LogOut, Brain } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { LogoutDialog } from "@/components/layout/LogoutDialog";

interface NavbarProps {
  variant?: "default" | "dark";
  showAuth?: boolean;
}

export function Navbar({ variant = "default", showAuth = true }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        const { data: profile } = await supabase
          .from("profiles")
          .select("has_access")
          .eq("id", session.user.id)
          .single();
        setHasAccess(!!profile?.has_access);
      }
    };
    checkSession();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowLogoutDialog(false);
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  const isDark = variant === "dark";
  const bgClass = isDark ? "bg-primary text-primary-foreground" : "bg-card border-b border-border";
  const textClass = isDark ? "text-primary-foreground" : "text-foreground";
  const mutedClass = isDark ? "text-primary-foreground/70 hover:text-primary-foreground" : "text-muted-foreground hover:text-foreground";
  const activeClass = isDark ? "text-primary-foreground bg-primary-foreground/10" : "text-foreground bg-accent/10";

  return (
    <>
      <header className={`${bgClass} py-3 sticky top-0 z-50`}>
        <div className="container mx-auto px-3 sm:px-4 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-2 ${textClass} hover:opacity-80 transition-opacity`}>
            <Brain className="h-6 w-6 sm:h-7 sm:w-7 transition-transform duration-300 hover:rotate-12" />
            <span className="text-lg sm:text-xl font-semibold">AI Simplified</span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link to="/">
              <Button
                variant="ghost"
                size="sm"
                className={`group ${isActive("/") ? activeClass : mutedClass} text-xs sm:text-sm px-2 sm:px-3`}
              >
                <Home className="h-4 w-4 mr-1 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>

            {isLoggedIn && hasAccess && (
              <>
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`group ${isActive("/dashboard") ? activeClass : mutedClass} text-xs sm:text-sm px-2 sm:px-3`}
                  >
                    <LayoutDashboard className="h-4 w-4 mr-1 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Button>
                </Link>
                <Link to="/course">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`group ${isActive("/course") ? activeClass : mutedClass} text-xs sm:text-sm px-2 sm:px-3`}
                  >
                    <BookOpen className="h-4 w-4 mr-1 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
                    <span className="hidden sm:inline">Course</span>
                  </Button>
                </Link>
              </>
            )}

            {showAuth && !isLoggedIn && (
              <>
                <Link to="/log-in">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`group ${mutedClass} text-xs sm:text-sm px-2 sm:px-3`}
                  >
                    <LogIn className="h-4 w-4 mr-1 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-x-0.5" />
                    <span className="hidden sm:inline">Log In</span>
                  </Button>
                </Link>
                <Link to="/sign-up">
                  <Button
                    variant="continue"
                    size="sm"
                    className="group text-xs sm:text-sm px-2 sm:px-3"
                  >
                    <UserPlus className="h-4 w-4 mr-1 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                    <span className="hidden sm:inline">Enroll</span>
                  </Button>
                </Link>
              </>
            )}

            {isLoggedIn && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLogoutDialog(true)}
                className={`group ${mutedClass} text-xs sm:text-sm px-2 sm:px-3`}
              >
                <LogOut className="h-4 w-4 mr-1 transition-transform duration-300 group-hover:scale-110 group-hover:translate-x-0.5" />
                <span className="hidden sm:inline">Log out</span>
              </Button>
            )}
          </nav>
        </div>
      </header>

      <LogoutDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={handleLogout}
      />
    </>
  );
}
