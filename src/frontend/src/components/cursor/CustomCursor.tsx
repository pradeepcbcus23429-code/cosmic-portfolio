import { useCustomCursor } from "@/hooks/use-custom-cursor";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useEffect } from "react";

/**
 * Glowing ring + core dot that replaces the native pointer on fine-pointer
 * devices. The ring trails the pointer with a slight lag, expands over
 * interactive targets, and leaves a short particle trail.
 *
 * Renders nothing on touch devices or when the pointer has not moved yet, so
 * native behavior is fully preserved there.
 */
export function CustomCursor() {
  const prefersReduced = useReducedMotion();
  const { enabled, hovering, pressed, visible, trail, ringRef, dotRef } =
    useCustomCursor(prefersReduced);

  // Hide the native pointer only while the custom cursor is actually active.
  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("cursor-none-desktop");
    return () => root.classList.remove("cursor-none-desktop");
  }, [enabled]);

  if (!enabled) return null;

  const ringScale = pressed ? 0.82 : hovering ? 1.9 : 1;
  const dotScale = pressed ? 0.6 : hovering ? 0.4 : 1;

  return (
    <div
      aria-hidden="true"
      data-ocid="cursor.layer"
      className="pointer-events-none fixed inset-0 z-[100] overflow-hidden"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 200ms ease-out" }}
    >
      {trail.map((point, index) => {
        const age = (index + 1) / trail.length;
        return (
          <span
            key={point.id}
            className="absolute left-0 top-0 rounded-full"
            style={{
              width: `${4 + age * 5}px`,
              height: `${4 + age * 5}px`,
              marginLeft: `${-(4 + age * 5) / 2}px`,
              marginTop: `${-(4 + age * 5) / 2}px`,
              transform: `translate3d(${point.x}px, ${point.y}px, 0)`,
              background: `oklch(var(--cursor-trail) / ${0.05 + age * 0.3})`,
              boxShadow: `0 0 ${8 + age * 10}px oklch(var(--cursor-trail) / ${
                0.1 + age * 0.25
              })`,
            }}
          />
        );
      })}

      <div
        ref={ringRef}
        data-ocid="cursor.ring"
        className="absolute left-0 top-0"
        style={{ willChange: "transform" }}
      >
        <div
          className="absolute left-0 top-0 rounded-full border"
          style={{
            width: "34px",
            height: "34px",
            marginLeft: "-17px",
            marginTop: "-17px",
            borderColor: "oklch(var(--cursor-core) / 0.7)",
            boxShadow:
              "0 0 18px 2px oklch(var(--cursor-core) / 0.35), inset 0 0 12px oklch(var(--cursor-trail) / 0.25)",
            transform: `scale(${ringScale})`,
            transition: prefersReduced
              ? "none"
              : "transform 220ms var(--ease-out-cosmic), border-color 220ms var(--ease-out-cosmic)",
          }}
        />
      </div>

      <div
        ref={dotRef}
        data-ocid="cursor.dot"
        className="absolute left-0 top-0"
        style={{ willChange: "transform" }}
      >
        <div
          className="absolute left-0 top-0 rounded-full"
          style={{
            width: "7px",
            height: "7px",
            marginLeft: "-3.5px",
            marginTop: "-3.5px",
            background: "oklch(var(--cursor-core))",
            boxShadow: "0 0 12px 3px oklch(var(--cursor-core) / 0.55)",
            transform: `scale(${dotScale})`,
            transition: prefersReduced
              ? "none"
              : "transform 180ms var(--ease-out-cosmic)",
          }}
        />
      </div>
    </div>
  );
}
