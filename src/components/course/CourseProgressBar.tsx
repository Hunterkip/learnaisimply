import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
  showLabel?: boolean;
  label?: string;
  variant?: "default" | "onPrimary";
}

export function CourseProgressBar({ 
  value, 
  className, 
  showLabel = true,
  label,
  variant = "default"
}: ProgressBarProps) {
  const isOnPrimary = variant === "onPrimary";
  
  return (
    <div className={cn("space-y-2", className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-sm">
          <span className={isOnPrimary ? "text-primary-foreground/70" : "text-muted-foreground"}>
            {label || "Your Progress"}
          </span>
          <span className={cn("font-medium", isOnPrimary ? "text-primary-foreground" : "text-foreground")}>
            {value}% complete
          </span>
        </div>
      )}
      <div className={cn(
        "h-3 w-full rounded-full overflow-hidden",
        isOnPrimary ? "bg-primary-foreground/20" : "bg-secondary"
      )}>
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            isOnPrimary ? "bg-primary-foreground" : "bg-accent"
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
