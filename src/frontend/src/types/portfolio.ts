import type { Project, ProjectLink, Skill, SkillGroup } from "@/backend";

export type { Project, ProjectLink, Skill, SkillGroup };

/** A single entry in the sticky navigation / scroll-spy registry. */
export interface SectionDef {
  /** DOM id of the section element, also used as the anchor target. */
  id: string;
  /** Human-readable label shown in the nav. */
  label: string;
}

/** A social / external link rendered in the contact section and footer. */
export interface SocialLink {
  label: string;
  href: string;
  /** lucide-react icon name resolved by the consuming component. */
  icon: "github" | "linkedin" | "twitter" | "mail";
}
