const modules = [
  { number: 0, title: "Welcome & Orientation" },
  { number: 1, title: "Understanding AI" },
  { number: 2, title: "Prompting & Iteration" },
  { number: 3, title: "Communication with AI" },
  { number: 4, title: "Planning & Research" },
  { number: 5, title: "AI for Everyday Life" },
  { number: 6, title: "Creative AI" },
  { number: 7, title: "Wellbeing & Ethics" },
  { number: 8, title: "Course Wrap-Up" }
];

export function CourseStructure() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-4">
            How the Course Is Structured
          </h2>
          <p className="text-muted-foreground text-center mb-12 text-lg">
            Short lessons. Clear explanations. No pressure.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module, index) => (
              <div 
                key={index}
                className="bg-secondary rounded-xl p-5 border border-border/50 hover:border-accent/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                    {module.number}
                  </div>
                  <span className="text-foreground font-medium">
                    {module.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
