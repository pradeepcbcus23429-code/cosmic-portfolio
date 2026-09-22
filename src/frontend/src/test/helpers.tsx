import type { ContactInput, Project, SkillGroup } from "@/backend";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type RenderOptions, render } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { vi } from "vitest";

/**
 * The subset of the generated `Backend` actor the portfolio UI consumes.
 * Typed against the app's own exported types so a contract drift in the
 * generated bindings surfaces here rather than at runtime.
 */
export interface MockActor {
  listProjects: () => Promise<Project[]>;
  listSkillGroups: () => Promise<SkillGroup[]>;
  submitContactMessage: (
    input: ContactInput,
  ) => Promise<
    { __kind__: "ok"; ok: bigint } | { __kind__: "err"; err: unknown }
  >;
}

export function createMockActor(overrides: Partial<MockActor> = {}): MockActor {
  return {
    listProjects: vi.fn(async () => []),
    listSkillGroups: vi.fn(async () => []),
    submitContactMessage: vi.fn(async () => ({
      __kind__: "ok" as const,
      ok: 1n,
    })),
    ...overrides,
  };
}

/**
 * The `useActor` hook from core-infrastructure is mocked per test file so the
 * UI never reaches a real canister. `actor` is the local typed mock above.
 */
export function mockUseActor(actor: MockActor | undefined) {
  return { actor, isFetching: false };
}

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });
}

interface ProvidersProps {
  children: ReactNode;
  queryClient?: QueryClient;
}

export function Providers({ children, queryClient }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient ?? createTestQueryClient()}>
      {children}
    </QueryClientProvider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options: Omit<RenderOptions, "wrapper"> & { queryClient?: QueryClient } = {},
) {
  const { queryClient, ...renderOptions } = options;
  return render(ui, {
    wrapper: ({ children }) => (
      <Providers queryClient={queryClient}>{children}</Providers>
    ),
    ...renderOptions,
  });
}

export const sampleProjects: Project[] = [
  {
    id: 0n,
    title: "Orbital Telemetry Dashboard",
    summary:
      "Real-time telemetry visualisation for a fleet of small satellites.",
    description:
      "A mission-control dashboard that ingests telemetry and renders live orbital tracks.",
    techTags: ["Motoko", "React", "WebGL", "Internet Computer", "Extra"],
    links: [
      { labelText: "Live demo", url: "https://example.com/orbital-telemetry" },
      {
        labelText: "Source",
        url: "https://github.com/example/orbital-telemetry",
      },
    ],
    order: 0n,
  },
  {
    id: 1n,
    title: "Nebula Design System",
    summary:
      "A component library and token pipeline for deep-space interfaces.",
    description:
      "A design system built for low-light, high-contrast environments.",
    techTags: ["TypeScript", "Tailwind"],
    links: [{ labelText: "Documentation", url: "https://example.com/nebula" }],
    order: 1n,
  },
];

export const sampleSkillGroups: SkillGroup[] = [
  {
    id: 0n,
    category: "Languages",
    order: 0n,
    skills: [
      { name: "Motoko", proficiency: 92n, order: 0n },
      { name: "TypeScript", proficiency: 95n, order: 1n },
    ],
  },
  {
    id: 1n,
    category: "Frontend",
    order: 1n,
    skills: [{ name: "React", proficiency: 94n, order: 0n }],
  },
];
