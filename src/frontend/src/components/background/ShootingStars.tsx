import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useEffect, useState } from "react";

interface Streak {
  id: number;
  top: string;
  left: string;
  delay: string;
}

/**
 * Occasional shooting-star streaks. A single interval spawns one streak at a
 * time and removes it when the CSS animation finishes, so nothing accumulates.
 */
export function ShootingStars() {
  const prefersReduced = useReducedMotion();
  const [streak, setStreak] = useState<Streak | null>(null);

  useEffect(() => {
    if (prefersReduced) return;

    let counter = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const schedule = () => {
      const wait = 6000 + Math.random() * 9000;
      timeout = setTimeout(() => {
        counter += 1;
        setStreak({
          id: counter,
          top: `${Math.random() * 45}%`,
          left: `${Math.random() * 30}%`,
          delay: "0s",
        });
        schedule();
      }, wait);
    };

    schedule();
    return () => clearTimeout(timeout);
  }, [prefersReduced]);

  if (prefersReduced || !streak) return null;

  return (
    <div
      aria-hidden="true"
      data-ocid="background.shooting_star"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <span
        key={streak.id}
        className="absolute h-px w-40 animate-shooting rounded-full"
        style={{
          top: streak.top,
          left: streak.left,
          background:
            "linear-gradient(90deg, transparent, oklch(var(--star-core)), oklch(var(--nebula-violet)))",
          boxShadow: "0 0 12px 2px oklch(var(--star-core) / 0.55)",
          animationDelay: streak.delay,
        }}
        onAnimationEnd={() => setStreak(null)}
      />
    </div>
  );
}
