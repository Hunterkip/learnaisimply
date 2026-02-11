import { useState } from "react";
import { AIReadinessQuiz } from "@/components/quiz/AIReadinessQuiz";
import { Brain } from "lucide-react";
import { Link } from "react-router-dom";

const QuizPage = () => {
  const [isQuizOpen, setIsQuizOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background flex flex-col">
      {/* Minimal Header — just AI logo */}
      <header className="px-6 py-4">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">AI Simplified</span>
        </Link>
      </header>

      {/* Quiz Modal */}
      <AIReadinessQuiz isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />

      {/* Fallback if quiz is closed */}
      {!isQuizOpen && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Quiz closed.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setIsQuizOpen(true)}
                className="text-primary hover:underline font-medium"
              >
                Retake Quiz
              </button>
              <Link to="/" className="text-muted-foreground hover:text-foreground">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
