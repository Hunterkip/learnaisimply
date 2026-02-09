import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, User, MessageSquare, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ContactFormProps {
  formspreeUrl: string;
}

export function ContactForm({ formspreeUrl }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(formspreeUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast({
          title: "Thank you, your message has been submitted",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast({
          title: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto border-none bg-background/5 shadow-none">
      <CardContent className="p-0">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-background">Get in Touch</h3>
          <p className="text-background/60 text-sm mt-1">
            Have a question? We'd love to hear from you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contact-name" className="text-background/80 text-sm">
              Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="contact-name"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="pl-10 bg-background/10 border-background/20 text-background placeholder:text-background/40 focus-visible:ring-accent"
                maxLength={100}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-email" className="text-background/80 text-sm">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="contact-email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10 bg-background/10 border-background/20 text-background placeholder:text-background/40 focus-visible:ring-accent"
                maxLength={255}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-message" className="text-background/80 text-sm">
              Message
            </Label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="contact-message"
                placeholder="Your message..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="pl-10 min-h-[100px] bg-background/10 border-background/20 text-background placeholder:text-background/40 focus-visible:ring-accent resize-none"
                maxLength={1000}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-background/10">
          <p className="font-semibold text-lg text-background mb-1">AI Simplified</p>
          <p className="text-background/50 text-sm">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
