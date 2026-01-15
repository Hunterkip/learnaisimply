export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  videoUrl?: string;
  audioUrl?: string;
  content?: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface CourseProgress {
  completedLessons: string[];
  currentLessonId: string;
  percentComplete: number;
}
