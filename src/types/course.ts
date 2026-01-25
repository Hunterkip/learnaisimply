export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  videoUrl?: string;
  audioUrl?: string;
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

export interface LessonContent {
  title: string;
  description: string;
  notes: string;
  audioUrl?: string;
  videoUrl?: string;
  posterUrl?: string;
  examples?: { title: string; content: string }[];
  resources?: { title: string; url: string }[];
}
