import { createActor } from "@/backend";
import type { ContactInput, Project, SkillGroup } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery } from "@tanstack/react-query";

/** All projects, ordered for display. */
export function useProjects() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProjects();
    },
    enabled: !!actor && !isFetching,
  });
}

/** All skill groups with their skills, ordered for display. */
export function useSkillGroups() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<SkillGroup[]>({
    queryKey: ["skillGroups"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSkillGroups();
    },
    enabled: !!actor && !isFetching,
  });
}

/** Submits a public contact message. Resolves to the created message id. */
export function useSubmitContactMessage() {
  const { actor } = useActor(createActor);
  return useMutation<bigint, Error, ContactInput>({
    mutationFn: async (input: ContactInput) => {
      if (!actor) throw new Error("Backend is not ready");
      const result = await actor.submitContactMessage(input);
      if (result.__kind__ === "err") {
        throw new Error(result.err.__kind__);
      }
      return result.ok;
    },
  });
}
