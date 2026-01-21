import { useState } from "react";
import { ChevronLeft, ChevronRight, Download, FileText, Lightbulb, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoPlayer, AudioOption } from "./VideoPlayer";
import { cn } from "@/lib/utils";

interface LessonContentProps {
  title: string;
  description: string;
  notes: string;
  audioUrl?: string;
  examples?: { title: string; content: string }[];
  resources?: { title: string; url: string }[];
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  isCompleting?: boolean;
  hideMedia?: boolean;
}

export function LessonContent({
  title,
  description,
  notes,
  audioUrl,
  examples = [],
  resources = [],
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  isCompleting = false,
  hideMedia = false,
}: LessonContentProps) {
  const [activeTab, setActiveTab] = useState<"notes" | "examples" | "resources">("notes");

  const tabs = [
    { id: "notes" as const, label: "Lesson Notes", icon: BookOpen },
    { id: "examples" as const, label: "Examples", icon: Lightbulb },
    { id: "resources" as const, label: "Resources", icon: FileText },
  ];

  return (
    <div className="flex-1 min-w-0">
      {/* Video Section */}
      {!hideMedia && <VideoPlayer className="mb-6" />}

      {/* Audio Option - show even for hideMedia lessons if they have audio */}
      {(!hideMedia || audioUrl) && <AudioOption audioUrl={audioUrl} />}

      {/* Lesson Header */}
      <div className="mt-8 mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
          {title}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <div className="flex gap-1 -mb-px overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-base font-medium border-b-2 transition-colors whitespace-nowrap min-h-[48px]",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mb-8 animate-fade-in">
        {activeTab === "notes" && (
          <div className="lesson-content">
            {notes.split("\n\n").map((paragraph, index) => {
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={index} className="text-xl font-semibold text-foreground mt-8 mb-4">
                    {paragraph.replace("## ", "").replace(/\*\*/g, "")}
                  </h2>
                );
              }
              if (paragraph.startsWith("• ") || paragraph.startsWith("- ")) {
                const items = paragraph.split("\n").filter(Boolean);
                return (
                  <ul key={index} className="space-y-2 my-4 list-none">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-foreground/90">
                        <span className="text-accent mt-1.5">•</span>
                        <span>{item.replace(/^[•\-]\s*/, "").replace(/\*\*/g, "")}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              if (paragraph.match(/^\d\./)) {
                const items = paragraph.split("\n").filter(Boolean);
                return (
                  <ol key={index} className="space-y-2 my-4 list-none">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-foreground/90">
                        <span className="text-accent font-medium">{i + 1}.</span>
                        <span>{item.replace(/^\d+\.\s*/, "")}</span>
                      </li>
                    ))}
                  </ol>
                );
              }
              return (
                <p key={index} className="text-foreground/90 mb-4 leading-relaxed">
                  {paragraph.replace(/\*\*/g, "")}
                </p>
              );
            })}
          </div>
        )}

        {activeTab === "examples" && (
          <div className="space-y-4">
            {examples.length > 0 ? (
              examples.map((example, index) => (
                <div
                  key={index}
                  className="p-5 bg-secondary/50 rounded-xl border border-border"
                >
                  <h3 className="font-medium text-foreground mb-2">{example.title}</h3>
                  <p className="text-foreground/80 italic">{example.content}</p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No examples for this lesson.</p>
            )}
          </div>
        )}

        {activeTab === "resources" && (
          <div className="space-y-3">
            {resources.length > 0 ? (
              resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl border border-border hover:bg-secondary transition-colors"
                >
                  <Download className="h-5 w-5 text-accent" />
                  <span className="text-foreground font-medium">{resource.title}</span>
                </a>
              ))
            ) : (
              <p className="text-muted-foreground">No resources for this lesson.</p>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
        <Button
          variant="outline"
          size="lg"
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="gap-2"
        >
          <ChevronLeft className="h-5 w-5" />
          Back
        </Button>
        <Button
          variant="lesson"
          size="lg"
          onClick={onNext}
          disabled={!hasNext && !isCompleting}
          className="gap-2 flex-1 sm:flex-initial"
        >
          {hasNext ? "Next Lesson" : "Complete Course"}
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Encouragement */}
      <div className="mt-8 p-4 bg-accent/5 rounded-xl border border-accent/20 text-center">
        <p className="text-muted-foreground">
          You're making great progress. Take your time—there's no rush.
        </p>
      </div>

      {/* Mobile Fixed Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border safe-padding">
        <Button
          variant="continue"
          size="lg"
          onClick={onNext}
          disabled={!hasNext && !isCompleting}
          className="w-full gap-2"
        >
          {hasNext ? "Continue to Next Lesson" : "Complete Course"}
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
