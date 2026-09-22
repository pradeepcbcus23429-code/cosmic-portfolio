import { AmbientParticles } from "@/components/background/AmbientParticles";
import { ShootingStars } from "@/components/background/ShootingStars";
import { Starfield } from "@/components/background/Starfield";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { setMediaQuery } from "@/test/setup";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const FINE_POINTER = "(pointer: fine)";

describe("reduced-motion preference", () => {
  it("renders the starfield but drops its drift/twinkle animation classes", () => {
    setMediaQuery(REDUCED_MOTION, true);
    render(<Starfield />);

    const starfield = screen.getByTestId("background.starfield");
    expect(starfield).toBeInTheDocument();
    expect(starfield.querySelector(".animate-drift")).toBeNull();
    expect(starfield.querySelector(".animate-drift-slow")).toBeNull();
    expect(starfield.querySelector(".animate-twinkle")).toBeNull();
  });

  it("keeps the starfield animated when motion is not reduced", () => {
    setMediaQuery(REDUCED_MOTION, false);
    render(<Starfield />);

    const starfield = screen.getByTestId("background.starfield");
    expect(starfield.querySelector(".animate-drift")).not.toBeNull();
    expect(starfield.querySelector(".animate-twinkle")).not.toBeNull();
  });

  it("omits ambient particles entirely when motion is reduced", () => {
    setMediaQuery(REDUCED_MOTION, true);
    render(<AmbientParticles />);

    expect(screen.queryByTestId("background.particles")).toBeNull();
  });

  it("renders ambient particles when motion is not reduced", () => {
    setMediaQuery(REDUCED_MOTION, false);
    render(<AmbientParticles />);

    expect(screen.getByTestId("background.particles")).toBeInTheDocument();
  });

  it("never schedules a shooting star when motion is reduced", () => {
    setMediaQuery(REDUCED_MOTION, true);
    render(<ShootingStars />);

    expect(screen.queryByTestId("background.shooting_star")).toBeNull();
  });
});

describe("custom cursor pointer gating", () => {
  it("renders the custom cursor layer on a fine-pointer device", () => {
    setMediaQuery(FINE_POINTER, true);
    render(<CustomCursor />);

    expect(screen.getByTestId("cursor.layer")).toBeInTheDocument();
    expect(screen.getByTestId("cursor.ring")).toBeInTheDocument();
    expect(screen.getByTestId("cursor.dot")).toBeInTheDocument();
  });

  it("renders nothing and leaves the native cursor on a touch device", () => {
    setMediaQuery(FINE_POINTER, false);
    render(<CustomCursor />);

    expect(screen.queryByTestId("cursor.layer")).toBeNull();
    expect(
      document.documentElement.classList.contains("cursor-none-desktop"),
    ).toBe(false);
  });
});
