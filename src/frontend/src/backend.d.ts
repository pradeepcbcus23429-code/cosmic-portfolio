import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Cell {
    value: Value;
    name: string;
}
export interface ContactInput {
    name: string;
    email: string;
    message: string;
}
export interface ContactMessage {
    id: Id;
    name: string;
    read: boolean;
    submittedAt: Timestamp;
    email: string;
    message: string;
}
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export type Id = bigint;
export interface Project {
    id: Id;
    techTags: Array<string>;
    title: string;
    order: bigint;
    description: string;
    links: Array<ProjectLink>;
    summary: string;
    imageRef?: string;
}
export interface ProjectInput {
    techTags: Array<string>;
    title: string;
    order: bigint;
    description: string;
    links: Array<ProjectLink>;
    summary: string;
    imageRef?: string;
}
export interface ProjectLink {
    url: string;
    labelText: string;
}
export interface Result {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export type Result__1 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export interface Skill {
    order: bigint;
    name: string;
    proficiency: bigint;
}
export interface SkillGroup {
    id: Id;
    order: bigint;
    category: string;
    skills: Array<Skill>;
}
export interface SkillGroupInput {
    order: bigint;
    category: string;
    skills: Array<Skill>;
}
export type Timestamp = bigint;
export type Value = {
    __kind__: "int";
    int: bigint;
} | {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "float";
    float: number;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "null";
    null: null;
} | {
    __kind__: "text";
    text: string;
};
export type WriteError = {
    __kind__: "notAuthorized";
    notAuthorized: null;
} | {
    __kind__: "invalidInput";
    invalidInput: string;
} | {
    __kind__: "notFound";
    notFound: Id;
};
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    /**
     * / Creates a project. Admin only.
     */
    createProject(input: ProjectInput): Promise<{
        __kind__: "ok";
        ok: Id;
    } | {
        __kind__: "err";
        err: WriteError;
    }>;
    /**
     * / Creates a skill group. Admin only.
     */
    createSkillGroup(input: SkillGroupInput): Promise<{
        __kind__: "ok";
        ok: Id;
    } | {
        __kind__: "err";
        err: WriteError;
    }>;
    /**
     * / Deletes a project. Admin only.
     */
    deleteProject(id: Id): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: WriteError;
    }>;
    /**
     * / Deletes a skill group. Admin only.
     */
    deleteSkillGroup(id: Id): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: WriteError;
    }>;
    execute(qJson: string): Promise<Result>;
    /**
     * / Static Markdown documentation of this backend's public API.
     */
    getApiDoc(): Promise<string>;
    getCallerUserRole(): Promise<UserRole>;
    /**
     * / A single project by id.
     */
    getProject(id: Id): Promise<Project | null>;
    isCallerAdmin(): Promise<boolean>;
    /**
     * / Lists contact messages, newest first. Admin only.
     */
    listContactMessages(): Promise<Array<ContactMessage>>;
    /**
     * / All projects, ordered for display.
     */
    listProjects(): Promise<Array<Project>>;
    /**
     * / All skill groups with their skills, ordered for display.
     */
    listSkillGroups(): Promise<Array<SkillGroup>>;
    /**
     * / Marks a contact message as read. Admin only.
     */
    markMessageRead(id: Id): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: WriteError;
    }>;
    schema(): Promise<string>;
    /**
     * / Submits a contact message from the public contact form.
     */
    submitContactMessage(input: ContactInput): Promise<{
        __kind__: "ok";
        ok: Id;
    } | {
        __kind__: "err";
        err: WriteError;
    }>;
    /**
     * / Updates a project. Admin only.
     */
    updateProject(id: Id, input: ProjectInput): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: WriteError;
    }>;
    /**
     * / Updates a skill group. Admin only.
     */
    updateSkillGroup(id: Id, input: SkillGroupInput): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: WriteError;
    }>;
}
