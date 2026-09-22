import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { SECTIONS, scrollToSection } from "@/lib/sections";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const SECTION_IDS = SECTIONS.map((section) => section.id);

/**
 * Sticky glass navigation with smooth-scroll links and scroll-spy highlighting.
 * Collapses to a disclosure panel below the md breakpoint.
 */
export function Nav() {
  const activeId = useScrollSpy(SECTION_IDS);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    // Let modified clicks (new tab, download, etc.) use native anchor behavior.
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    setMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <header
      data-ocid="nav.header"
      className={`fixed inset-x-0 top-0 z-50 transition-smooth ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
      >
        <div
          className={`flex w-full items-center justify-between gap-4 rounded-full px-4 py-2.5 transition-smooth sm:px-5 ${
            scrolled ? "glass-strong shadow-elevated" : "glass"
          }`}
        >
          <a
            href="#hero"
            data-ocid="nav.brand_link"
            className="group flex items-center gap-2.5 rounded-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span className="relative flex h-2.5 w-2.5 items-center justify-center">
              <span className="absolute h-2.5 w-2.5 rounded-full bg-primary animate-pulse-glow" />
              <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground/80" />
            </span>
            <span className="font-display text-sm font-semibold tracking-tight text-foreground sm:text-base">
              Nova<span className="text-gradient">.dev</span>
            </span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {SECTIONS.map((section) => {
              const isActive = activeId === section.id;
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    data-ocid={`nav.link.${section.id}`}
                    onClick={(event) => handleNavigate(event, section.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative inline-block rounded-full px-3.5 py-2 text-sm font-medium transition-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {section.label}
                    <span
                      className={`absolute inset-x-3 -bottom-0.5 h-px origin-center bg-gradient-primary transition-smooth ${
                        isActive
                          ? "scale-x-100 opacity-100"
                          : "scale-x-0 opacity-0"
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            data-ocid="nav.menu_toggle"
            aria-expanded={menuOpen}
            aria-controls="nav-mobile-panel"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-fast hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          id="nav-mobile-panel"
          data-ocid="nav.mobile_panel"
          className="mx-auto mt-2 max-w-6xl px-4 sm:px-6 md:hidden"
        >
          <ul className="glass-strong flex flex-col gap-1 rounded-2xl p-2 shadow-elevated">
            {SECTIONS.map((section) => {
              const isActive = activeId === section.id;
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    data-ocid={`nav.mobile_link.${section.id}`}
                    onClick={(event) => handleNavigate(event, section.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={`block w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      isActive
                        ? "bg-secondary text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {section.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
