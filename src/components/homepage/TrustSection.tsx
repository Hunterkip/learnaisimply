import { Code2, Clock, Video, Lightbulb } from "lucide-react";

const trustItems = [
  {
    icon: Code2,
    title: "No coding required",
    description: "Everything is explained in plain language"
  },
  {
    icon: Clock,
    title: "Learn at your own pace",
    description: "Take your time with each lesson"
  },
  {
    icon: Video,
    title: "Video + audio lessons",
    description: "Watch, listen, or read — your choice"
  },
  {
    icon: Lightbulb,
    title: "Practical examples",
    description: "Real-life situations you'll recognize"
  }
];

export function TrustSection() {
  return (
    <section className="bg-secondary py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustItems.map((item, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center p-6 bg-background rounded-xl shadow-sm"
            >
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <item.icon className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
