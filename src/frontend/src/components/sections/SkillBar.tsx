import { useReducedMotion } from "@/hooks/use-reduced-motion";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { motion } from "motion/react";

interface SkillBarProps {
  name: string;
  /** Proficiency as a 0-100 percentage. */
  proficiency: number;
  /** Stagger offset in seconds so bars fill in sequence. */
  delay?: number;
  /** Whether the parent section has entered the viewport. */
  active: boolean;
}

/**
 * A single skill row: name, percentage readout, and a track whose fill animates
 * to the proficiency value once the section enters the viewport.
 */
export function SkillBar({
  name,
  proficiency,
  delay = 0,
  active,
}: SkillBarProps) {
  const prefersReduced = useReducedMotion();
  const clamped = Math.max(0, Math.min(100, Math.round(proficiency)));

  return (
    <li className="group/skill">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-foreground/90 transition-fast group-hover/skill:text-primary">
          {name}
        </span>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {clamped}%
        </span>
      </div>
      <ProgressPrimitive.Root
        value={clamped}
        aria-label={`${name} proficiency`}
        className="relative mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary"
      >
        <motion.span
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-primary"
          initial={false}
          animate={{ width: active ? `${clamped}%` : "0%" }}
          transition={
            prefersReduced
              ? { duration: 0 }
              : { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }
          }
        >
          <span className="absolute inset-0 rounded-full opacity-0 shadow-glow-cyan transition-fast group-hover/skill:opacity-100" />
        </motion.span>
      </ProgressPrimitive.Root>
    </li>
  );
}
