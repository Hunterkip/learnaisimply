import { Link } from "react-router-dom";
import { ContactForm } from "./ContactForm";
import { Brain, Facebook, MessageCircle } from "lucide-react";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.7a8.16 8.16 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.13z" />
  </svg>
);

const footerSections = [
  {
    title: "Services",
    links: [
      { label: "AI Training Course", href: "/sign-up" },
      { label: "Business AI Solutions", href: "/sign-up" },
      { label: "Team Training", href: "/sign-up" },
      { label: "Consulting", href: "/sign-up" },
    ],
  },
  {
    title: "About Us",
    links: [
      { label: "Our Mission", href: "/" },
      { label: "How It Works", href: "/" },
      { label: "Who It's For", href: "/" },
      { label: "Pricing", href: "/" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Payment Help", href: "/payment-help" },
      { label: "Contact Us", href: "#contact" },
      { label: "FAQ", href: "/" },
    ],
    socials: true,
  },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <Brain className="h-7 w-7 text-accent transition-transform duration-300 group-hover:rotate-12" />
              <span className="text-xl font-bold text-background">AI Simplified</span>
            </Link>
            <p className="text-background/60 text-sm leading-relaxed">
              Practical, easy-to-follow AI training that simplifies complex concepts for everyday people and business.
            </p>
          </div>

          {/* Link Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-background mb-4 text-sm uppercase tracking-wider">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-background/60 hover:text-accent text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {section.socials && (
                <div className="flex items-center gap-3 mt-4">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center text-background/60 hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-110"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a
                    href="https://www.tiktok.com/@aisimplifiedlearning?is_from_webapp=1&sender_device=pc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center text-background/60 hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-110"
                  >
                    <TikTokIcon />
                  </a>
                  <a
                    href="https://whatsapp.com/channel/0029Vb5jY2XGJP8BZUfFNS20"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center text-background/60 hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-110"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Form Section */}
        <div id="contact" className="mt-12 pt-10 border-t border-background/10">
          <ContactForm />
        </div>

        {/* Copyright */}
        <div className="text-center mt-10 pt-6 border-t border-background/10">
          <p className="font-semibold text-lg text-background mb-1">AI Simplified</p>
          <p className="text-background/50 text-sm">© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
