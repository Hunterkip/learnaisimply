import { useState } from "react";
import { ChevronDown, ChevronRight, Check, Play, Menu, X, BookOpen, FileText } from "lucide-react";
import { Module } from "@/types/course";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

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

  const getModuleProgress = (module: Module) => {
    const completed = module.lessons.filter((l) => completedLessons.includes(l.id)).length;
    return { completed, total: module.lessons.length };
  };

  const SidebarContent = () => (
    <nav className="p-4 space-y-3">
      <h2 className="text-lg font-semibold text-foreground mb-5 px-2 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-accent" />
        Course Contents
      </h2>
      {modules.map((module, moduleIdx) => {
        const { completed, total } = getModuleProgress(module);
        const progressPct = total > 0 ? (completed / total) * 100 : 0;
        const isExpanded = expandedModules.includes(module.id);
        const hasActiveLesson = module.lessons.some((l) => l.id === currentLessonId);

        return (
          <div
            key={module.id}
            className={cn(
              "rounded-xl border transition-all duration-300 overflow-hidden",
              hasActiveLesson
                ? "border-accent/40 bg-accent/5 shadow-sm shadow-accent/10"
                : "border-border/60 bg-card/50 hover:border-border"
            )}
          >
            {/* Module header */}
            <button
              onClick={() => toggleModule(module.id)}
              className="w-full flex items-center justify-between p-3.5 text-left transition-colors group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors",
                    progressPct === 100
                      ? "bg-success text-success-foreground"
                      : hasActiveLesson
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  {progressPct === 100 ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    moduleIdx
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-foreground text-sm leading-tight block truncate">
                    {module.title}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <FileText className="h-3 w-3" />
                    {completed}/{total} lessons
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Mini progress arc */}
                <div className="relative w-6 h-6 flex-shrink-0">
                  <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke="hsl(var(--border))"
                      strokeWidth="2.5"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke="hsl(var(--accent))"
                      strokeWidth="2.5"
                      strokeDasharray={`${progressPct * 0.628} 62.8`}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  </svg>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform" />
                )}
              </div>
            </button>

            {/* Module progress bar */}
            <div className="mx-3.5 h-0.5 rounded-full bg-border/50 overflow-hidden">
              <div
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {/* Lessons */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-3 pb-3 pt-2 space-y-1">
                    {module.lessons.map((lesson) => (
                      <li key={lesson.id} className="list-none">
                        <button
                          onClick={() => {
                            onLessonSelect(lesson.id);
                            setIsMobileOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center gap-3 p-2.5 text-left rounded-lg transition-all duration-200 group/lesson",
                            isActive(lesson.id)
                              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                              : isCompleted(lesson.id)
                              ? "hover:bg-success/10"
                              : "hover:bg-secondary/80"
                          )}
                        >
                          <span
                            className={cn(
                              "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200",
                              isCompleted(lesson.id)
                                ? "bg-success text-success-foreground"
                                : isActive(lesson.id)
                                ? "bg-primary-foreground/20 ring-2 ring-primary-foreground/30"
                                : "bg-secondary border border-border group-hover/lesson:border-accent/40"
                            )}
                          >
                            {isCompleted(lesson.id) ? (
                              <Check className="h-3.5 w-3.5" />
                            ) : isActive(lesson.id) ? (
                              <Play className="h-3 w-3 fill-current" />
                            ) : (
                              <Play className="h-3 w-3 text-muted-foreground group-hover/lesson:text-accent" />
                            )}
                          </span>
                          <div className="flex-1 min-w-0">
                            <span
                              className={cn(
                                "text-sm block truncate leading-snug",
                                isActive(lesson.id)
                                  ? "text-primary-foreground font-medium"
                                  : isCompleted(lesson.id)
                                  ? "text-foreground"
                                  : "text-foreground"
                              )}
                            >
                              {lesson.title}
                            </span>
                            <span
                              className={cn(
                                "text-xs",
                                isActive(lesson.id)
                                  ? "text-primary-foreground/60"
                                  : "text-muted-foreground"
                              )}
                            >
                              {lesson.duration}
                            </span>
                          </div>
                        </button>
                      </li>
                    ))}
                  </div>
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50 bg-card shadow-md border border-border"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label={isMobileOpen ? "Close menu" : "Open menu"}
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-card border-r border-border z-50 transform transition-transform duration-300 ease-out overflow-y-auto shadow-2xl",
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
