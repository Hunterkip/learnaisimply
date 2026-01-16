import { Module, CourseProgress } from "@/types/course";

export const courseModules: Module[] = [
  {
    id: "welcome",
    title: "Welcome & Orientation",
    lessons: [
      { id: "welcome-1", title: "Before You Begin: A Warm Welcome & Mindset Reset", duration: "8 min", completed: true },
      { id: "welcome-2", title: "How to Use This Platform", duration: "4 min", completed: true },
    ],
  },
  {
    id: "module-0",
    title: "Module 0: AI Readiness Check",
    lessons: [
      { id: "m0-1", title: "AI Readiness Check & Your Profile", duration: "12 min", completed: false },
    ],
  },
  {
    id: "module-1",
    title: "Module 1: Understanding AI",
    lessons: [
      { id: "m1-1", title: "What AI Really Is (and Isn't)", duration: "10 min", completed: false },
      { id: "m1-2", title: "AI as Your Thinking Assistant", duration: "8 min", completed: false },
    ],
  },
  {
    id: "module-2",
    title: "Module 2: Prompting & Iteration",
    lessons: [
      { id: "m2-1", title: "The Art of Clear Prompting", duration: "12 min", completed: false },
      { id: "m2-2", title: "Iteration & Refinement", duration: "10 min", completed: false },
    ],
  },
  {
    id: "module-3",
    title: "Module 3: Communication with AI",
    lessons: [
      { id: "m3-1", title: "Writing Clear Emails and Messages", duration: "12 min", completed: false },
      { id: "m3-2", title: "Refining and Humanizing AI Output", duration: "10 min", completed: false },
    ],
  },
  {
    id: "module-4",
    title: "Module 4: Planning & Research",
    lessons: [
      { id: "m4-1", title: "Research Made Simple", duration: "11 min", completed: false },
      { id: "m4-2", title: "Planning Projects with AI", duration: "10 min", completed: false },
      { id: "m4-3", title: "Making Better Decisions", duration: "9 min", completed: false },
    ],
  },
  {
    id: "module-5",
    title: "Module 5: AI for Everyday Life",
    lessons: [
      { id: "m5-1", title: "Travel Planning", duration: "8 min", completed: false },
      { id: "m5-2", title: "Health & Wellness Questions", duration: "10 min", completed: false },
      { id: "m5-3", title: "Home & Family Organization", duration: "7 min", completed: false },
    ],
  },
  {
    id: "module-6",
    title: "Module 6: Creative AI",
    lessons: [
      { id: "m6-1", title: "Writing with AI Assistance", duration: "12 min", completed: false },
      { id: "m6-2", title: "Generating Ideas", duration: "8 min", completed: false },
      { id: "m6-3", title: "Visual Creativity Basics", duration: "10 min", completed: false },
    ],
  },
  {
    id: "module-7",
    title: "Module 7: AI for Wellbeing",
    lessons: [
      { id: "m7-1", title: "Mindful Use of Technology", duration: "9 min", completed: false },
      { id: "m7-2", title: "Setting Healthy Boundaries", duration: "7 min", completed: false },
    ],
  },
  {
    id: "module-8",
    title: "Module 8: Ethics & Staying Relevant",
    lessons: [
      { id: "m8-1", title: "Understanding AI Limitations", duration: "10 min", completed: false },
      { id: "m8-2", title: "Privacy & Security Basics", duration: "11 min", completed: false },
      { id: "m8-3", title: "Keeping Your Skills Fresh", duration: "8 min", completed: false },
    ],
  },
  {
    id: "wrap-up",
    title: "Course Wrap-Up",
    lessons: [
      { id: "wrap-1", title: "What You've Learned", duration: "6 min", completed: false },
      { id: "wrap-2", title: "Your Next Steps", duration: "5 min", completed: false },
      { id: "wrap-3", title: "Certificate & Congratulations", duration: "3 min", completed: false },
    ],
  },
];

export const initialProgress: CourseProgress = {
  completedLessons: ["welcome-1", "welcome-2"],
  currentLessonId: "m0-1",
  percentComplete: 10,
};
