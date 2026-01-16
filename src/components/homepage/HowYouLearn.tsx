import { Video, Headphones, FileText, Infinity } from "lucide-react";

const formats = [
  {
    icon: Video,
    title: "Pre-recorded video lessons",
    description: "Watch at your convenience"
  },
  {
    icon: Headphones,
    title: "Audio versions",
    description: "Listen while you commute or relax"
  },
  {
    icon: FileText,
    title: "Written notes",
    description: "Read and reference anytime"
  },
  {
    icon: Infinity,
    title: "Lifetime access",
    description: "Learn at your own pace, forever"
  }
];

export function HowYouLearn() {
  return (
    <section className="bg-secondary py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-4">
            How You Will Learn
          </h2>
          <p className="text-muted-foreground text-center mb-12 text-lg">
            Learn in the way that suits you best.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {formats.map((format, index) => (
              <div 
                key={index}
                className="flex items-start gap-5 bg-background rounded-xl p-6 shadow-sm"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <format.icon className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold text-lg mb-1">
                    {format.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {format.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
