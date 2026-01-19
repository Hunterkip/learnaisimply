import { Button } from "@/components/ui/button";
import { CourseProgressBar } from "./CourseProgressBar";
import { Play, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

interface CourseHeaderProps {
  title: string;
  subtitle: string;
  progress: number;
  onContinue: () => void;
}

export function CourseHeader({ title, subtitle, progress, onContinue }: CourseHeaderProps) {
  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container py-8 md:py-12">
        <div className="flex justify-between items-start">
          <div className="max-w-3xl">
            <h1 className="text-2xl md:text-4xl font-semibold mb-3 text-primary-foreground">{title}</h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-6">{subtitle}</p>
            
            <div className="mb-6">
              <CourseProgressBar 
                value={progress} 
                className="max-w-md"
                label="Your progress"
                variant="onPrimary"
              />
            </div>

            <Button 
              variant="continue" 
              size="lg" 
              onClick={onContinue}
              className="gap-2"
            >
              <Play className="h-5 w-5" />
              Continue Learning
            </Button>
          </div>

          {/* Dashboard Link */}
          <Link to="/dashboard">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            >
              <LayoutDashboard className="h-5 w-5 mr-2" />
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
