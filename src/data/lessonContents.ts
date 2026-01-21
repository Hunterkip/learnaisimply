import { LessonContent } from "@/types/course";

import welcome1Audio from "@/assets/audio/welcome-1-audio.mp3";
import m1Lesson1Audio from "@/assets/audio/m1-1-audio.mp3";
import m1Lesson2Audio from "@/assets/audio/m1-2-audio.mp3";

export const lessonContents: Record<string, LessonContent> = {
  "welcome-1": {
    title: "Before You Begin: A Warm Welcome & Mindset Reset",
    description: "Welcome to AI Simplified. This lesson sets the foundation for your learning journey with a calm, supportive mindset.",
    audioUrl: welcome1Audio,
    notes: `Welcome.

If you are here, it means you are curious, thoughtful, and willing to learn — and that already places you in a strong position.

This course was created for experienced adults: professionals, leaders, business owners, retirees, and people who have spent years building skills, responsibility, and work ethic.

It is not about trends, hype, or becoming a "tech person." It is about learning how to use modern tools without losing your identity, judgment, or values.

You Are in the Right Place

If technology sometimes feels like it is moving too fast…
If AI feels confusing, overwhelming, or "not meant for people like you"…
If you have ever wondered whether AI could replace human thinking or reduce the value of experience…

You are not alone — and you are exactly where you need to be.

Many capable, intelligent people feel this way. It does not mean you are behind. It means the conversation around AI has often been rushed, technical, or dismissive of experience.

This course is different.

A Simple Idea to Hold Onto

Tech + Human = Superhumans

This does not mean machines replacing people. It means technology supporting human intelligence.

When experience, wisdom, and judgment are combined with the right tools, people do not become weaker. They become:

• more focused
• more effective
• less mentally overloaded

AI is not here to compete with you. It is here to assist you.

AI Is Not Only for "Tech People" or the Young

There is a common belief that AI is only for:

• programmers
• people working in technology companies
• younger generations

This belief is understandable — but it is not accurate.

AI is most powerful when used by people who already understand work, responsibility, and real-world decision-making.

Your experience gives direction. AI provides support. You remain in control.

Tech + Human = Superhumans.

What This Course Will Not Do

This course will not:

• turn you into a programmer
• require coding or technical background
• overwhelm you with tools
• encourage shortcuts that compromise integrity
• replace your thinking with automation

You will always remain the decision-maker.

What This Course Will Help You Do

This course will help you:

• write clearer, more confident emails and documents
• plan your work and personal life with less stress
• research topics and understand information faster
• summarize long documents efficiently
• use AI safely and responsibly
• reduce mental load and fatigue
• stay relevant without chasing every new trend

The goal is not to do more work — the goal is to do better work with less strain.

Using AI Does Not Make You Less Intelligent

Using AI does not mean you are lazy. It means you are strategic.

Using AI does not reduce intelligence. It helps protect your mental energy for what truly matters.

Just as calculators did not destroy mathematics, and email did not destroy communication, AI does not destroy human thinking.

It supports it.

Learn at Your Own Pace

There is no competition here. There is no rush.

Move slowly. Apply what you learn to your real life. Question AI outputs. Trust your judgment.

This is a calm, private learning space designed to support you — not pressure you.

Before You Continue

Take a moment.

Breathe.

You are not late. You are not behind.

You are learning how to use a powerful tool — on your own terms.

Tech + Human = Superhumans.

Continue to the next section and see how AI can begin working with you.`,
    examples: [
      {
        title: "The Mindset Shift",
        content: "Think of AI as a capable assistant who never gets tired, never forgets, and is always ready to help — but who always needs your guidance and judgment to do meaningful work."
      },
      {
        title: "Real-World Analogy",
        content: "Just as a calculator helps with math but doesn't replace mathematical thinking, AI helps with tasks but doesn't replace human wisdom and experience."
      }
    ],
    resources: [
      { title: "Course Welcome Guide (PDF)", url: "#" },
      { title: "Mindset Reset Worksheet", url: "#" }
    ]
  },

  "welcome-2": {
    title: "How to Use This Platform",
    description: "Learn how to navigate the course, track your progress, and get the most out of your learning experience.",
    notes: `Getting Started with the Platform

This lesson will help you understand how to navigate and use this learning platform effectively.

Course Structure

The course is organized into modules, each containing several lessons. You can:

• See your progress in the sidebar
• Navigate between lessons using the Next and Back buttons
• Access video, audio, and written content for each lesson
• Track which lessons you've completed

Learning Options

Every lesson offers multiple ways to learn:

• Video lessons — Watch at your own pace with speed controls
• Audio versions — Listen while doing other activities
• Written notes — Read and review key concepts
• Examples — See practical applications
• Resources — Download helpful materials

Your Progress

Your progress is saved automatically. You can:

• Leave and return anytime
• Resume where you left off
• Review completed lessons
• Move at your own pace

Tips for Success

• Take breaks when needed
• Apply what you learn to real situations
• Don't hesitate to re-watch or re-read content
• Focus on understanding, not speed

There is no rush. This is your learning journey.`,
    examples: [
      {
        title: "Using the Sidebar",
        content: "Click on any lesson in the left sidebar to jump directly to it. Completed lessons show a checkmark, and your current lesson is highlighted."
      },
      {
        title: "Video Speed Controls",
        content: "If the instructor speaks too fast or too slow, use the speed control to adjust playback to 0.75x, 1x, or 1.25x."
      }
    ],
    resources: [
      { title: "Platform Quick Start Guide (PDF)", url: "#" },
      { title: "Printable Course Overview", url: "#" }
    ]
  },

  "m0-1": {
    title: "AI Readiness Check & Your Profile",
    description: "Understand where you are starting from and discover your learning profile. This is not a test — it's about clarity and confidence.",
    notes: `Your Starting Point Is Valid

You might feel:

• curious but unsure
• interested but cautious
• overwhelmed or hesitant

All of these are normal.

This course is designed to support you exactly where you are.

How to Get the Most from This Course

You do not need to be technical or fast.

What matters is:

• curiosity
• patience
• willingness to try

Remember:

Tech + Human = Superhumans

Your experience guides the technology — not the other way around.

Your AI Readiness Profile

You may see yourself in one profile, or in parts of several. All profiles are welcome here.

🌱 Profile 1: The Curious Beginner

You might recognize yourself if you:

• feel unfamiliar with AI
• have not used AI tools yet
• feel curious but cautious
• prefer slow, clear explanations

What this means: You are at the perfect starting point. You are not behind — you are intentional.

How this course supports you:

• clear explanations without jargon
• step-by-step guidance
• reassurance at every stage
• practical examples you can relate to

You will build confidence gradually and safely.

🌿 Profile 2: The Careful Explorer

You might recognize yourself if you:

• have tried AI once or twice
• feel unsure whether to trust it
• see potential but feel overwhelmed
• want guidance before using it more

What this means: You are already engaged — you just need structure and clarity.

How this course supports you:

• teaches how to verify AI output
• shows when and when not to use AI
• focuses on judgment and control
• reduces confusion through repetition

You will move from uncertainty to confidence.

🌳 Profile 3: The Practical User

You might recognize yourself if you:

• already use AI for simple tasks
• want better results and consistency
• feel AI helps but doesn't always deliver quality
• want to understand why AI works the way it does

What this means: You are ready to deepen your skill, not just use tools.

How this course supports you:

• teaches proper prompting and iteration
• helps you refine and improve outputs
• shows how to humanize AI-generated content
• helps you integrate AI into real workflows

You will use AI more deliberately and effectively.

🌲 Profile 4: The Confident Improver

You might recognize yourself if you:

• feel comfortable using digital tools
• already use AI regularly
• want to apply AI more thoughtfully
• want to reduce mental load and improve quality

What this means: You are ready for refinement and mastery, not basics.

How this course supports you:

• focuses on strategy, not speed
• teaches decision support and oversight
• reinforces ethical and responsible use
• helps you design a personal AI workflow

You will turn AI into a reliable assistant — not a distraction.

An Important Reminder

No profile is better than another.

Everyone moves at their own pace. This course is designed so that all profiles can succeed, together.

What matters most is not where you start — but that you are willing to learn.

Tech + Human = Superhumans`,
    examples: [
      {
        title: "The Curious Beginner",
        content: "\"I've heard about ChatGPT but never tried it. I'm not sure where to start, but I'm curious to learn.\""
      },
      {
        title: "The Careful Explorer",
        content: "\"I tried an AI tool once for writing, but the result felt strange. I want to understand how to get better results.\""
      },
      {
        title: "The Practical User",
        content: "\"I use AI for quick tasks, but I know I'm not getting the most out of it. I want to improve my approach.\""
      },
      {
        title: "The Confident Improver",
        content: "\"I use AI daily, but I want to be more strategic about it and make sure I'm using it responsibly.\""
      }
    ],
    resources: [
      { title: "AI Readiness Profile Summary (PDF)", url: "#" },
      { title: "Personal Goals Worksheet", url: "#" }
    ]
  },
  "m1-1": {
    title: "What AI Really Is (and Isn't)",
    description: "Understand what AI actually is — and what it is not. Clear the confusion without technical jargon.",
    audioUrl: m1Lesson1Audio,
    notes: `Why This Module Matters

Before using AI confidently, it helps to understand what AI actually is — and what it is not.

Many people feel uneasy about AI because it is often explained using:

- technical language
- exaggerated claims
- fear-based narratives

This module clears that confusion. You do not need technical knowledge to understand AI well enough to use it properly.

What AI Really Is

At its core, AI is a tool that:

- recognizes patterns
- works with large amounts of information
- generates responses based on what it has learned

AI does not think like a human. It does not understand the meaning the way people do. It does not have judgment, values, or intentions.

AI responds based on patterns — you provide the direction.

What AI Is Not

AI is not:

- human intelligence
- wisdom
- common sense
- moral judgment

AI does not "know" things in the human sense. It predicts likely responses based on data.

That is why:

- AI can sound confident but be wrong
- AI can give useful drafts but poor decisions
- AI needs human oversight

Understanding this puts you back in control.

Why AI Sometimes Gives Poor Answers

AI can give weak or incorrect results when:

- instructions are vague
- context is missing
- questions are unclear
- it is asked to decide instead of assist

This is not a failure on your part. It simply means AI needs better guidance.

You will learn how to guide it properly later in the course.`,
    examples: [
      {
        title: "AI as Pattern Recognition",
        content: "When you ask AI to write an email, it doesn't understand your relationship with the recipient. It recognizes patterns from millions of emails and predicts what words typically follow others. Your guidance shapes the final result."
      },
      {
        title: "Why Context Matters",
        content: "Asking 'Write me an email' gives poor results. Asking 'Write a polite follow-up email to a colleague about a delayed project, keeping a professional but friendly tone' gives much better results. The difference is context."
      }
    ],
    resources: [
      { title: "Understanding AI: Quick Reference Guide", url: "#" }
    ]
  },
  "m1-2": {
    title: "AI as Your Thinking Assistant",
    description: "Learn the right way to think about AI and why your experience matters more than ever.",
    audioUrl: m1Lesson2Audio,
    notes: `The Right Way to Think About AI

A helpful way to think about AI is this:

AI is a thinking assistant, not a decision-maker.

It helps you:

- organize thoughts
- draft ideas
- explore options
- reduce repetitive mental work

You remain responsible for:

- judgment
- verification
- final decisions

Remember:

Tech + Human = Superhumans

The strength comes from the combination — not from the tool alone.

Why Experience Matters More Than Ever

AI is most effective when paired with:

- life experience
- professional judgment
- contextual understanding

Someone without experience may accept AI output blindly. Someone with experience knows how to question, refine, and decide.

Your experience is not outdated — it is essential.

What You Should Expect From AI (and What You Shouldn't)

You should expect AI to:

- save time on drafting and summarizing
- help you think through ideas
- support planning and research

You should not expect AI to:

- replace your thinking
- make important decisions for you
- understand complex human situations on its own

Clear expectations prevent frustration.

A Calm Reminder Before Moving On

You do not need to master AI to benefit from it. You only need to understand how to use it wisely.

This course will show you how to:

- ask better questions
- improve AI responses step by step
- apply AI to real work and daily life
- stay in control at all times

Continue When Ready

In the next module, you will learn one of the most important skills in using AI effectively: how to communicate with AI through clear prompting and thoughtful iteration.

Continue when ready and move on to the next module.`,
    examples: [
      {
        title: "Experience in Action",
        content: "A manager with 20 years of experience can spot when an AI-generated report misses important context. A newcomer might accept it as-is. Your experience is your advantage."
      },
      {
        title: "Setting Expectations",
        content: "Think of AI like a very fast research assistant who can draft, summarize, and organize — but who always needs your review before anything goes out the door."
      }
    ],
    resources: [
      { title: "AI Expectations Checklist", url: "#" }
    ]
  },
  "m2-1": {
    title: "The Art of Clear Prompting",
    description: "Learn how to communicate with AI effectively through clear, structured prompts.",
    notes: `Why This Module Is the Most Important

Most people believe AI gives "good" or "bad" answers on its own.

That is not true.

AI responds based on how it is guided. The quality of what you get depends largely on:

- how you explain your task
- how much context you provide
- how you follow up and refine

This module teaches you how to communicate with AI properly, so you stay in control and get useful, reliable results.

Once you understand this, everything else in the course becomes easier.

What Prompting Really Means

A prompt is simply how you communicate with AI.

It includes:

- what you ask
- how you ask it
- the information you provide
- the limits you set

Prompting is not about using "magic words." It is about clear thinking expressed clearly.

AI performs best when:

- your request is specific
- the context is clear
- expectations are stated

Why Simple Questions Often Fail

If you ask AI:

"Write an email."

AI has too many options:

- what kind of email?
- to whom?
- what tone?
- what purpose?

When instructions are vague, AI fills in the gaps — sometimes poorly.

This is why many people feel:

- "AI doesn't get me"
- "The output feels generic"
- "This sounds robotic"

The problem is not AI. The problem is missing guidance.

The Foundation of a Good Prompt

A strong prompt usually contains four elements:

1. Context

Explain the situation.

- Who are you?
- What is happening?
- Why does this matter?

2. Task

Be clear about what you want AI to do.

- Draft
- Summarize
- Improve
- Organize
- Suggest options

3. Constraints

Set boundaries.

- length
- tone
- format
- level of formality

4. Outcome

Describe what a good result looks like.

You do not need to be perfect. Even partial clarity helps AI respond better.

Example: Weak Prompt vs Better Prompt

Weak prompt:

"Write an email."

Better prompt:

"Draft a clear, professional email informing a colleague about a meeting change. Keep the tone polite and concise."

Notice how clarity improves direction.`,
    examples: [
      {
        title: "The Four Elements in Action",
        content: "Context: 'I'm a project manager.' Task: 'Draft an email.' Constraints: 'Keep it under 100 words, professional tone.' Outcome: 'The recipient should clearly understand the new deadline.'"
      },
      {
        title: "Weak vs Strong Prompt",
        content: "Weak: 'Write an email.' Strong: 'Draft a clear, professional email informing a colleague about a meeting change. Keep the tone polite and concise.' The difference is context and specificity."
      }
    ],
    resources: [
      { title: "Prompting Quick Reference Guide (PDF)", url: "#" }
    ]
  },
  "m2-2": {
    title: "Iteration & Refinement",
    description: "Master the art of improving AI responses through thoughtful iteration.",
    notes: `Iteration: How Quality Is Really Achieved

AI is not meant to get everything right on the first attempt.

Quality comes from iteration — improving the output step by step.

Think of AI as a first-draft assistant.

You can:

- ask it to rewrite
- request a different tone
- shorten or expand
- clarify unclear parts
- make it sound more human

This back-and-forth is not failure. It is how good results are produced.

How to Iterate Effectively

Instead of starting over, use follow-up instructions like:

- "Make this more concise."
- "Use a warmer but still professional tone."
- "Rewrite this so it sounds more natural."
- "Explain this more clearly for a non-technical audience."

Each follow-up improves the output.

You are guiding — not guessing.

Asking AI to Review Itself

One powerful technique is to ask AI to evaluate its own response.

You can ask:

- "What might be unclear in this response?"
- "Where could this be improved?"
- "Does this sound natural?"
- "Are there any assumptions here?"

This helps surface weaknesses — but you still decide.

AI can assist with review, but judgment remains human.

When to Stop Iterating

Iteration is useful, but it should not replace thinking.

Stop refining when:

- the output meets your needs
- further changes add little value
- you understand and agree with the result

Remember: AI supports decisions — it does not make them.

Common Prompting Mistakes to Avoid

Avoid:

- giving very little context
- expecting perfect results instantly
- accepting output without review
- using AI to decide instead of assist

Good use of AI is active, not passive.

A Calm Reminder

You do not need to "master" prompting.

You only need to:

- explain your task clearly
- improve outputs gradually
- trust your judgment

With practice, this becomes natural.

Before You Move On

The skill you learned here — clear prompting and thoughtful iteration — will be used throughout the rest of the course:

- emails and documents
- planning and research
- creative content
- everyday tasks
- wellbeing support

This is the foundation.

Continue When Ready

In the next module, you will apply this skill to real communication tasks — writing emails, documents, and messages that sound human, clear, and professional.

Continue when ready and move on to the next module.`,
    examples: [
      {
        title: "Iteration in Practice",
        content: "First response feels too formal? Say 'Make this warmer but still professional.' Too long? Say 'Shorten this to 3 sentences.' Each follow-up refines the result."
      },
      {
        title: "Self-Review Technique",
        content: "After AI gives you a draft, ask: 'What might be unclear in this response?' AI will identify potential weak spots — but you decide what to change."
      }
    ],
    resources: [
      { title: "Iteration Checklist", url: "#" }
    ]
  },
  "m3-1": {
    title: "Writing Clear Emails and Messages",
    description: "Learn how to use AI to write professional emails and messages that sound human and clear.",
    notes: `Why This Module Matters

A large part of work and daily life depends on communication:

- emails
- messages
- reports
- explanations
- instructions

When communication is unclear, it creates:

- misunderstandings
- delays
- frustration
- unnecessary stress

AI can help improve communication — but only when it is guided properly.

This module shows you how to use AI to:

- write more clearly
- sound professional and human
- save time without losing your voice
- reduce mental effort when communicating

A Principle to Keep in Mind

AI should help you express your thoughts more clearly, not replace them.

AI can draft and suggest. You decide what is sent.

You remain responsible for:

- tone
- accuracy
- appropriateness
- final judgment

AI Tools You Can Experiment With

You do not need many tools. Start with these three:

1. ChatGPT

Best for:

- drafting emails and messages
- rewriting text
- improving clarity and tone
- summarizing and explaining information

This will be the main tool used in examples.

2. Google Docs or Microsoft Word (AI features)

Best for:

- improving documents you already wrote
- editing and refining tone
- restructuring paragraphs

Useful when you are already working inside a document.

3. Grammarly (with AI features)

Best for:

- polishing language
- improving clarity
- checking tone

Think of this as a final editor, not the main writer.

Case Scenario 1: Writing a Professional Email

Situation

You need to inform a colleague that a meeting has been moved.

Weak Prompt Example

What you type into ChatGPT:

"Write an email about a meeting change."

Likely AI Response:

Subject: Meeting Update

Hello,

Please note that the meeting has been rescheduled. Kindly adjust your plans accordingly.

Thank you.

Why this is weak:

- No context
- No details
- Generic tone
- Feels impersonal
- AI had to guess

Strong Prompt Example (Full Prompt)

What you type into ChatGPT:

"I need to send a professional and polite email to a colleague informing them that a meeting scheduled for tomorrow at 10:00am has been moved to 2:00pm.

The tone should be respectful and clear.

Keep the message concise and suitable for a professional workplace."

AI Response:

Subject: Change of Meeting Time

Hello [Name],

I hope you are well.

Please note that the meeting scheduled for tomorrow at 10:00am has been moved to 2:00pm. We apologize for any inconvenience this may cause and appreciate your understanding.

Kindly let me know if you have any questions.

Best regards,
[Your Name]

Why This Works

- Clear context
- Specific details
- Tone guidance
- Structured outcome
- You guided the AI clearly

Improving the Draft (Iteration)

You can refine the output instead of starting over.

Follow-up Prompt:

"Make the email slightly warmer but still professional."

Improved AI Response:

Subject: Update on Tomorrow's Meeting

Hello [Name],

I hope you're doing well.

Just a quick note to let you know that tomorrow's meeting has been rescheduled from 10:00am to 2:00pm. Thank you for your flexibility, and please let me know if this change causes any challenges.

Best regards,
[Your Name]

This step-by-step improvement is how quality is achieved.`,
    examples: [
      {
        title: "Weak vs Strong Email Prompt",
        content: "Weak: 'Write an email about a meeting change.' Strong: 'Write a professional email informing a colleague that tomorrow's 10am meeting is now at 2pm. Keep it polite and concise.' The difference is context and specificity."
      },
      {
        title: "Iterating for Warmth",
        content: "If the first draft feels too formal, simply ask: 'Make this slightly warmer but still professional.' Each refinement brings the message closer to your voice."
      }
    ],
    resources: [
      { title: "Email Prompting Templates (PDF)", url: "#" }
    ]
  },
  "m3-2": {
    title: "Refining and Humanizing AI Output",
    description: "Learn how to improve existing writing, make AI output sound human, and know when NOT to use AI.",
    notes: `Case Scenario 2: Improving Something You Already Wrote

Situation

You wrote a message, but it sounds unclear or defensive.

Your original text:

"The report is late because we are still waiting for feedback and the delay was unavoidable."

Prompt You Give ChatGPT:

"Please rewrite the following sentence to sound more professional and clear, without sounding defensive:

'The report is late because we are still waiting for feedback and the delay was unavoidable.'"

AI Response:

"The report has been delayed as we are awaiting final feedback. Once received, we will complete and share the report promptly."

You then review and decide if it reflects your intent.

Case Scenario 3: Explaining Something Clearly

Situation

You need to explain a process or decision to someone who is not familiar with the details.

Prompt:

"Explain the following process in simple, clear language for a non-technical audience:

[describe the process]"

AI helps you organize and simplify your explanation.

You then:

- verify accuracy
- adjust wording
- ensure relevance

Making AI Output Sound Human

Sometimes AI drafts sound:

- stiff
- overly formal
- generic

To humanize AI output:

- shorten sentences
- remove unnecessary words
- add natural phrasing
- read it aloud

You can also ask directly:

"Rewrite this so it sounds more natural and human, while remaining professional."

Always review before using.

Case Scenario 4: Writing Reports or Summaries

Situation

You need to write or summarize a report.

Prompt:

"Summarize the key points of this document into a clear one-page summary, highlighting any important actions."

AI can:

- structure information
- reduce length
- extract key points

You then:

- confirm facts
- adjust emphasis
- add missing context

AI helps with structure. You ensure accuracy.

Detecting AI-Generated Content

Sometimes you may wonder whether content was AI-generated.

Possible signs:

- very smooth but generic language
- lack of specific details
- neutral tone without strong opinions

However, detection is not always reliable.

The most important skill is critical review, regardless of who or what created the content.

When NOT to Use AI for Communication

Avoid using AI alone when:

- messages are highly sensitive
- confidentiality is critical
- emotions are involved
- decisions have serious consequences

In such cases, AI may help you think — but you should write the final message yourself.

A Practical Habit to Build

For important communication:

1. Draft with AI
2. Review carefully
3. Edit to match your voice
4. Confirm accuracy
5. Send with confidence

Notice how much mental effort is reduced.

A Final Reminder

AI does not replace communication skills. It supports them.

You remain responsible for:

- clarity
- tone
- integrity

Tech + Human = Superhumans

Continue When Ready

In the next module, you will learn how to use AI for planning, research, and document summarizing — further reducing mental load and improving clarity.

Continue when ready and move on to the next module.`,
    examples: [
      {
        title: "Rewriting Defensive Text",
        content: "Original: 'The report is late because we are waiting for feedback and the delay was unavoidable.' Improved: 'The report has been delayed as we await final feedback. Once received, we will complete it promptly.'"
      },
      {
        title: "The 5-Step Habit",
        content: "For important messages: 1) Draft with AI, 2) Review carefully, 3) Edit to match your voice, 4) Confirm accuracy, 5) Send with confidence."
      }
    ],
    resources: [
      { title: "AI Communication Checklist", url: "#" }
    ]
  },
  "m4-1": {
    title: "Planning and Organizing with AI",
    description: "Learn how to use AI as a thinking and organizing assistant to reduce mental load.",
    notes: `Why This Module Matters

Mental fatigue often does not come from doing hard work — it comes from holding too much in your head at once.

Examples:

- too many tasks
- unclear priorities
- long documents
- scattered notes
- information overload

AI can help you:

- plan more clearly
- organize tasks
- research efficiently
- summarize long documents

This module shows you how to use AI as a thinking and organizing assistant, not a decision-maker.

A Principle to Remember

AI helps you see things clearly. It does not decide what matters.

You remain responsible for:

- priorities
- accuracy
- judgment

AI supports clarity — you provide direction.

AI Tools You Can Experiment With

Start simple. These tools are enough for most needs.

1. ChatGPT

Best for:

- planning tasks and schedules
- breaking down goals
- research summaries
- turning information into action steps

This will be the main tool used in examples.

2. ChatPDF or Similar Document Tools

Best for:

- summarizing long PDFs
- extracting key points
- identifying action items

Useful for reports, policies, proposals, and long documents.

3. Google Docs / Microsoft Word (AI features)

Best for:

- organizing notes
- restructuring content
- refining summaries

Helpful when you already have written material.

Case Scenario 1: Planning Your Day or Week

Situation

You have many responsibilities and feel mentally overloaded.

Weak Prompt Example

What you type into ChatGPT:

"Help me plan my week."

Likely AI Response:

- Generic schedule
- Unrealistic timing
- No awareness of your real constraints

AI is guessing.

Strong Prompt Example (Full Prompt)

What you type into ChatGPT:

"I have a busy week with meetings, report writing, and follow-ups.

Help me organize my tasks into a realistic weekly plan.

Assume I work standard hours, have limited energy in the afternoons, and need flexibility for unexpected issues.

Please keep the plan practical, not overly packed."

AI Response (Example):

Here is a suggested weekly structure:

Monday–Tuesday: Focus on meetings and discussions while energy is higher.
Midweek: Allocate focused time for report writing.
End of week: Handle follow-ups, reviews, and lighter tasks.

Leave buffer time each day for unexpected matters.

Why This Works

- Clear context
- Realistic constraints
- AI supports thinking, not control
- You adjust the plan to fit your reality

Case Scenario 2: Turning a Goal into Action Steps

Situation

You have a goal but feel unsure how to start.

Weak Prompt

"Help me achieve this goal."

Too vague.

Strong Prompt (Full Prompt)

"I want to complete a project report within the next two weeks.

Break this goal into clear, manageable steps and suggest a simple timeline."

AI Response (Example):

Suggested steps may include:

- Outline the report structure
- Gather key information
- Draft sections progressively
- Review and refine

Spread the work across manageable sessions.

AI gives structure — you decide pacing and priorities.`,
    examples: [
      {
        title: "Week Planning Prompt",
        content: "Instead of 'Help me plan my week,' try: 'I have meetings, report writing, and follow-ups. Help me organize into a realistic plan. I have limited afternoon energy and need flexibility for unexpected issues.'"
      },
      {
        title: "Goal Breakdown",
        content: "For any goal, ask AI to 'Break this into clear, manageable steps and suggest a simple timeline.' Then adjust based on your real constraints."
      }
    ],
    resources: [
      { title: "Weekly Planning Template (PDF)", url: "#" }
    ]
  },
  "m4-2": {
    title: "Research and Document Summarizing",
    description: "Learn how to use AI to research topics efficiently and summarize long documents.",
    notes: `Case Scenario 3: Researching a Topic Clearly

Situation

You need to understand a topic quickly without getting overwhelmed.

Weak Prompt

"Tell me about this topic."

Too broad.

Strong Prompt (Full Prompt)

"Give me a clear, high-level overview of this topic.

Highlight the main ideas, common challenges, and key considerations.

Keep the explanation simple and practical."

AI Response (Example):

- Organized overview
- Clear headings
- Simplified explanation

Important Reminder on Research

AI helps you:

- understand
- organize
- summarize

AI does not replace:

- verification
- trusted sources
- critical thinking

Always double-check important facts.

Case Scenario 4: Summarizing a Long Document

Situation

You receive a long document and need the key points.

Weak Prompt

"Summarize this document."

Too vague.

Strong Prompt (Full Prompt)

"Summarize this document into clear key points.

Highlight any important actions, deadlines, or decisions.

Keep the summary concise and easy to read."

AI Response (Example):

- Short bullet points
- Clear structure
- Action-focused summary

Turning Summaries into Action

After summarizing, you can ask:

"Based on this summary, what are the main actions or decisions to consider?"

This moves you from reading to doing.

Case Scenario 5: Organizing Notes and Ideas

Situation

Your notes are scattered and hard to follow.

Prompt:

"Organize the following notes into clear sections with headings:

[paste notes]"

AI helps you create structure.

You then:

- refine wording
- remove anything unnecessary
- ensure it reflects your thinking

Common Mistakes to Avoid

Avoid:

- using AI plans without review
- accepting summaries blindly
- giving vague instructions
- overloading AI with too many tasks at once

Good AI use is collaborative, not automatic.

A Practical Habit to Build

Use AI to:

- plan
- organize
- summarize

Then pause and ask:

"Does this make sense for my real situation?"

That pause keeps you in control.

A Final Reminder

You do not need to hold everything in your head. You do not need to remember every detail.

AI can help carry some of the mental load — while you focus on judgment, meaning, and decisions.

Tech + Human = Superhumans

Continue When Ready

In the next module, you will explore how AI can support everyday life tasks — from personal planning to practical daily needs like meals, routines, and learning.

Continue when ready and move on to the next module.`,
    examples: [
      {
        title: "Document Summary Prompt",
        content: "Instead of 'Summarize this document,' try: 'Summarize into clear key points. Highlight important actions, deadlines, or decisions. Keep it concise and easy to read.'"
      },
      {
        title: "From Summary to Action",
        content: "After getting a summary, ask: 'Based on this summary, what are the main actions or decisions to consider?' This moves you from reading to doing."
      }
    ],
    resources: [
      { title: "Document Summarizing Checklist", url: "#" }
    ]
  },
  "m5-1": {
    title: "AI Tools for Daily Life",
    description: "Discover how AI can support everyday life beyond work — from planning to personal organization.",
    notes: `Why This Module Matters

AI is not only for offices, reports, or formal work.

It can also support:

- daily planning
- personal organization
- learning new things
- decision-making
- reducing everyday mental stress

Many people discover that AI becomes most valuable outside of work, where it quietly reduces mental load and decision fatigue.

This module shows how to use AI to support everyday life without losing control or independence.

A Principle to Remember

AI should simplify life, not complicate it.

You decide what matters. AI helps you organize thoughts, explore options, and reduce unnecessary effort.

AI Tools You Can Use for Everyday Life

You do not need to rely on one tool. The skills you are learning work across many AI systems.

ChatGPT

Best for:

- everyday questions
- planning routines
- writing and rewriting text
- learning new topics step by step
- thinking through decisions

A strong all-purpose assistant.

Perplexity

Best for:

- research
- fact-based questions
- getting sources and references
- understanding current or real-world topics

Helpful when accuracy and evidence matter.

DeepSeek

Best for:

- structured reasoning
- breaking down complex ideas
- step-by-step explanations

Useful when you want logic and clarity.

Microsoft Copilot

Best for:

- users of Word, Excel, Outlook
- summarizing documents
- drafting emails

Helpful if you already work within Microsoft tools.

Google Gemini

Best for:

- quick explanations
- integration with Gmail and Google Docs
- everyday assistance

Good if you use Google products regularly.

Important Reminder About Tools

You do not need to learn all of these.

Start with one. Focus on learning how to:

- explain what you need
- review responses
- improve outputs

The tool is replaceable. Your judgment is not.

Real-Life Scenario 1: Planning Your Day at Home

Situation

You feel mentally overwhelmed with household tasks, personal errands, and responsibilities.

Weak Prompt

"Help me organize my day."

Too general. AI has no context.

Strong Prompt (Full Prompt)

"I have household chores, personal errands, and some rest time to balance today.

Help me create a simple, realistic daily plan that does not feel rushed and includes breaks."

Example AI Response

Here is a gentle structure for your day:

- Morning: high-energy tasks
- Midday: lighter errands
- Afternoon: rest or personal time
- Evening: prepare for the next day

You adjust the plan to match your energy and preferences.

Real-Life Scenario 2: Planning Meals or Recipes

Situation

You are tired of deciding what to cook and want simple ideas.

Weak Prompt

"Give me a recipe."

Strong Prompt (Full Prompt)

"Suggest simple, healthy meal ideas I can prepare at home this week.

Consider limited time, common ingredients, and balanced nutrition."

Example AI Response

- simple meal suggestions
- flexible ingredients
- short preparation steps

You choose what fits your taste, time, and budget.`,
    examples: [
      {
        title: "Daily Planning Prompt",
        content: "Instead of 'Help me organize my day,' try: 'I have household chores, errands, and rest time to balance. Help me create a simple, realistic plan that includes breaks.'"
      },
      {
        title: "Meal Planning",
        content: "Ask: 'Suggest simple, healthy meal ideas for this week. Consider limited time, common ingredients, and balanced nutrition.' Then choose what fits your preferences."
      }
    ],
    resources: [
      { title: "AI Tools Comparison Guide (PDF)", url: "#" }
    ]
  },
  "m5-2": {
    title: "Practical AI for Personal Decisions",
    description: "Learn how to use AI for learning, decision-making, and personal messages while maintaining control.",
    notes: `Real-Life Scenario 3: Learning Something New

Situation

You want to understand a topic without long or technical explanations.

Weak Prompt

"Explain this topic."

Strong Prompt (Full Prompt)

"Explain this topic in clear, simple language as if teaching someone new to it.

Use practical examples and avoid technical terms."

You can follow up with:

- "Give a simple example."
- "Explain this another way."

Learning becomes calmer and more accessible.

Real-Life Scenario 4: Making Everyday Decisions

Situation

You are weighing options and feel mentally stuck.

Strong Prompt (Full Prompt)

"Help me think through the pros and cons of these options.

Do not make the decision for me — just help organize my thinking."

AI structures your thoughts. You decide.

Real-Life Scenario 5: Writing Personal Messages

Situation

You need to send a thoughtful personal message.

Prompt

"Help me draft a warm, respectful message for this situation.

Keep it natural and sincere."

Always read and adjust before sending.

When NOT to Use AI in Daily Life

Avoid relying on AI alone when:

- emotions are strong
- privacy is critical
- decisions have serious personal consequences

AI can help you reflect — but human judgment comes first.

A Simple Habit to Build

Use AI to:

- plan
- organize
- explore options

Then pause and ask:

"Does this reflect what I truly want or value?"

That pause keeps AI supportive, not controlling.

A Final Reminder

AI does not replace:

- personal responsibility
- emotional understanding
- human connection

It supports clarity and reduces unnecessary mental strain.

Tech + Human = Superhumans

Continue When Ready

In the next module, you will explore how AI can support creative expression — including images, voice, and video — in simple, practical ways.

Continue when ready and move on to the next module.`,
    examples: [
      {
        title: "Learning Prompt",
        content: "Ask: 'Explain this topic in clear, simple language as if teaching someone new to it. Use practical examples and avoid technical terms.' Follow up with 'Give a simple example' if needed."
      },
      {
        title: "Decision Support",
        content: "When stuck between options, ask: 'Help me think through the pros and cons of these options. Do not make the decision for me — just help organize my thinking.'"
      }
    ],
    resources: [
      { title: "Personal AI Use Guidelines", url: "#" }
    ]
  },
  "m6-1": {
    title: "Creative AI Tools and Getting Started",
    description: "Discover how AI can help you visualize ideas and create supporting materials — no artistic skills required.",
    notes: `Why This Module Matters

Many people believe creativity belongs only to:

- designers
- videographers
- content creators

That is not true.

Creativity is simply expressing ideas clearly — visually, verbally, or emotionally.

AI can help you:

- visualize ideas
- explain things more clearly
- create supporting materials
- communicate more effectively

You do not need to be artistic or technical to benefit.

A Principle to Remember

AI does not replace creativity.

It helps you:

- explore ideas
- generate options
- save time on execution

You still decide:

- what feels right
- what represents you
- what should be shared

AI Tools You Can Use for Creative Tasks

You do not need all of these. Start with one that feels comfortable.

ChatGPT

Best for:

- generating ideas
- writing descriptions or scripts
- refining creative direction

Think of it as a creative thinking partner.

DALL·E

Best for:

- generating images from text
- visualizing concepts
- creating simple illustrations

You describe the image — AI generates options.

Midjourney

Best for:

- artistic images
- realistic visuals
- concept-style imagery

Useful when visual quality matters.

Canva

Best for:

- simple designs
- presentations
- social media graphics

Good if you prefer drag-and-drop simplicity.

ElevenLabs

Best for:

- converting text to natural-sounding voice
- narration
- explanations

Useful when you want audio without recording yourself.

Pictory

Best for:

- turning text into short videos
- simple visual storytelling

Good for basic video needs.

Real-Life Scenario 1: Creating an Image for an Idea

Situation

You want an image to support a presentation, document, or message.

Weak Prompt

"Create an image about teamwork."

Too vague.

Strong Prompt (Full Prompt)

"Create a clean, professional illustration showing people collaborating around a table, sharing ideas, and working together.

The style should be simple, modern, and suitable for a professional presentation."

AI generates multiple image options. You choose what fits your message.`,
    examples: [
      {
        title: "Image Prompt Example",
        content: "Instead of 'Create an image about teamwork,' try: 'Create a clean, professional illustration showing people collaborating around a table. Style should be simple, modern, suitable for a presentation.'"
      },
      {
        title: "Choosing the Right Tool",
        content: "Start with one tool that feels comfortable. ChatGPT for ideas and scripts, DALL·E or Canva for images, ElevenLabs for voice. You don't need to master all of them."
      }
    ],
    resources: [
      { title: "Creative AI Tools Overview (PDF)", url: "#" }
    ]
  },
  "m6-2": {
    title: "Voice, Video, and Creative Expression",
    description: "Learn how to use AI for scripts, voice, and video while maintaining authenticity and integrity.",
    notes: `Real-Life Scenario 2: Turning an Idea into a Short Script

Situation

You want to explain an idea clearly — maybe for a presentation or short video.

Weak Prompt

"Write a script about this topic."

Strong Prompt (Full Prompt)

"Write a short, clear script explaining this idea in simple language.

The tone should be calm, professional, and easy to understand for a general audience."

AI drafts a script. You review and adjust wording to match your voice.

Real-Life Scenario 3: Converting Text into Voice

Situation

You want to listen instead of read, or share spoken explanations.

How to Use AI Voice Tools

- Prepare your text
- Paste it into a voice generator
- Choose a calm, natural voice
- Listen and adjust wording if needed

AI handles the voice — you control the message.

Real-Life Scenario 4: Creating a Simple Video

Situation

You want a short video without filming or editing.

Strong Prompt (Example)

"Turn the following text into a short, calm video with simple visuals and readable text.

Keep it clear and professional."

AI creates a draft video.

You:

- review visuals
- adjust pacing
- ensure the message feels right

Important Boundaries in Creative AI

Use AI creatively, but avoid:

- sharing misleading visuals
- presenting AI-generated work as human testimony
- using AI where authenticity is critical

AI supports expression — integrity remains human.

A Healthy Creative Mindset

You do not need to be perfect. You do not need to impress.

Use creative AI to:

- explore
- experiment
- clarify

Not everything needs to be shared.

A Final Reminder

Creativity is not about talent. It is about expression and clarity.

AI helps remove barriers to expression — you provide meaning and direction.

Tech + Human = Superhumans

Continue When Ready

In the next module, you will learn how to use AI to support health, mental wellbeing, and financial clarity — responsibly and realistically.

Continue when ready and move on to the next module.`,
    examples: [
      {
        title: "Script Writing Prompt",
        content: "Ask: 'Write a short, clear script explaining this idea in simple language. The tone should be calm, professional, and easy to understand for a general audience.' Then adjust to match your voice."
      },
      {
        title: "Creative Boundaries",
        content: "Use AI creatively, but avoid sharing misleading visuals or presenting AI-generated work as human testimony. AI supports expression — integrity remains human."
      }
    ],
    resources: [
      { title: "Voice and Video AI Guide", url: "#" }
    ]
  },
  "m7-1": {
    title: "Health, Mind, and Responsible AI Use",
    description: "Learn how AI can support health and mental clarity — while understanding its important limitations.",
    notes: `Why This Module Matters

Modern life places heavy demands on:

- mental energy
- physical wellbeing
- financial decision-making

AI cannot replace doctors, therapists, or financial professionals. However, it can support clarity, reflection, and organization — when used wisely.

This module shows how AI can be used as a support tool, not an authority.

An Important Boundary (Please Read Carefully)

AI is not:

- a doctor
- a therapist
- a financial advisor

AI should never be used to:

- diagnose medical conditions
- replace professional advice
- make high-risk financial decisions

AI can help you:

- think more clearly
- organize information
- prepare better questions
- build healthier routines

A Guiding Principle

AI supports awareness and preparation. Humans remain responsible for decisions and actions.

AI Tools You Can Use

You may use the same tools from earlier modules:

- general AI chat tools for reflection and planning
- note or journaling apps with AI features
- budgeting or tracking tools that use AI summaries

The tool matters less than how you use it.

Real-Life Scenario 1: Supporting Physical Health (Non-Medical)

Situation

You want to build healthier routines but feel inconsistent.

Weak Prompt

"Give me health advice."

Too broad and unsafe.

Strong Prompt (Full Prompt)

"Help me think through simple daily habits that can support general wellbeing, such as movement, rest, and hydration.

Do not provide medical advice."

Example AI Response

- gentle daily movement suggestions
- reminders about rest and balance
- ideas for consistency

You decide what fits your life and consult professionals when needed.

Real-Life Scenario 2: Mental Clarity and Stress Reflection

Situation

You feel mentally overwhelmed and need clarity.

Strong Prompt (Full Prompt)

"Help me reflect on what might be contributing to mental stress in my daily routine.

Ask me thoughtful questions rather than giving advice."

AI helps you reflect, not diagnose.

You can use it for:

- journaling
- thought organization
- identifying patterns

Real-Life Scenario 3: Emotional Processing (With Care)

Situation

You are dealing with difficult emotions and want to think clearly.

Safe Prompt Example

"Help me put my thoughts into words so I can better understand what I'm feeling.

Do not act as a therapist or give mental health advice."

AI helps with expression, not treatment.

If distress feels serious or persistent, professional support is essential.`,
    examples: [
      {
        title: "Health Support Prompt",
        content: "Ask: 'Help me think through simple daily habits that can support general wellbeing, such as movement, rest, and hydration. Do not provide medical advice.' Then consult professionals when needed."
      },
      {
        title: "Mental Clarity Prompt",
        content: "Ask: 'Help me reflect on what might be contributing to mental stress in my daily routine. Ask me thoughtful questions rather than giving advice.' AI helps you reflect, not diagnose."
      }
    ],
    resources: [
      { title: "AI Wellbeing Boundaries Guide", url: "#" }
    ]
  },
  "m7-2": {
    title: "Financial Clarity and Healthy Routines",
    description: "Learn how to use AI for financial organization and building balanced daily routines.",
    notes: `Real-Life Scenario 4: Financial Awareness and Organization

Situation

You want better clarity around finances, not advice.

Weak Prompt

"Tell me how to invest my money."

Strong Prompt (Full Prompt)

"Help me organize my financial goals and questions so I can discuss them clearly with a financial professional."

Example AI Support

- organizing goals
- listing questions
- clarifying priorities

AI helps you prepare, not decide.

Real-Life Scenario 5: Building Healthier Routines

Situation

You want simple routines that support balance.

Prompt

"Help me design a simple daily routine that includes work, rest, movement, and reflection.

Keep it realistic and flexible."

You adjust based on:

- energy levels
- responsibilities
- personal preferences

When NOT to Use AI for Wellbeing

Do not rely on AI alone when:

- symptoms are severe or persistent
- emotional distress feels overwhelming
- financial decisions carry serious risk

In these cases, AI can help you prepare — but human professionals are essential.

A Healthy Way to Think About AI and Wellbeing

AI is a mirror, not a healer. It helps you:

- see patterns
- organize thoughts
- ask better questions

Healing, growth, and decisions remain human responsibilities.

A Practical Habit to Build

Use AI to:

- reflect
- organize
- prepare

Then pause and ask:

"Is this something I should discuss with a professional?"

That pause protects you.

A Final Reminder

Wellbeing is not about perfection. It is about awareness, balance, and care.

AI can support the process — but human judgment, connection, and care come first.

Tech + Human = Superhumans

Continue When Ready

In the final module, you will learn about ethics, safety, trust, and staying relevant with AI — so you can use these tools confidently and responsibly over time.

Continue when ready and move on to the final module.`,
    examples: [
      {
        title: "Financial Clarity Prompt",
        content: "Ask: 'Help me organize my financial goals and questions so I can discuss them clearly with a financial professional.' AI helps you prepare, not decide."
      },
      {
        title: "The Protective Pause",
        content: "After using AI for wellbeing topics, always pause and ask: 'Is this something I should discuss with a professional?' That pause protects you."
      }
    ],
    resources: [
      { title: "Healthy Routines Worksheet", url: "#" }
    ]
  },
  "m8-1": {
    title: "Safety, Privacy, and AI Accuracy",
    description: "Learn what to keep private, how to verify AI outputs, and when to trust AI — and when not to.",
    notes: `Why This Module Matters

AI is powerful — but power without judgment creates risk.

To use AI confidently over time, it is important to understand:

- what is safe to share
- what should remain private
- how to verify information
- how to stay relevant without chasing every new tool

This module helps you build long-term confidence and responsibility.

A Core Principle

AI should work with your values, not against them.

You remain responsible for:

- decisions
- ethics
- boundaries
- accountability

AI is a tool — not an authority.

What You Should Never Share with AI

Avoid sharing:

- personal identification details
- confidential work information
- passwords or access codes
- sensitive financial or health records
- private conversations without permission

If something should not be shared with a stranger, it should not be shared with AI.

Understanding AI Accuracy

AI can sound confident and still be wrong.

AI may:

- misunderstand context
- rely on outdated information
- generate plausible but incorrect details

Because of this:

- always verify important facts
- cross-check critical information
- apply common sense and experience

AI assists thinking — it does not guarantee truth.

Knowing When to Trust — and When Not To

AI is useful for:

- drafts
- summaries
- ideas
- organization

AI should not be trusted blindly for:

- legal decisions
- medical decisions
- financial decisions
- sensitive interpersonal situations

In high-stakes situations, AI helps you prepare — humans decide.`,
    examples: [
      {
        title: "Privacy Rule",
        content: "If something should not be shared with a stranger, it should not be shared with AI. Avoid personal identification, passwords, confidential work info, and private conversations."
      },
      {
        title: "Verification Habit",
        content: "AI can sound confident and still be wrong. Always verify important facts, cross-check critical information, and apply common sense and experience."
      }
    ],
    resources: [
      { title: "AI Privacy Checklist", url: "#" }
    ]
  },
  "m8-2": {
    title: "Ethics and Staying Relevant",
    description: "Learn to use AI responsibly and stay confident without chasing every new tool or trend.",
    notes: `Ethical Use of AI

Using AI responsibly means:

- being honest about AI-assisted work when necessary
- not misleading others with AI-generated content
- respecting privacy and consent
- avoiding manipulation or deception

Integrity builds trust — and trust matters more than speed.

Staying Relevant Without Feeling Overwhelmed

You do not need to:

- learn every new AI tool
- follow every trend
- keep up with constant updates

Instead:

- focus on core skills (clear prompting, review, judgment)
- revisit tools only when needed
- use AI to support your real life and work

Skills last longer than tools.

A Simple Long-Term Strategy

To stay confident with AI:

- Use it regularly but intentionally
- Question outputs instead of accepting them
- Update your approach when needed
- Protect your values and boundaries

That is enough.

Your Role Going Forward

You now understand:

- what AI is and is not
- how to guide it through prompting
- how to apply it to work, life, creativity, and wellbeing
- how to use it safely and ethically

You do not need permission to use AI. You do not need to fear it.

You are equipped to use it thoughtfully and responsibly.

A Final Reflection

Technology will continue to change.

What remains constant is:

- human judgment
- experience
- values
- responsibility

When these are combined with the right tools, the result is strength — not replacement.

Tech + Human = Superhumans`,
    examples: [
      {
        title: "Ethical AI Use",
        content: "Be honest about AI-assisted work when necessary. Don't mislead others with AI-generated content. Respect privacy and consent. Integrity builds trust."
      },
      {
        title: "Long-Term Strategy",
        content: "Focus on core skills (clear prompting, review, judgment). You don't need to learn every new tool or follow every trend. Skills last longer than tools."
      }
    ],
    resources: [
      { title: "AI Ethics Guidelines", url: "#" }
    ]
  },
  "wrap-1": {
    title: "What You've Learned",
    description: "Take a moment to reflect on the knowledge and skills you've gained throughout this course.",
    notes: `Course Wrap-Up — Bringing It All Together

Take a Moment to Reflect

You have reached the end of this course.

Before moving on, take a moment to reflect on what has changed.

You now understand:

• what AI is — and what it is not
• how to guide AI through clear prompting
• how to improve AI output through iteration
• how to use AI for communication, planning, creativity, and daily life
• how to use AI responsibly and ethically

Most importantly, you understand your role.

AI works best when guided by human judgment.

This Is Not About Mastery

You are not expected to:

• know everything
• use every tool
• be perfect

What you now have is more valuable than mastery:

• clarity
• confidence
• control

You know how to approach AI calmly and thoughtfully.

Tech + Human = Superhumans`,
    examples: [
      {
        title: "Key Skills You've Developed",
        content: "Clear prompting, critical review of AI outputs, iterative refinement, ethical AI use, and knowing when AI is the right tool for the job."
      },
      {
        title: "Your New Mindset",
        content: "AI is a tool that supports your thinking, not replaces it. Your experience, judgment, and values remain central to every decision."
      }
    ],
    resources: [
      { title: "Course Summary Guide", url: "#" }
    ]
  },
  "wrap-2": {
    title: "Your Next Steps",
    description: "Reflect on how you'll integrate AI into your life and develop a personal plan for continued growth.",
    notes: `Your Personal AI Integration Plan

You may find it helpful to reflect on the following questions:

• Where could AI realistically support my work or daily life?
• What tasks create an unnecessary mental load for me?
• How will I decide when to use AI — and when not to?
• What boundaries will I keep around privacy and ethics?

You do not need to write formal answers.
Even quiet reflection is enough.

This is about ownership, not assessment.

Looking Ahead

AI will continue to change.

You do not need to chase every update or tool.

If you:

• ask clear questions
• review outputs critically
• protect your values
• apply AI where it genuinely helps

You will remain relevant.

Skills last longer than tools.

A Final Thought

Technology does not replace human thinking.

When used wisely, it supports it.

Tech + Human = Superhumans

Where to Go Next (Optional)

You may choose to:

• revisit any module at your own pace
• apply what you've learned gradually
• explore deeper learning when you feel ready

There is no rush.

You are equipped.

Thank You

Thank you for taking the time to learn, reflect, and grow.

This is not the end —
It is simply a more confident beginning.`,
    examples: [
      {
        title: "Start Small",
        content: "Choose one area where AI can reduce mental load. Practice using it consistently before expanding to other areas."
      },
      {
        title: "Build Gradually",
        content: "You don't need to master everything at once. Apply what feels comfortable and expand naturally over time."
      }
    ],
    resources: [
      { title: "Personal AI Integration Worksheet", url: "#" }
    ]
  }
};

// Default content for lessons without specific content yet
export const defaultLessonContent: LessonContent = {
  title: "Lesson Coming Soon",
  description: "This lesson content is being prepared. Check back soon for the full lesson.",
  notes: `Coming Soon

This lesson is currently being developed. 

In the meantime, feel free to:

• Review previous lessons
• Practice what you've learned so far
• Explore the resources provided

Thank you for your patience.

Tech + Human = Superhumans`,
  examples: [],
  resources: []
};
