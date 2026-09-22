import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { SECTIONS } from "@/lib/sections";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

function mountSections() {
  for (const section of SECTIONS) {
    const element = document.createElement("section");
    element.id = section.id;
    document.body.appendChild(element);
  }
}

describe("sticky navigation", () => {
  beforeEach(() => {
    mountSections();
  });

  it("renders a link for every section", () => {
    render(<Nav />);

    const nav = screen.getByRole("navigation", { name: "Primary" });
    for (const section of SECTIONS) {
      expect(
        within(nav).getByRole("link", { name: section.label }),
      ).toHaveAttribute("href", `#${section.id}`);
    }
  });

  it("smooth-scrolls to the target section on click", async () => {
    const user = userEvent.setup();
    const scrollIntoView = vi.spyOn(Element.prototype, "scrollIntoView");
    render(<Nav />);

    const nav = screen.getByRole("navigation", { name: "Primary" });
    await user.click(within(nav).getByRole("link", { name: "Projects" }));

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });
  });

  it("uses instant scrolling when reduced motion is preferred", async () => {
    const user = userEvent.setup();
    const scrollIntoView = vi.spyOn(Element.prototype, "scrollIntoView");
    const { setMediaQuery } = await import("@/test/setup");
    setMediaQuery("(prefers-reduced-motion: reduce)", true);
    render(<Nav />);

    const nav = screen.getByRole("navigation", { name: "Primary" });
    await user.click(within(nav).getByRole("link", { name: "Skills" }));

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: "auto",
      block: "start",
    });
  });

  it("toggles the mobile disclosure panel", async () => {
    const user = userEvent.setup();
    render(<Nav />);

    const toggle = screen.getByTestId("nav.menu_toggle");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByTestId("nav.mobile_panel")).toBeNull();

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    const panel = screen.getByTestId("nav.mobile_panel");
    expect(
      within(panel).getByRole("link", { name: "Contact" }),
    ).toBeInTheDocument();
  });
});

describe("footer", () => {
  beforeEach(() => {
    mountSections();
  });

  it("shows the copyright and quick navigation for every section", () => {
    render(<Footer />);

    const year = new Date().getFullYear();
    expect(
      screen.getByText(`© ${year} Nova.dev. All rights reserved.`),
    ).toBeInTheDocument();

    const footerNav = screen.getByRole("navigation", { name: "Footer" });
    for (const section of SECTIONS) {
      expect(
        within(footerNav).getByRole("button", { name: section.label }),
      ).toBeInTheDocument();
    }
  });

  it("scrolls to a section from the footer quick nav", async () => {
    const user = userEvent.setup();
    const scrollIntoView = vi.spyOn(Element.prototype, "scrollIntoView");
    render(<Footer />);

    const footerNav = screen.getByRole("navigation", { name: "Footer" });
    await user.click(within(footerNav).getByRole("button", { name: "About" }));

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });
  });
});
