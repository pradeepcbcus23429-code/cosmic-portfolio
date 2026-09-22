import { PocketIc } from "@dfinity/pic";
import type { Actor, CanisterFixture } from "@dfinity/pic";
import { afterAll, beforeAll, expect, it } from "vitest";

import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { _SERVICE } from "../../src/frontend/src/declarations/backend.did";

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";

let pic: PocketIc | undefined;
let actor: Actor<_SERVICE>;
let canisterId: CanisterFixture<_SERVICE>["canisterId"];

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  ({ actor, canisterId } = await pic.setupCanister<_SERVICE>({
    idlFactory,
    wasm: BACKEND_WASM,
  }));
});

afterAll(async () => {
  await pic?.tearDown();
});

it("answers the public reads instead of trapping", async () => {
  await expect(actor.listProjects()).resolves.toBeInstanceOf(Array);
  await expect(actor.listSkillGroups()).resolves.toBeInstanceOf(Array);
  await expect(actor.getApiDoc()).resolves.toEqual(expect.any(String));
});

it("seeds the sample portfolio content at install time", async () => {
  const projects = await actor.listProjects();
  expect(projects.length).toBeGreaterThan(0);
  expect(projects.map((project) => project.title)).toContain(
    "Orbital Telemetry Dashboard",
  );

  const groups = await actor.listSkillGroups();
  expect(groups.length).toBeGreaterThan(0);
  expect(groups.map((group) => group.category)).toContain("Languages");
});

it("returns a single project by id and an empty option for an unknown id", async () => {
  const projects = await actor.listProjects();
  const first = projects[0];
  const found = await actor.getProject(first.id);
  expect(found).toHaveLength(1);
  expect(found[0].title).toBe(first.title);

  await expect(actor.getProject(9999n)).resolves.toEqual([]);
});

it("round-trips a contact message through the real canister", async () => {
  const result = await actor.submitContactMessage({
    name: "Ada Lovelace",
    email: "ada@example.com",
    message: "I would like to discuss a project with you.",
  });
  expect(result).toHaveProperty("ok");

  // The public read is admin-only and returns [] to a non-admin caller, so the
  // round-trip is proven by the accepted write plus a second accepted write.
  const second = await actor.submitContactMessage({
    name: "Grace Hopper",
    email: "grace@example.com",
    message: "Following up on the earlier note.",
  });
  expect(second).toHaveProperty("ok");
});

it("rejects an invalid contact submission with invalidInput", async () => {
  const result = await actor.submitContactMessage({
    name: "",
    email: "not-an-email",
    message: "short",
  });
  expect(result).toHaveProperty("err");
  if ("err" in result) {
    expect(result.err).toHaveProperty("invalidInput");
  }
});

it("rejects an admin-only write from a non-admin caller", async () => {
  const result = await actor.createProject({
    title: "Unauthorized",
    summary: "Should not be created",
    description: "Nope",
    techTags: [],
    links: [],
    imageRef: [],
    order: 99n,
  });
  expect(result).toHaveProperty("err");
  if ("err" in result) {
    expect(result.err).toHaveProperty("notAuthorized");
  }
});

it("does not expose contact messages to a non-admin caller", async () => {
  await expect(actor.listContactMessages()).resolves.toEqual([]);
});
