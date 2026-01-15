import { useState } from "react";
import { ChevronDown, ChevronRight, Check, Play, Menu, X } from "lucide-react";
import { Module } from "@/types/course";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CourseSidebarProps {
  modules: Module[];
  currentLessonId: string;
  completedLessons: string[];
  onLessonSelect: (lessonId: string) => void;
}

export function CourseSidebar({
  modules,
  currentLessonId,
  completedLessons,
  onLessonSelect,
}: CourseSidebarProps) {
  const [expandedModules, setExpandedModules] = useState<string[]>(
    modules.map((m) => m.id)
  );
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const isCompleted = (lessonId: string) => completedLessons.includes(lessonId);
  const isActive = (lessonId: string) => currentLessonId === lessonId;

  const SidebarContent = () => (
    <nav className="p-4 space-y-2">
      <h2 className="text-lg font-semibold text-foreground mb-4 px-2">
        Course Contents
      </h2>
      {modules.map((module) => (
        <div key={module.id} className="mb-1">
          <button
            onClick={() => toggleModule(module.id)}
            className="w-full flex items-center justify-between p-3 text-left rounded-lg hover:bg-secondary/80 transition-colors"
          >
            <span className="font-medium text-foreground text-sm leading-tight pr-2">
              {module.title}
            </span>
            {expandedModules.includes(module.id) ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            )}
          </button>

          {expandedModules.includes(module.id) && (
            <ul className="ml-2 mt-1 space-y-1">
              {module.lessons.map((lesson) => (
                <li key={lesson.id}>
                  <button
                    onClick={() => {
                      onLessonSelect(lesson.id);
                      setIsMobileOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 text-left rounded-lg transition-colors",
                      isActive(lesson.id)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary/60"
                    )}
                  >
                    <span
                      className={cn(
                        "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center",
                        isCompleted(lesson.id)
                          ? "bg-success text-success-foreground"
                          : isActive(lesson.id)
                          ? "bg-primary-foreground/20"
                          : "bg-secondary border border-border"
                      )}
                    >
                      {isCompleted(lesson.id) ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Play className="h-3 w-3" />
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span
                        className={cn(
                          "text-sm block truncate",
                          isActive(lesson.id)
                            ? "text-primary-foreground"
                            : "text-foreground"
                        )}
                      >
                        {lesson.title}
                      </span>
                      <span
                        className={cn(
                          "text-xs",
                          isActive(lesson.id)
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        )}
                      >
                        {lesson.duration}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50 bg-card shadow-md"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label={isMobileOpen ? "Close menu" : "Open menu"}
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-foreground/20 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-card border-r border-border z-50 transform transition-transform duration-300 ease-out overflow-y-auto",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="pt-16">
          <SidebarContent />
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-80 xl:w-96 bg-card border-r border-border h-screen sticky top-0 overflow-y-auto">
        <SidebarContent />
      </aside>
    </>
  );
}
