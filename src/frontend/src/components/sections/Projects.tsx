import { ProjectCard } from "@/components/sections/ProjectCard";
import { ProjectDetail } from "@/components/sections/ProjectDetail";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useProjects } from "@/hooks/useQueries";
import type { Project } from "@/types/portfolio";
import { FolderGit2, RefreshCw, Rocket } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const SKELETON_IDS = Array.from(
  { length: 6 },
  (_, index) => `project-skeleton-${index}`,
);

/**
 * Projects section: a responsive grid of clickable cards loaded from the
 * backend, each opening a modal detail view. Reveals on scroll and honors
 * the reduced-motion preference.
 */
export function Projects() {
  const prefersReduced = useReducedMotion();
  const { data: projects, isLoading, isError, refetch } = useProjects();
  const [selected, setSelected] = useState<Project | null>(null);

  const items = projects ?? [];
  const isEmpty = !isLoading && !isError && items.length === 0;

  const reveal = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section
      id="projects"
      data-ocid="projects.section"
      className="relative mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6 sm:py-28"
    >
      <motion.div {...reveal} className="max-w-2xl">
        <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-primary">
          <FolderGit2 className="h-3.5 w-3.5" aria-hidden="true" />
          Selected work
        </p>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          <span className="text-gradient">Projects</span> launched into orbit
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          A selection of products and experiments I have designed and shipped —
          from immersive interfaces to production systems. Open any card for the
          full story.
        </p>
      </motion.div>

      <div className="mt-12">
        {isLoading && (
          <div
            data-ocid="projects.loading_state"
            aria-busy="true"
            aria-live="polite"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <span className="sr-only">Loading projects…</span>
            {SKELETON_IDS.map((id) => (
              <div
                key={id}
                className="flex h-64 flex-col rounded-2xl glass p-6"
              >
                <div className="h-10 w-10 animate-pulse rounded-xl bg-secondary" />
                <div className="mt-5 h-5 w-2/3 animate-pulse rounded-full bg-secondary" />
                <div className="mt-3 h-3 w-full animate-pulse rounded-full bg-secondary/70" />
                <div className="mt-2 h-3 w-5/6 animate-pulse rounded-full bg-secondary/70" />
                <div className="mt-auto flex gap-2 pt-6">
                  <div className="h-6 w-16 animate-pulse rounded-full bg-secondary/70" />
                  <div className="h-6 w-20 animate-pulse rounded-full bg-secondary/70" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div
            data-ocid="projects.error_state"
            role="alert"
            className="flex flex-col items-center rounded-2xl glass px-6 py-14 text-center"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/15 text-destructive">
              <RefreshCw className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
              Could not load projects
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              The connection to the backend was interrupted. Try again in a
              moment.
            </p>
            <button
              type="button"
              data-ocid="projects.retry_button"
              onClick={() => void refetch()}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-fast hover:shadow-glow-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Retry
            </button>
          </div>
        )}

        {isEmpty && (
          <div
            data-ocid="projects.empty_state"
            className="flex flex-col items-center rounded-2xl glass px-6 py-14 text-center"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
              <Rocket className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
              No projects in orbit yet
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              New work is being prepared for launch. Check back soon.
            </p>
          </div>
        )}

        {!isLoading && !isError && items.length > 0 && (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((project, index) => (
              <motion.li
                key={project.id.toString()}
                initial={prefersReduced ? undefined : { opacity: 0, y: 24 }}
                whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={
                  prefersReduced
                    ? undefined
                    : {
                        duration: 0.5,
                        delay: Math.min(index * 0.08, 0.4),
                        ease: [0.22, 1, 0.36, 1],
                      }
                }
                className="h-full"
              >
                <ProjectCard
                  project={project}
                  index={index}
                  onOpen={setSelected}
                />
              </motion.li>
            ))}
          </ul>
        )}
      </div>

      <ProjectDetail
        project={selected}
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      />
    </section>
  );
}
