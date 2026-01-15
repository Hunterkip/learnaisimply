import { Module, CourseProgress } from "@/types/course";

export const courseModules: Module[] = [
  {
    id: "welcome",
    title: "Welcome & Orientation",
    lessons: [
      { id: "welcome-1", title: "Welcome to the Course", duration: "5 min", completed: true },
      { id: "welcome-2", title: "How to Use This Platform", duration: "4 min", completed: true },
    ],
  },
  {
    id: "module-0",
    title: "Module 0: AI Readiness Check",
    lessons: [
      { id: "m0-1", title: "What You Already Know", duration: "6 min", completed: true },
      { id: "m0-2", title: "Setting Your Learning Goals", duration: "8 min", completed: false },
    ],
  },
  {
    id: "module-1",
    title: "Module 1: Understanding AI",
    lessons: [
      { id: "m1-1", title: "What is AI, Really?", duration: "10 min", completed: false },
      { id: "m1-2", title: "AI in Your Daily Life", duration: "8 min", completed: false },
      { id: "m1-3", title: "Common Myths About AI", duration: "7 min", completed: false },
    ],
  },
  {
    id: "module-2",
    title: "Module 2: Prompting & Iteration",
    lessons: [
      { id: "m2-1", title: "Your First AI Conversation", duration: "12 min", completed: false },
      { id: "m2-2", title: "How to Ask Better Questions", duration: "10 min", completed: false },
      { id: "m2-3", title: "Refining Your Results", duration: "8 min", completed: false },
    ],
  },
  {
    id: "module-3",
    title: "Module 3: Communication with AI",
    lessons: [
      { id: "m3-1", title: "Writing Emails with AI Help", duration: "10 min", completed: false },
      { id: "m3-2", title: "Summarizing Long Documents", duration: "9 min", completed: false },
      { id: "m3-3", title: "Professional Communication Tips", duration: "8 min", completed: false },
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
  completedLessons: ["welcome-1", "welcome-2", "m0-1"],
  currentLessonId: "m0-2",
  percentComplete: 12,
};

export const sampleLessonContent = {
  title: "Setting Your Learning Goals",
  description: "Before diving into AI, let's take a moment to think about what you want to achieve. This will help you get the most out of this course.",
  notes: `
## Why Goals Matter

Taking a few minutes now to think about your goals will make your learning journey much more effective. Everyone comes to AI with different needs and interests.

## Common Goals for This Course

Here are some goals other learners have set:

• **Save time at work** – Use AI to handle repetitive tasks like emails and scheduling
• **Stay informed** – Understand AI enough to have confident conversations about it
• **Boost creativity** – Use AI as a brainstorming partner for projects
• **Simplify daily life** – Get help with travel planning, research, and decisions
• **Stay relevant** – Keep your skills current in a changing workplace

## Your Personal Goals

Think about these questions:

1. What tasks take up too much of your time right now?
2. Where do you feel stuck or overwhelmed?
3. What would you love to accomplish if you had a helpful assistant?

Write down 2-3 specific goals. You don't need to share them—they're just for you.

## Remember

There's no rush. This course is designed to be taken at your own pace. The most important thing is that you feel comfortable and confident as you learn.
  `,
  examples: [
    {
      title: "Example Goal 1",
      content: "\"I want to write better work emails in half the time.\""
    },
    {
      title: "Example Goal 2", 
      content: "\"I want to understand AI well enough to help my grandchildren with their questions.\""
    },
    {
      title: "Example Goal 3",
      content: "\"I want to use AI to plan our family vacation without getting overwhelmed.\""
    }
  ],
  resources: [
    { title: "Goal Setting Worksheet (PDF)", url: "#" },
    { title: "Printable Course Overview", url: "#" },
  ]
};
