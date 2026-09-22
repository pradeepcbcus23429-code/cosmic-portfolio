import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Code2, Compass, Rocket } from "lucide-react";
import { motion } from "motion/react";

const HIGHLIGHTS = [
  {
    id: "craft",
    icon: Code2,
    title: "Interface craft",
    body: "Accessible, typed React systems with motion that clarifies rather than decorates.",
  },
  {
    id: "depth",
    icon: Compass,
    title: "Depth & motion",
    body: "WebGL, shaders, and choreographed transitions that make products feel alive.",
  },
  {
    id: "ship",
    icon: Rocket,
    title: "Ship velocity",
    body: "Design systems and tooling that keep teams fast without sacrificing polish.",
  },
];

/**
 * About section: professional bio beside a cosmic-treated portrait, with
 * scroll-triggered reveals that respect the reduced-motion preference.
 */
export function About() {
  const prefersReduced = useReducedMotion();

  const reveal = (delay = 0) => ({
    initial: prefersReduced ? false : { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: prefersReduced ? 0 : delay,
    },
  });

  return (
    <section
      id="about"
      data-ocid="about.section"
      className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6"
    >
      <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <motion.div {...reveal()} className="relative mx-auto w-full max-w-sm">
          <div
            aria-hidden="true"
            className="absolute -inset-8 rounded-full bg-accent/10 blur-3xl"
          />
          <div className="relative overflow-hidden rounded-[2rem] border border-border/70 shadow-elevated">
            <img
              src="/assets/generated/about-workspace.dim_800x1000.jpg"
              alt="A dark studio desk lit in cyan and violet, with a glowing holographic star map and a small model spacecraft"
              width={800}
              height={1000}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-tr from-accent/20 via-transparent to-primary/20 mix-blend-screen"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute -bottom-5 -right-5 hidden h-24 w-24 rounded-2xl border border-primary/30 bg-background/70 backdrop-blur sm:block"
          />
        </motion.div>

        <div>
          <motion.p
            {...reveal()}
            className="font-mono text-xs uppercase tracking-[0.3em] text-primary"
          >
            About
          </motion.p>

          <motion.h2
            {...reveal(0.05)}
            className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl"
          >
            Designing at the edge of{" "}
            <span className="text-gradient">interface and space</span>
          </motion.h2>

          <motion.p
            {...reveal(0.1)}
            className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            I'm Nova, a creative developer with six years spent turning
            ambitious ideas into interfaces people actually enjoy using. My work
            sits where engineering rigor meets visual storytelling — performance
            budgets, accessible components, and motion that earns its place.
          </motion.p>

          <motion.p
            {...reveal(0.15)}
            className="mt-4 text-base leading-relaxed text-muted-foreground"
          >
            Lately I've been exploring real-time 3D on the web, building design
            systems that scale, and helping teams ship polished products without
            slowing down.
          </motion.p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {HIGHLIGHTS.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <motion.div
                  key={highlight.id}
                  {...reveal(0.2 + index * 0.08)}
                  className="group rounded-2xl border border-border/70 bg-card/40 p-5 backdrop-blur transition-smooth hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow-cyan"
                >
                  <Icon
                    className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110"
                    aria-hidden="true"
                  />
                  <h3 className="mt-3 font-display text-sm font-semibold text-foreground">
                    {highlight.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {highlight.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
