import { ContactForm } from "./ContactForm";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 px-4">
      <div className="container mx-auto">
        <ContactForm />
      </div>
    </footer>
  );
}
