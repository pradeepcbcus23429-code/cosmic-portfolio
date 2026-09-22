import { SECTIONS, SOCIAL_LINKS, scrollToSection } from "@/lib/sections";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

const ICONS = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  mail: Mail,
} as const;

/** Site footer: quick navigation, social links, and the Caffeine attribution. */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      data-ocid="footer.section"
      className="relative mt-24 border-t border-border bg-card/60 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-lg font-semibold tracking-tight text-foreground">
              Nova<span className="text-gradient">.dev</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Designing and engineering luminous interfaces for the web — where
              motion, depth, and clarity meet.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Navigate
            </p>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-3 md:grid-cols-2">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <button
                    type="button"
                    data-ocid={`footer.link.${section.id}`}
                    onClick={() => scrollToSection(section.id)}
                    className="text-sm text-muted-foreground transition-fast hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {section.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-3">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Elsewhere
            </p>
            <ul className="flex items-center gap-2">
              {SOCIAL_LINKS.map((social) => {
                const Icon = ICONS[social.icon];
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target={social.icon === "mail" ? undefined : "_blank"}
                      rel={social.icon === "mail" ? undefined : "noreferrer"}
                      aria-label={social.label}
                      data-ocid={`footer.social.${social.icon}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-fast hover:border-primary/50 hover:text-primary hover:shadow-glow-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Nova.dev. All rights reserved.</p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              window.location.hostname,
            )}`}
            target="_blank"
            rel="noreferrer"
            data-ocid="footer.attribution_link"
            className="transition-fast hover:text-primary"
          >
            © {year}. Built with love using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
