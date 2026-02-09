import { ContactForm } from "./ContactForm";

const FORMSPREE_URL = "https://formspree.io/f/YOUR_FORM_ID";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 px-4">
      <div className="container mx-auto">
        <ContactForm formspreeUrl={FORMSPREE_URL} />
      </div>
    </footer>
  );
}
