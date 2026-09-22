import { SkillBar } from "@/components/sections/SkillBar";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useSkillGroups } from "@/hooks/useQueries";
import type { SkillGroup } from "@/types/portfolio";
import { Layers, Sparkles } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

const SKELETON_IDS = Array.from({ length: 3 }, (_, i) => `skill-skeleton-${i}`);

function SkillsSkeleton() {
  return (
    <div
      data-ocid="skills.loading_state"
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {SKELETON_IDS.map((id) => (
        <div key={id} className="glass rounded-2xl p-6">
          <div className="h-4 w-28 animate-pulse rounded-full bg-secondary" />
          <div className="mt-6 space-y-5">
            {SKELETON_IDS.map((rowId) => (
              <div key={`${id}-${rowId}`}>
                <div className="h-3 w-24 animate-pulse rounded-full bg-secondary" />
                <div className="mt-2 h-1.5 w-full animate-pulse rounded-full bg-secondary" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SkillsEmpty() {
  return (
    <div
      data-ocid="skills.empty_state"
      className="glass flex flex-col items-center rounded-2xl px-6 py-16 text-center"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-secondary/60 text-primary">
        <Layers className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
        Skill map is being charted
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Capabilities will appear here once they are published. Check back soon.
      </p>
    </div>
  );
}

function SkillGroupCard({
  group,
  index,
  active,
}: {
  group: SkillGroup;
  index: number;
  active: boolean;
}) {
  const prefersReduced = useReducedMotion();
  const skills = [...group.skills].sort((a, b) => Number(a.order - b.order));

  return (
    <motion.article
      data-ocid={`skills.card.${index + 1}`}
      initial={prefersReduced ? false : { opacity: 0, y: 24 }}
      animate={active ? { opacity: 1, y: 0 } : undefined}
      transition={
        prefersReduced
          ? { duration: 0 }
          : { duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }
      }
      className="glass group/card relative overflow-hidden rounded-2xl p-6 transition-smooth hover:-translate-y-1 hover:shadow-glow-cyan"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-accent/10 blur-2xl transition-smooth group-hover/card:bg-accent/20"
      />
      <div className="relative flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary/60 text-primary">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </span>
        <h3 className="font-display text-base font-semibold tracking-tight text-foreground">
          {group.category}
        </h3>
      </div>
      <ul className="relative mt-6 space-y-5">
        {skills.map((skill, skillIndex) => (
          <SkillBar
            key={`${group.id}-${skill.name}`}
            name={skill.name}
            proficiency={Number(skill.proficiency)}
            delay={index * 0.08 + skillIndex * 0.06}
            active={active}
          />
        ))}
      </ul>
    </motion.article>
  );
}

/** Skills section: grouped categories with proficiency bars that fill on reveal. */
export function Skills() {
  const { data, isLoading, isError, refetch } = useSkillGroups();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });
  const groups = data ?? [];

  return (
    <section
      id="skills"
      ref={sectionRef}
      data-ocid="skills.section"
      className="relative mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6"
    >
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          Capabilities
        </p>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="text-gradient">Skills &amp; toolkit</span>
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          A working map of the languages, frameworks, and disciplines I use to
          ship polished products end to end.
        </p>
      </div>

      <div className="mt-12">
        {isLoading ? (
          <SkillsSkeleton />
        ) : isError ? (
          <div
            data-ocid="skills.error_state"
            className="glass flex flex-col items-center rounded-2xl px-6 py-16 text-center"
          >
            <h3 className="font-display text-lg font-semibold text-foreground">
              Couldn&apos;t load skills
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Something interrupted the connection. Try again in a moment.
            </p>
            <button
              type="button"
              data-ocid="skills.retry_button"
              onClick={() => void refetch()}
              className="mt-6 rounded-full border border-primary/40 px-5 py-2 text-sm font-medium text-primary transition-fast hover:bg-primary/10 hover:shadow-glow-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Retry
            </button>
          </div>
        ) : groups.length === 0 ? (
          <SkillsEmpty />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group, index) => (
              <SkillGroupCard
                key={group.id.toString()}
                group={group}
                index={index}
                active={inView}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
