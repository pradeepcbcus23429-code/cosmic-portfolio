import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Project } from "@/types/portfolio";
import { ExternalLink, Sparkles } from "lucide-react";

interface ProjectDetailProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal detail view for a project: full description, tech tags, and links.
 * Radix Dialog supplies Escape handling, focus trapping, and focus restoration.
 */
export function ProjectDetail({
  project,
  open,
  onOpenChange,
}: ProjectDetailProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-ocid="projects.dialog"
        className="max-h-[88vh] gap-0 overflow-hidden border-border/70 bg-popover/95 p-0 backdrop-blur-xl sm:max-w-2xl"
      >
        {project && (
          <div className="flex max-h-[88vh] flex-col">
            <div className="relative shrink-0 overflow-hidden border-b border-border/60 px-6 pb-6 pt-7 sm:px-8">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-24 h-52 w-52 rounded-full bg-accent/25 blur-3xl"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-primary/20 blur-3xl"
              />
              <DialogHeader className="relative gap-3 text-left">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow-cyan">
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                </span>
                <DialogTitle className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  {project.title}
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                  {project.summary}
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                {project.description}
              </p>

              {project.techTags.length > 0 && (
                <div className="mt-7">
                  <h4 className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-muted-foreground">
                    Tech stack
                  </h4>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {project.techTags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-primary/25 bg-secondary/60 px-3 py-1 font-mono text-xs uppercase tracking-wider text-primary"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.links.length > 0 && (
                <div className="mt-7">
                  <h4 className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-muted-foreground">
                    Links
                  </h4>
                  <ul className="mt-3 flex flex-col gap-2.5">
                    {project.links.map((link) => (
                      <li key={`${link.labelText}-${link.url}`}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm font-medium text-foreground transition-fast hover:border-primary/50 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <span className="min-w-0 truncate">
                            {link.labelText}
                          </span>
                          <ExternalLink
                            className="h-4 w-4 shrink-0 text-muted-foreground transition-fast group-hover:text-primary"
                            aria-hidden="true"
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
