import { type RefObject, useEffect, useRef, useState } from "react";

/** A single trail mote emitted behind the cursor. */
export interface CursorTrailPoint {
  id: number;
  x: number;
  y: number;
}

export interface CustomCursorState {
  /** True when a fine pointer is present and the custom cursor should render. */
  enabled: boolean;
  /** True while the pointer is over an interactive target. */
  hovering: boolean;
  /** True while the primary button is held down. */
  pressed: boolean;
  /** True once the pointer has moved at least once. */
  visible: boolean;
  /** Recent trail motes, newest last. */
  trail: CursorTrailPoint[];
  /** Attach to the element the rAF loop transforms for the trailing ring. */
  ringRef: RefObject<HTMLDivElement | null>;
  /** Attach to the element the rAF loop transforms for the core dot. */
  dotRef: RefObject<HTMLDivElement | null>;
}

const FINE_POINTER_QUERY = "(pointer: fine)";
const INTERACTIVE_SELECTOR =
  'a[href], button, [role="button"], input, select, textarea, summary, label, [data-cursor="interactive"]';

const TRAIL_LENGTH = 6;
const TRAIL_INTERVAL_MS = 55;
const LAG = 0.18;

/**
 * Drives the custom cursor: pointer tracking, interactive-target detection,
 * press state, and a throttled particle trail.
 *
 * All motion runs through a single requestAnimationFrame loop that writes
 * transforms only — no layout reads inside the loop, no React re-render per
 * frame. Listeners and the frame loop are torn down on unmount.
 */
export function useCustomCursor(reducedMotion: boolean): CustomCursorState {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [trail, setTrail] = useState<CursorTrailPoint[]>([]);

  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const lastTrailAt = useRef(0);
  const trailId = useRef(0);

  // Enable only on devices with a fine pointer.
  useEffect(() => {
    const mediaQuery = window.matchMedia(FINE_POINTER_QUERY);
    const sync = () => setEnabled(mediaQuery.matches);
    sync();
    mediaQuery.addEventListener("change", sync);
    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

  // Pointer tracking + interactive detection.
  useEffect(() => {
    if (!enabled) return;

    const handleMove = (event: PointerEvent) => {
      target.current.x = event.clientX;
      target.current.y = event.clientY;
      setVisible(true);

      const element = event.target;
      const interactive =
        element instanceof Element &&
        element.closest(INTERACTIVE_SELECTOR) !== null;
      setHovering(interactive);
    };

    const handleDown = () => setPressed(true);
    const handleUp = () => setPressed(false);
    const handleLeave = () => setVisible(false);
    const handleEnter = () => setVisible(true);

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerdown", handleDown, { passive: true });
    window.addEventListener("pointerup", handleUp, { passive: true });
    document.addEventListener("pointerleave", handleLeave);
    document.addEventListener("pointerenter", handleEnter);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      document.removeEventListener("pointerleave", handleLeave);
      document.removeEventListener("pointerenter", handleEnter);
    };
  }, [enabled]);

  // Single rAF loop: lerp the ring, snap the dot, emit trail motes.
  useEffect(() => {
    if (!enabled) return;

    let frame = 0;
    const step = (now: number) => {
      const ring = ringRef.current;
      const dot = dotRef.current;
      const { x, y } = target.current;

      if (ring) {
        const ease = reducedMotion ? 1 : LAG;
        ringPos.current.x += (x - ringPos.current.x) * ease;
        ringPos.current.y += (y - ringPos.current.y) * ease;
        ring.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }
      if (dot) {
        dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      if (!reducedMotion && now - lastTrailAt.current > TRAIL_INTERVAL_MS) {
        lastTrailAt.current = now;
        trailId.current += 1;
        const id = trailId.current;
        setTrail((current) => [
          ...current.slice(-(TRAIL_LENGTH - 1)),
          { id, x, y },
        ]);
      }

      frame = window.requestAnimationFrame(step);
    };

    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [enabled, reducedMotion]);

  // Retire trail motes after their fade-out completes.
  useEffect(() => {
    if (trail.length === 0) return;
    const timer = window.setTimeout(() => {
      setTrail((current) => current.slice(1));
    }, 420);
    return () => window.clearTimeout(timer);
  }, [trail]);

  return { enabled, hovering, pressed, visible, trail, ringRef, dotRef };
}
