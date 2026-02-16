import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { LogoutDialog } from "@/components/layout/LogoutDialog";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  // Only show full nav links when logged in
  const navLinks = isLoggedIn
    ? [
        { label: "Home", path: "/" },
        { label: "AI Assessment", path: "/assessment" },
        { label: "AI Tools", path: "/ai-tools" },
        { label: "Enroll", path: "/enroll" },
        { label: "About", path: "/about" },
        ...(hasAccess ? [{ label: "Dashboard", path: "/dashboard" }, { label: "Course", path: "/course" }] : []),
      ]
    : [];

  return (
    <>
      <header className="bg-card/80 backdrop-blur-md border-b border-border py-3 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity">
            <Brain className="h-7 w-7 text-accent" />
            <span className="text-lg font-bold tracking-tight">LearnAISimply</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-sm font-medium ${isActive(link.path) ? "text-accent bg-accent/10" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}

            {!isLoggedIn ? (
              <Link to="/log-in">
                <Button size="sm" className="text-sm font-medium bg-accent text-accent-foreground hover:bg-accent/90 ml-2">
                  Sign In
                </Button>
              </Link>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLogoutDialog(true)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground ml-2"
              >
                Log out
              </Button>
            )}
          </nav>

          {/* Mobile menu toggle */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-sm ${isActive(link.path) ? "text-accent bg-accent/10" : "text-muted-foreground"}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            {!isLoggedIn ? (
              <div className="pt-2 border-t border-border mt-2">
                <Link to="/log-in" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full text-sm bg-accent text-accent-foreground hover:bg-accent/90">Sign In</Button>
                </Link>
              </div>
            ) : (
              <Button
                variant="ghost"
                className="w-full justify-start text-sm text-muted-foreground"
                onClick={() => { setShowLogoutDialog(true); setMobileOpen(false); }}
              >
                Log out
              </Button>
            )}
          </div>
        )}
      </header>

      <LogoutDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={handleLogout}
      />
    </>
  );
}
