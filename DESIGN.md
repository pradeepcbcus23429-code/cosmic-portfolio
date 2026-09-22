# Design Brief

## Direction

Orbital — a deep-space portfolio that feels like drifting through a calm, luminous nebula: precise, professional, quietly spectacular.

## Tone

Refined cinematic sci-fi — dark, glassy, and high-contrast, executed with restraint so the motion reads as craft rather than spectacle.

## Differentiation

A living sky: parallax starfield, drifting dust motes, and a glowing cursor trail turn the whole viewport into a navigable instrument panel.

## Color Palette

| Token      | OKLCH         | Role                                  |
| ---------- | ------------- | ------------------------------------- |
| background | 0.13 0.025 265 | deep space navy-black canvas          |
| foreground | 0.94 0.012 265 | near-white star text                  |
| card       | 0.17 0.028 265 | glass panel base                      |
| primary    | 0.82 0.14 195  | luminous cyan — CTAs, active states   |
| accent     | 0.68 0.2 295   | violet glow — highlights, gradients   |
| muted      | 0.22 0.03 265  | recessed surfaces, secondary text     |
| border     | 0.3 0.03 265   | hairline dividers, glass edges        |
| star-core  | 0.98 0.02 220  | starfield bright points               |
| particle   | 0.85 0.08 210  | drifting dust motes                   |
| cursor-core| 0.88 0.13 195  | cursor orb center                     |
| cursor-trail| 0.7 0.18 285 | cursor trail particles                |

## Typography

- Display: Space Grotesk — hero name, section headings, nav wordmark (tight tracking, bold)
- Body: Satoshi — paragraphs, labels, UI copy
- Mono: JetBrains Mono — tech tags, section labels, metadata
- Scale: hero `text-5xl md:text-7xl font-bold tracking-tight`, h2 `text-3xl md:text-5xl font-bold tracking-tight`, label `text-sm font-semibold tracking-widest uppercase`, body `text-base md:text-lg`

## Elevation & Depth

Flat background with layered glass: `glass` panels (blur 16px) for cards, `glass-strong` for nav/popovers, `shadow-elevated` for lifted cards, `shadow-glow-cyan`/`shadow-glow-violet` for interactive focus.

## Structural Zones

| Zone    | Background                | Border          | Notes                                                        |
| ------- | ------------------------- | --------------- | ------------------------------------------------------------ |
| Header  | `glass-strong` translucent | `border-b`      | Sticky, blurred, active-section cyan underline + glow        |
| Content | transparent over nebula   | —               | Alternate `bg-muted/20` and transparent sections for rhythm  |
| Footer  | `bg-muted/40`             | `border-t`      | Recessed, quick-nav links + copyright, low-contrast star dust |

## Spacing & Rhythm

Sections `py-24 md:py-32` with `max-w-6xl` container; card grids `gap-6`; micro-spacing in 4/8px steps; generous line-height (`leading-relaxed`) for body copy.

## Component Patterns

- Buttons: pill (`rounded-full`) — primary = cyan→violet gradient, ghost = glass with hairline border; hover lifts + glow
- Cards: `rounded-2xl` glass, `border-border`, hover `shadow-elevated` + 2px lift + cyan edge
- Badges: mono uppercase, `rounded-full`, `bg-primary/10 text-primary` hairline border

## Motion

- Entrance: scroll reveal via `animate-fade-up` (0.7s cosmic ease), staggered per section child
- Hover: 150–300ms `--ease-out-cosmic`, translate-y lift + glow, cursor orb expands on interactive targets
- Decorative: starfield parallax drift, `animate-drift` motes, `animate-twinkle` stars, `animate-shooting` streaks, slow nebula drift — all CSS-driven, GPU transforms only

## Constraints

- Dark mode only — no light theme, no theme toggle
- All color via OKLCH tokens; no raw hex/rgb in components
- Ambient motion is CSS + transforms/opacity only (no per-frame JS layout); respect `prefers-reduced-motion`
- Custom cursor disabled on `pointer: coarse`; native cursor falls back

## Signature Detail

A cursor that is itself a small celestial body — a cyan orb with a lagging violet particle trail that brightens and swells over interactive elements, echoing the starfield behind it.
