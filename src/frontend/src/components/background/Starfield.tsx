import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useMemo } from "react";

interface Star {
  id: string;
  top: string;
  left: string;
  size: number;
  opacity: number;
  delay: string;
  duration: string;
}

/** Deterministic pseudo-random generator so the field is stable across renders. */
function seeded(seed: number): () => number {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function buildStars(count: number, seed: number, maxSize: number): Star[] {
  const random = seeded(seed);
  return Array.from({ length: count }, (_, index) => {
    const size = 0.6 + random() * maxSize;
    return {
      id: `star-${seed}-${index}`,
      top: `${(random() * 100).toFixed(2)}%`,
      left: `${(random() * 100).toFixed(2)}%`,
      size: Number(size.toFixed(2)),
      opacity: Number((0.25 + random() * 0.65).toFixed(2)),
      delay: `${(random() * 6).toFixed(2)}s`,
      duration: `${(3 + random() * 5).toFixed(2)}s`,
    };
  });
}

/**
 * Three parallax depth layers of drifting stars plus a soft nebula wash.
 * Pure CSS animation on transform/opacity only — no per-frame JS.
 */
export function Starfield() {
  const prefersReduced = useReducedMotion();

  const layers = useMemo(
    () => [
      {
        id: "far",
        stars: buildStars(70, 11, 1.1),
        className: "animate-drift-slow",
      },
      { id: "mid", stars: buildStars(45, 29, 1.6), className: "animate-drift" },
      {
        id: "near",
        stars: buildStars(22, 47, 2.2),
        className: "animate-drift-slow",
      },
    ],
    [],
  );

  return (
    <div
      aria-hidden="true"
      data-ocid="background.starfield"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-nebula opacity-90" />
      {layers.map((layer, layerIndex) => (
        <div
          key={layer.id}
          className={`absolute -inset-[10%] ${prefersReduced ? "" : layer.className}`}
          style={{ animationDelay: `${layerIndex * 3}s` }}
        >
          {layer.stars.map((star) => (
            <span
              key={star.id}
              className={`absolute rounded-full bg-[oklch(var(--star-core))] ${
                prefersReduced ? "" : "animate-twinkle"
              }`}
              style={{
                top: star.top,
                left: star.left,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity,
                animationDelay: star.delay,
                animationDuration: star.duration,
                boxShadow:
                  star.size > 1.6
                    ? "0 0 6px 1px oklch(var(--star-core) / 0.6)"
                    : undefined,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
