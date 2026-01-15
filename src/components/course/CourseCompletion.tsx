import { Button } from "@/components/ui/button";
import { Download, Award, ArrowRight } from "lucide-react";

interface CourseCompletionProps {
  onDownloadCertificate: () => void;
  onExploreMore: () => void;
}

export function CourseCompletion({ onDownloadCertificate, onExploreMore }: CourseCompletionProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-2xl text-center">
        {/* Celebration Icon */}
        <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-8">
          <Award className="h-12 w-12 text-success" />
        </div>

        {/* Congratulations Message */}
        <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
          Congratulations!
        </h1>
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
          You've completed the course. You now know how to use AI calmly and confidently 
          in your work and daily life.
        </p>

        {/* Certificate Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            variant="default" 
            size="lg" 
            onClick={onDownloadCertificate}
            className="gap-2"
          >
            <Download className="h-5 w-5" />
            Download Your Certificate
          </Button>
        </div>

        {/* Reflection Box */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <h2 className="text-lg font-medium text-foreground mb-3">
            What You've Achieved
          </h2>
          <ul className="text-left space-y-2 text-foreground/80">
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span>Understanding of how AI works and its practical applications</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span>Skills to communicate effectively with AI tools</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span>Confidence to use AI in your daily work and life</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span>Awareness of AI ethics and best practices</span>
            </li>
          </ul>
        </div>

        {/* Next Steps */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Ready to explore more? We have additional resources to continue your journey.
          </p>
          <Button 
            variant="outline" 
            size="lg"
            onClick={onExploreMore}
            className="gap-2"
          >
            Explore More Resources
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
