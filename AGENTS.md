# Project Guidance

## User Preferences

- Space theme throughout with a cosmic, professional feel
- Modern animation: scroll reveals, hover micro-interactions, ambient motion
- Custom glowing mouse cursor with trailing effect on desktop
- Small ambient elements drifting around the screen
- Efficient and professional presentation — smooth, no jank

## Verified Commands

- **typecheck**: `pnpm typecheck`
- **fix**: `pnpm fix`
- **build**: `pnpm build`

## Learnings

- Motoko string literals do not support backslash line-continuation; write multi-line Markdown as `#`-joined single-line strings.
- Under Enhanced Migration, component state like AccessControl.initState() must be declared type-only in the actor and initialised in the migration's NewActor, never inline in the actor body.
- OQL auto-derivation (.toEntity) only works for all-primitive records; records with array/option/nested fields need .toEntityManual with .payload per column.
- `label` is a reserved keyword in Motoko and cannot be used as a record field name.
- A variant tag binds only to the atom immediately after it: write `#predicate(Char.isWhitespace)`, not `#predicate Char.isWhitespace`.
- When a hook drives DOM transforms via refs, the hook must own the refs and return them so the component attaches exactly those nodes; separate refs in each file silently write to null.
- Biome rejects index-based array keys — give each config entry a stable string id field.
- Biome's lint/a11y/useValidAnchor rejects an <a> with an onClick handler; for in-page section links rely on global html { scroll-behavior: smooth }.
- index.html og:title must stay byte-identical to <title> and og:description to the description meta tag; update all four together.
- Backend SkillGroup.id is bigint; use id.toString() for React keys since bigint is not a valid key type.
