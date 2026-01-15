import { useState, useMemo } from "react";
import { CourseHeader } from "@/components/course/CourseHeader";
import { CourseSidebar } from "@/components/course/CourseSidebar";
import { LessonContent } from "@/components/course/LessonContent";
import { CourseCompletion } from "@/components/course/CourseCompletion";
import { courseModules, initialProgress, sampleLessonContent } from "@/data/courseData";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [completedLessons, setCompletedLessons] = useState<string[]>(
    initialProgress.completedLessons
  );
  const [currentLessonId, setCurrentLessonId] = useState(
    initialProgress.currentLessonId
  );
  const [showCompletion, setShowCompletion] = useState(false);

  // Get all lessons in order
  const allLessons = useMemo(() => {
    return courseModules.flatMap((module) => module.lessons);
  }, []);

  // Calculate progress
  const progress = useMemo(() => {
    return Math.round((completedLessons.length / allLessons.length) * 100);
  }, [completedLessons, allLessons]);

  // Find current lesson index
  const currentLessonIndex = allLessons.findIndex(
    (lesson) => lesson.id === currentLessonId
  );

  // Navigation handlers
  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonId(allLessons[currentLessonIndex - 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    // Mark current lesson as complete
    if (!completedLessons.includes(currentLessonId)) {
      setCompletedLessons((prev) => [...prev, currentLessonId]);
    }

    if (currentLessonIndex < allLessons.length - 1) {
      setCurrentLessonId(allLessons[currentLessonIndex + 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Course completed
      setShowCompletion(true);
    }
  };

  const handleLessonSelect = (lessonId: string) => {
    setCurrentLessonId(lessonId);
    setShowCompletion(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleContinue = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDownloadCertificate = () => {
    toast({
      title: "Certificate Ready",
      description: "Your certificate is being prepared for download.",
    });
  };

  const handleExploreMore = () => {
    toast({
      title: "Coming Soon",
      description: "More courses and resources are on the way!",
    });
  };

  if (showCompletion) {
    return (
      <CourseCompletion
        onDownloadCertificate={handleDownloadCertificate}
        onExploreMore={handleExploreMore}
      />
    );
  }

  const currentLesson = allLessons[currentLessonIndex];

  return (
    <div className="min-h-screen bg-background">
      {/* Course Header */}
      <CourseHeader
        title="AI for Adults 40+"
        subtitle="A Practical Guide to Using AI at Work and in Life"
        progress={progress}
        onContinue={handleContinue}
      />

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <CourseSidebar
          modules={courseModules}
          currentLessonId={currentLessonId}
          completedLessons={completedLessons}
          onLessonSelect={handleLessonSelect}
        />

        {/* Lesson Content */}
        <main className="flex-1 p-6 lg:p-8 pb-32 lg:pb-8">
          <div className="max-w-4xl">
            {/* Current lesson indicator */}
            <div className="mb-6 text-sm text-muted-foreground">
              Lesson {currentLessonIndex + 1} of {allLessons.length}
              {currentLesson && (
                <span className="ml-2 text-foreground font-medium">
                  • {currentLesson.duration}
                </span>
              )}
            </div>

            <LessonContent
              title={sampleLessonContent.title}
              description={sampleLessonContent.description}
              notes={sampleLessonContent.notes}
              examples={sampleLessonContent.examples}
              resources={sampleLessonContent.resources}
              onPrevious={handlePrevious}
              onNext={handleNext}
              hasPrevious={currentLessonIndex > 0}
              hasNext={currentLessonIndex < allLessons.length - 1}
              isCompleting={currentLessonIndex === allLessons.length - 1}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
