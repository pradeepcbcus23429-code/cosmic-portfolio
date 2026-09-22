import type { Project } from "@/types/portfolio";
import { ArrowUpRight, Sparkles } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  /** Zero-based position, used for staggered reveal and deterministic markers. */
  index: number;
  onOpen: (project: Project) => void;
}

/**
 * A single clickable project tile: title, summary, and tech tags.
 * The whole card is a button so keyboard users get one clear target.
 */
export function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
  const visibleTags = project.techTags.slice(0, 4);
  const overflowCount = project.techTags.length - visibleTags.length;

  return (
    <button
      type="button"
      data-ocid={`projects.item.${index + 1}`}
      onClick={() => onOpen(project)}
      aria-label={`Open details for ${project.title}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl glass p-6 text-left transition-smooth hover:-translate-y-1.5 hover:shadow-glow-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {/* Luminous top edge that brightens on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-primary opacity-40 transition-smooth group-hover:opacity-100"
      />
      {/* Soft nebula wash revealed on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/20 opacity-0 blur-3xl transition-smooth group-hover:opacity-100"
      />

      <div className="relative flex items-start justify-between gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary transition-smooth group-hover:bg-primary group-hover:text-primary-foreground">
          <Sparkles className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-smooth group-hover:border-primary/50 group-hover:text-primary">
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </span>
      </div>

      <h3 className="relative mt-5 font-display text-xl font-semibold tracking-tight text-foreground transition-fast group-hover:text-primary">
        {project.title}
      </h3>
      <p className="relative mt-2.5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {project.summary}
      </p>

      <div className="relative mt-5 flex flex-wrap gap-2 pt-1">
        {visibleTags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground transition-fast group-hover:border-primary/30 group-hover:text-foreground"
          >
            {tag}
          </span>
        ))}
        {overflowCount > 0 && (
          <span className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">
            +{overflowCount}
          </span>
        )}
      </div>

      <span className="relative mt-6 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-primary opacity-0 transition-smooth group-hover:opacity-100">
        View project
      </span>
    </button>
  );
}
