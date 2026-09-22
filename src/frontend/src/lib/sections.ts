import type { SectionDef, SocialLink } from "@/types/portfolio";

/**
 * Single source of truth for the page's scrollable sections.
 * Nav links, scroll-spy observation, and footer quick-nav all read from this.
 */
export const SECTIONS: SectionDef[] = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "GitHub", href: "https://github.com", icon: "github" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
  { label: "X", href: "https://x.com", icon: "twitter" },
  { label: "Email", href: "mailto:hello@example.com", icon: "mail" },
];

/** Smooth-scrolls to a section, honoring the reduced-motion preference. */
export function scrollToSection(id: string): void {
  const target = document.getElementById(id);
  if (!target) return;
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  target.scrollIntoView({
    behavior: prefersReduced ? "auto" : "smooth",
    block: "start",
  });
}
