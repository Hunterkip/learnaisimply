import { Link } from "react-router-dom";
import { Brain, Facebook, MessageCircle } from "lucide-react";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.7a8.16 8.16 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.13z" />
  </svg>
);

const footerSections = [
  {
    title: "Platform",
    links: [
      { label: "AI Assessment", href: "/assessment" },
      { label: "Courses", href: "/enroll" },
      { label: "AI Tools", href: "/ai-tools" },
      { label: "Enrollment", href: "/sign-up" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Mission", href: "/about" },
      { label: "Contact", href: "#contact" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "AI Learning Guides", href: "/ai-tools" },
      { label: "FAQs", href: "#" },
      { label: "Payment Help", href: "/payment-help" },
    ],
  },
  {
    title: "Connect",
    links: [],
    socials: true,
  },
];

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <Brain className="h-7 w-7 text-accent transition-transform duration-300 group-hover:rotate-12" />
              <span className="text-xl font-bold">LearnAISimply</span>
            </Link>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              Master AI confidently. Practical tools, real-world skills, zero overwhelm.
            </p>
          </div>

          {/* Link Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-primary-foreground/80">
                {section.title}
              </h4>
              {section.links.length > 0 && (
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-primary-foreground/50 hover:text-accent text-sm transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {section.socials && (
                <div className="space-y-3">
                  <p className="text-primary-foreground/50 text-sm">support@learnaisimply.com</p>
                  <div className="flex items-center gap-3 mt-3">
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground/50 hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                    >
                      <Facebook className="h-4 w-4" />
                    </a>
                    <a
                      href="https://www.tiktok.com/@aisimplifiedlearning"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground/50 hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                    >
                      <TikTokIcon />
                    </a>
                    <a
                      href="https://whatsapp.com/channel/0029Vb5jY2XGJP8BZUfFNS20"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground/50 hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center">
          <p className="text-primary-foreground/40 text-sm">
            © {new Date().getFullYear()} LearnAISimply. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
