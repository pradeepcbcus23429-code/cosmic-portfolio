import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useMemo } from "react";

interface Particle {
  id: string;
  top: string;
  left: string;
  size: number;
  hue: "cyan" | "violet";
  delay: string;
  duration: string;
}

function seeded(seed: number): () => number {
  let value = seed;
  return () => {
    value = (value * 1103515245 + 12345) % 2147483648;
    return value / 2147483648;
  };
}

function buildParticles(count: number): Particle[] {
  const random = seeded(97);
  return Array.from({ length: count }, (_, index) => ({
    id: `particle-${index}`,
    top: `${(random() * 100).toFixed(2)}%`,
    left: `${(random() * 100).toFixed(2)}%`,
    size: Number((3 + random() * 7).toFixed(2)),
    hue: random() > 0.5 ? "cyan" : "violet",
    delay: `${(random() * 8).toFixed(2)}s`,
    duration: `${(9 + random() * 9).toFixed(2)}s`,
  }));
}

/**
 * Soft glowing dust motes drifting continuously behind the content.
 * Transform/opacity only, so it composites on the GPU and never blocks scroll.
 */
export function AmbientParticles() {
  const prefersReduced = useReducedMotion();
  const particles = useMemo(() => buildParticles(16), []);

  if (prefersReduced) return null;

  return (
    <div
      aria-hidden="true"
      data-ocid="background.particles"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="absolute rounded-full animate-float"
          style={{
            top: particle.top,
            left: particle.left,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background:
              particle.hue === "cyan"
                ? "oklch(var(--particle) / 0.75)"
                : "oklch(var(--nebula-violet) / 0.7)",
            boxShadow:
              particle.hue === "cyan"
                ? "0 0 14px 3px oklch(var(--particle) / 0.35)"
                : "0 0 16px 4px oklch(var(--nebula-violet) / 0.3)",
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
        />
      ))}
    </div>
  );
}
