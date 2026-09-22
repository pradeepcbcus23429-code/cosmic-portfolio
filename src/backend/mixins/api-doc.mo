mixin () {
  /// Static Markdown documentation of this backend's public API.
  public query func getApiDoc() : async Text {
    "# Portfolio Backend API\n\n" #
    "A space-themed professional portfolio backend. It stores portfolio projects, " #
    "grouped skills, and contact-form messages, and exposes them to the frontend " #
    "and to the Caffeine Data Intelligence agent through the Object Query Layer (OQL).\n\n" #
    "## Public methods\n\n" #
    "### Reads (query, no authentication required)\n\n" #
    "- `listProjects() : [Project]` — every project, sorted by ascending `order`.\n" #
    "- `getProject(id : Nat) : ?Project` — one project by id, or `null` when absent.\n" #
    "- `listSkillGroups() : [SkillGroup]` — every skill group sorted by ascending " #
    "`order`; each group's `skills` array is sorted by ascending `order`.\n\n" #
    "### Public write\n\n" #
    "- `submitContactMessage(input : ContactInput) : { #ok : Nat; #err : WriteError }` " #
    "— stores a contact message and returns its id. No sign-in is required; this is " #
    "the only unauthenticated write.\n\n" #
    "### Admin-only methods\n\n" #
    "All of the following require the caller to hold the `#admin` role. A caller " #
    "without it receives `#err(#notAuthorized)`; `listContactMessages` returns an " #
    "empty array instead.\n\n" #
    "- `createProject(input : ProjectInput) : { #ok : Nat; #err : WriteError }`\n" #
    "- `updateProject(id : Nat, input : ProjectInput) : { #ok; #err : WriteError }`\n" #
    "- `deleteProject(id : Nat) : { #ok; #err : WriteError }`\n" #
    "- `createSkillGroup(input : SkillGroupInput) : { #ok : Nat; #err : WriteError }`\n" #
    "- `updateSkillGroup(id : Nat, input : SkillGroupInput) : { #ok; #err : WriteError }`\n" #
    "- `deleteSkillGroup(id : Nat) : { #ok; #err : WriteError }`\n" #
    "- `listContactMessages() : [ContactMessage]` — newest first, by `submittedAt`.\n" #
    "- `markMessageRead(id : Nat) : { #ok; #err : WriteError }`\n\n" #
    "### Authorization helpers (provided by the authorization mixin)\n\n" #
    "- `_initialize_access_control()` — registers the caller. The first " #
    "non-anonymous caller becomes `#admin`; every later caller becomes `#user`.\n" #
    "- `getCallerUserRole() : UserRole` — the caller's role (`#admin`, `#user`, or " #
    "`#guest` for anonymous callers).\n" #
    "- `isCallerAdmin() : Bool`\n" #
    "- `assignCallerUserRole(user : Principal, role : UserRole)` — admin only.\n\n" #
    "### Documentation\n\n" #
    "- `getApiDoc() : Text` — this document.\n\n" #
    "## Authentication and authorization\n\n" #
    "Reads (`listProjects`, `getProject`, `listSkillGroups`) and " #
    "`submitContactMessage` are open to anonymous callers. Every admin-only method " #
    "requires a signed (non-anonymous) caller whose principal holds the `#admin` role.\n\n" #
    "The app's frontend pins an Internet Identity derivation origin, published at " #
    "`/.well-known/ii-derivation-origin` when available. An agent that already holds " #
    "the user's Internet Identity authorization derives the correct per-app principal " #
    "against that origin (for example `icp identity link web <name> --app <host>`). " #
    "Such a delegation acts with the user's full authority in this app until it expires.\n\n" #
    "### Registration prerequisite\n\n" #
    "Registration happens only when a caller signs in through the app's own frontend. " #
    "A direct API caller must therefore call `_initialize_access_control()` once as a " #
    "signed-in caller before any role-guarded call, including the guarded query " #
    "`listContactMessages`. The first caller to initialize receives `#admin`; every " #
    "subsequent caller receives `#user`. An unregistered caller is not anonymous, so " #
    "role checks reach `getUserRole`, which traps with `User is not registered`; an " #
    "anonymous caller receives `#guest` and is rejected by the admin checks with " #
    "`#err(#notAuthorized)` (or an empty array from `listContactMessages`). A principal " #
    "that never signed in through this app is unregistered even when it belongs to the " #
    "app's owner, and a signed-in caller derived against a different origin is a " #
    "different principal than the one the frontend registered.\n\n" #
    "## Units and encodings\n\n" #
    "- `id` values are `Nat` and are assigned monotonically from per-entity counters. " #
    "Ids are never reused after a delete.\n" #
    "- `submittedAt` is a `Nat` timestamp in nanoseconds since the Unix epoch " #
    "(`Time.now()`).\n" #
    "- `proficiency` is a `Nat` from 0 to 100, rendered as an animated indicator.\n" #
    "- `order` is a `Nat`; lower values render first. Ties keep their map iteration " #
    "order.\n" #
    "- `imageRef` is an optional `Text` reference to an object-storage asset; `null` " #
    "means the project has no image.\n" #
    "- `techTags` is an array of `Text`; `links` is an array of " #
    "`{ labelText : Text; url : Text }`.\n" #
    "- `WriteError` is a variant: `#notAuthorized`, `#notFound(id)`, or " #
    "`#invalidInput(message)`.\n\n" #
    "## Lifecycle and polling\n\n" #
    "The backend is seeded exactly once, at install time, by the migration chain: " #
    "four sample projects and four skill groups. Seeding never runs again on upgrade, " #
    "so admin edits and deletions are preserved. `listProjects` and `listSkillGroups` " #
    "are `query` calls and can be polled freely; they read committed state and never " #
    "mutate it.\n\n" #
    "## Mutation retry safety\n\n" #
    "- `submitContactMessage` is **not** idempotent: each accepted call creates a new " #
    "message with a new id. Retrying after a timeout may duplicate a message.\n" #
    "- `createProject` and `createSkillGroup` are likewise not idempotent; a retry " #
    "creates a second record.\n" #
    "- `updateProject`, `updateSkillGroup`, and `markMessageRead` are idempotent: " #
    "applying the same call twice leaves the same state.\n" #
    "- `deleteProject` and `deleteSkillGroup` are destructive and idempotent in " #
    "effect: the first call returns `#ok`, a repeat returns `#err(#notFound(id))`.\n\n" #
    "## Errors, traps, and gotchas\n\n" #
    "- Validation failures return `#err(#invalidInput(message))` rather than trapping, " #
    "so the frontend can display the reason. Contact validation requires non-empty " #
    "name, email, and message, a plausible email shape (one `@`, a dotted domain, no " #
    "whitespace), and bounds message length to 4000 characters and name/email to 200.\n" #
    "- Skill `proficiency` above 100 is rejected with `#invalidInput`.\n" #
    "- `listContactMessages` is a guarded query: an unauthorized caller gets an empty " #
    "array, not an error, so an empty result is ambiguous between \"no messages\" and " #
    "\"not authorized\".\n" #
    "- Calling an admin method while unregistered traps with `User is not registered` " #
    "rather than returning `#notAuthorized`; register first.\n" #
    "- OQL exposes three entities: `project` and `skillGroup` are publicly readable, " #
    "while `contactMessage` is controller-only.\n";
  };
};
