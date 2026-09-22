import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { scrollToSection } from "@/lib/sections";
import { ArrowRight, Mail, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const STATS = [
  { id: "years", value: "6+", label: "Years shipping" },
  { id: "projects", value: "40+", label: "Products launched" },
  { id: "focus", value: "WebGL", label: "Immersive focus" },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/**
 * Landing hero: identity, role tagline, animated CTAs, and a floating
 * orbital portrait card. Reveals on mount and honors reduced motion.
 */
export function Hero() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="hero"
      data-ocid="hero.section"
      className="relative mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl items-center px-4 py-16 sm:px-6"
    >
      <div className="grid w-full items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        <motion.div
          variants={container}
          initial={prefersReduced ? false : "hidden"}
          animate="show"
          className="max-w-2xl"
        >
          <motion.p
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3.5 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Creative Developer
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-6 font-display text-4xl font-bold leading-[1.03] tracking-tight sm:text-6xl lg:text-7xl"
          >
            <span className="text-gradient">Crafting cosmic</span>
            <br />
            <span className="text-foreground">digital experiences</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            I build fast, expressive interfaces where motion and depth serve the
            story — from immersive WebGL scenes to production-grade React
            applications.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <button
              type="button"
              data-ocid="hero.primary_button"
              onClick={() => scrollToSection("projects")}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow-cyan transition-smooth hover:-translate-y-0.5 hover:shadow-glow-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              View my work
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </button>

            <button
              type="button"
              data-ocid="hero.secondary_button"
              onClick={() => scrollToSection("contact")}
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur transition-smooth hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary hover:shadow-glow-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Get in touch
            </button>
          </motion.div>

          <motion.dl
            variants={item}
            className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-border/60 pt-6"
          >
            {STATS.map((stat) => (
              <div key={stat.id}>
                <dt className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                  {stat.label}
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold text-foreground">
                  {stat.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div
          initial={prefersReduced ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="relative mx-auto hidden w-full max-w-sm lg:block"
        >
          <div
            aria-hidden="true"
            className="absolute -inset-10 rounded-full bg-primary/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -inset-6 animate-orbit rounded-full border border-dashed border-primary/20"
          />
          <div className="relative animate-float overflow-hidden rounded-[2rem] border border-border/70 shadow-elevated">
            <img
              src="/assets/generated/portrait-astronaut.dim_800x1000.jpg"
              alt="Portrait of Nova, a creative developer, lit by cyan and violet light"
              width={800}
              height={1000}
              loading="eager"
              className="h-full w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"
            />
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl border border-border/60 bg-background/60 px-4 py-3 backdrop-blur">
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                Available for work
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
                Open
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
