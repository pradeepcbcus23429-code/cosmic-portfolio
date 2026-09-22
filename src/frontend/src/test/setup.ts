import "@testing-library/jest-dom/vitest";
import { cleanup, configure } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Generated components expose stable `data-ocid` hooks rather than data-testid.
configure({ testIdAttribute: "data-ocid" });

// jsdom does not implement matchMedia. The app reads it for reduced-motion and
// fine-pointer detection, so every render needs a working stub. Individual tests
// override `matches` via `setMediaQuery` below.
type MediaQueryListener = (event: MediaQueryListEvent) => void;

const mediaListeners = new Map<string, Set<MediaQueryListener>>();
const mediaMatches = new Map<string, boolean>();

export function setMediaQuery(query: string, matches: boolean): void {
  mediaMatches.set(query, matches);
  const listeners = mediaListeners.get(query);
  if (!listeners) return;
  for (const listener of listeners) {
    listener({ matches, media: query } as MediaQueryListEvent);
  }
}

export function resetMediaQueries(): void {
  mediaMatches.clear();
  mediaListeners.clear();
}

function createMediaQueryList(query: string): MediaQueryList {
  return {
    get matches() {
      return mediaMatches.get(query) ?? false;
    },
    media: query,
    onchange: null,
    addEventListener: (_type: string, listener: MediaQueryListener) => {
      const listeners = mediaListeners.get(query) ?? new Set();
      listeners.add(listener);
      mediaListeners.set(query, listeners);
    },
    removeEventListener: (_type: string, listener: MediaQueryListener) => {
      mediaListeners.get(query)?.delete(listener);
    },
    addListener: (listener: MediaQueryListener) => {
      const listeners = mediaListeners.get(query) ?? new Set();
      listeners.add(listener);
      mediaListeners.set(query, listeners);
    },
    removeListener: (listener: MediaQueryListener) => {
      mediaListeners.get(query)?.delete(listener);
    },
    dispatchEvent: () => true,
  } as unknown as MediaQueryList;
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  configurable: true,
  value: vi.fn((query: string) => createMediaQueryList(query)),
});

// jsdom does not implement IntersectionObserver. The scroll-spy hook and the
// motion `useInView` reveals both construct one; a no-op observer keeps renders
// from throwing while leaving the active-section state at its initial value.
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});
Object.defineProperty(globalThis, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// jsdom does not implement scrollIntoView; the smooth-scroll helper calls it.
Object.defineProperty(Element.prototype, "scrollIntoView", {
  writable: true,
  configurable: true,
  value: vi.fn(),
});

// jsdom does not implement requestAnimationFrame in every environment; the
// custom-cursor rAF loop needs it to exist.
if (typeof window.requestAnimationFrame !== "function") {
  window.requestAnimationFrame = ((callback: FrameRequestCallback) =>
    window.setTimeout(
      () => callback(performance.now()),
      16,
    )) as typeof window.requestAnimationFrame;
  window.cancelAnimationFrame = ((handle: number) =>
    window.clearTimeout(handle)) as typeof window.cancelAnimationFrame;
}

afterEach(() => {
  cleanup();
  resetMediaQueries();
  vi.clearAllMocks();
});
