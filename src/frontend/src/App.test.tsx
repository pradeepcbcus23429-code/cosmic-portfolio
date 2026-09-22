import App from "@/App";
import {
  createMockActor,
  renderWithProviders,
  sampleProjects,
  sampleSkillGroups,
} from "@/test/helpers";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const useActorMock = vi.hoisted(() => vi.fn());

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: useActorMock,
}));

describe("App critical journey", () => {
  beforeEach(() => {
    useActorMock.mockReturnValue({
      actor: createMockActor({
        listProjects: vi.fn(async () => sampleProjects),
        listSkillGroups: vi.fn(async () => sampleSkillGroups),
      }),
      isFetching: false,
    });
  });

  it("renders the landing view with all five sections and no blank screen", async () => {
    renderWithProviders(<App />);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    for (const id of ["hero", "about", "projects", "skills", "contact"]) {
      expect(document.getElementById(id)).not.toBeNull();
    }
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders the starfield and ambient particle background layers", () => {
    renderWithProviders(<App />);

    expect(screen.getByTestId("background.starfield")).toBeInTheDocument();
    expect(screen.getByTestId("background.particles")).toBeInTheDocument();
  });

  it("exposes sticky nav links for every section and marks the active one", () => {
    renderWithProviders(<App />);

    const nav = screen.getByRole("navigation", { name: "Primary" });
    for (const label of ["Home", "About", "Projects", "Skills", "Contact"]) {
      expect(
        within(nav).getByRole("link", { name: label }),
      ).toBeInTheDocument();
    }
    // Scroll-spy starts on the first section.
    expect(within(nav).getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("opens a project detail view with description, tech tags, and links", async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);

    const card = await screen.findByRole("button", {
      name: /Open details for Orbital Telemetry Dashboard/i,
    });
    await user.click(card);

    const dialog = await screen.findByRole("dialog");
    expect(
      within(dialog).getByRole("heading", {
        name: "Orbital Telemetry Dashboard",
      }),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(/mission-control dashboard/i),
    ).toBeInTheDocument();
    expect(within(dialog).getByText("Motoko")).toBeInTheDocument();
    expect(
      within(dialog).getByRole("link", { name: /Live demo/i }),
    ).toHaveAttribute("href", "https://example.com/orbital-telemetry");
  });

  it("renders skill groups with proficiency readouts", async () => {
    renderWithProviders(<App />);

    const skills = screen.getByTestId("skills.section");
    expect(await within(skills).findByText("Languages")).toBeInTheDocument();
    expect(within(skills).getByText("Frontend")).toBeInTheDocument();
    expect(within(skills).getByText("Motoko")).toBeInTheDocument();
    expect(within(skills).getByText("92%")).toBeInTheDocument();
  });

  it("submits the contact form through the actor and shows the success state", async () => {
    const user = userEvent.setup();
    const submitContactMessage = vi.fn(async () => ({
      __kind__: "ok" as const,
      ok: 7n,
    }));
    useActorMock.mockReturnValue({
      actor: createMockActor({ submitContactMessage }),
      isFetching: false,
    });

    renderWithProviders(<App />);

    const form = screen.getByTestId("contact.form");
    await user.type(within(form).getByLabelText("Name"), "Ada Lovelace");
    await user.type(within(form).getByLabelText("Email"), "ada@example.com");
    await user.type(
      within(form).getByLabelText("Message"),
      "I would like to work with you on a project.",
    );
    await user.click(screen.getByRole("button", { name: /Send message/i }));

    await waitFor(() => {
      expect(submitContactMessage).toHaveBeenCalledWith({
        name: "Ada Lovelace",
        email: "ada@example.com",
        message: "I would like to work with you on a project.",
      });
    });
    expect(
      await screen.findByTestId("contact.success_state"),
    ).toBeInTheDocument();
  });

  it("shows validation errors and does not call the actor for an invalid form", async () => {
    const user = userEvent.setup();
    const submitContactMessage = vi.fn(async () => ({
      __kind__: "ok" as const,
      ok: 1n,
    }));
    useActorMock.mockReturnValue({
      actor: createMockActor({ submitContactMessage }),
      isFetching: false,
    });

    renderWithProviders(<App />);

    const form = screen.getByTestId("contact.form");
    await user.type(within(form).getByLabelText("Email"), "not-an-email");
    await user.click(screen.getByRole("button", { name: /Send message/i }));

    expect(await screen.findByTestId("contact.name_error")).toBeInTheDocument();
    expect(screen.getByTestId("contact.email_error")).toHaveTextContent(
      /valid email address/i,
    );
    expect(screen.getByTestId("contact.message_error")).toBeInTheDocument();
    expect(submitContactMessage).not.toHaveBeenCalled();
  });

  it("shows the error state when the backend rejects the submission", async () => {
    const user = userEvent.setup();
    const submitContactMessage = vi.fn(async () => ({
      __kind__: "err" as const,
      err: { __kind__: "invalidInput" as const, invalidInput: "nope" },
    }));
    useActorMock.mockReturnValue({
      actor: createMockActor({ submitContactMessage }),
      isFetching: false,
    });

    renderWithProviders(<App />);

    const form = screen.getByTestId("contact.form");
    await user.type(within(form).getByLabelText("Name"), "Ada");
    await user.type(within(form).getByLabelText("Email"), "ada@example.com");
    await user.type(
      within(form).getByLabelText("Message"),
      "A sufficiently long message body.",
    );
    await user.click(screen.getByRole("button", { name: /Send message/i }));

    expect(
      await screen.findByTestId("contact.error_state"),
    ).toBeInTheDocument();
  });

  it("shows the projects empty state when the backend returns no projects", async () => {
    useActorMock.mockReturnValue({
      actor: createMockActor({ listProjects: vi.fn(async () => []) }),
      isFetching: false,
    });

    renderWithProviders(<App />);

    expect(
      await screen.findByTestId("projects.empty_state"),
    ).toBeInTheDocument();
  });
});
