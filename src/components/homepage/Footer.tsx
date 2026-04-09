import { Link } from "react-router-dom";
import { Brain, Facebook, MessageCircle } from "lucide-react";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
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
];

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <Brain className="h-5 w-5 text-accent" />
              </div>
              <span className="text-xl font-bold tracking-tight">LearnAISimply</span>
            </Link>
            <p className="text-primary-foreground/50 text-sm leading-relaxed max-w-xs">
              Master AI confidently with practical tools, real-world skills, and zero overwhelm. Join thousands of learners transforming their careers.
            </p>
            <div className="flex items-center gap-3">
              {[
                { href: "https://facebook.com", icon: <Facebook className="h-4 w-4" /> },
                { href: "https://www.tiktok.com/@aisimplifiedlearning", icon: <TikTokIcon /> },
                { href: "https://whatsapp.com/channel/0029Vb5jY2XGJP8BZUfFNS20", icon: <MessageCircle className="h-4 w-4" /> },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-primary-foreground/[0.06] flex items-center justify-center text-primary-foreground/40 hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-110"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-5 text-xs uppercase tracking-[0.15em] text-primary-foreground/60">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-primary-foreground/40 hover:text-accent text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-primary-foreground/[0.06] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/30 text-sm">
            © {new Date().getFullYear()} LearnAISimply. All rights reserved.
          </p>
          <p className="text-primary-foreground/20 text-xs">
            support@learnaisimply.com
          </p>
        </div>
      </div>
    </footer>
  );
}
