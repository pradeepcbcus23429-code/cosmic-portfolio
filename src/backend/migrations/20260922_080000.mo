import AccessControl "mo:caffeineai-authorization/access-control";
import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type Id = Nat;
  type Timestamp = Nat;

  type ProjectLink = { labelText : Text; url : Text };
  type Project = {
    id : Id;
    title : Text;
    summary : Text;
    description : Text;
    techTags : [Text];
    links : [ProjectLink];
    imageRef : ?Text;
    order : Nat;
  };

  type Skill = { name : Text; proficiency : Nat; order : Nat };
  type SkillGroup = { id : Id; category : Text; order : Nat; skills : [Skill] };

  type ContactMessage = {
    id : Id;
    name : Text;
    email : Text;
    message : Text;
    submittedAt : Timestamp;
    read : Bool;
  };

  type Counters = {
    var nextProjectId : Nat;
    var nextSkillGroupId : Nat;
    var nextMessageId : Nat;
  };

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    projects : Map.Map<Id, Project>;
    skillGroups : Map.Map<Id, SkillGroup>;
    contactMessages : Map.Map<Id, ContactMessage>;
    counters : Counters;
  };

  public func migration(_old : {}) : NewActor {
    let projects = Map.empty<Id, Project>();
    let skillGroups = Map.empty<Id, SkillGroup>();
    let contactMessages = Map.empty<Id, ContactMessage>();

    // Seed realistic sample portfolio content exactly once, at install time.
    let sampleProjects : [Project] = [
      {
        id = 0;
        title = "Orbital Telemetry Dashboard";
        summary = "Real-time telemetry visualisation for a fleet of small satellites.";
        description = "A mission-control dashboard that ingests telemetry from a constellation of CubeSats and renders live orbital tracks, power budgets, and thermal trends. Built around a streaming pipeline with sub-second latency and a WebGL globe that stays smooth at sixty frames per second.";
        techTags = ["Motoko", "React", "WebGL", "Internet Computer"];
        links = [
          { labelText = "Live demo"; url = "https://example.com/orbital-telemetry" },
          { labelText = "Source"; url = "https://github.com/example/orbital-telemetry" },
        ];
        imageRef = null;
        order = 0;
      },
      {
        id = 1;
        title = "Nebula Design System";
        summary = "A component library and token pipeline for deep-space interfaces.";
        description = "A design system built for low-light, high-contrast environments. It ships accessible primitives, a colour-token pipeline derived from perceptual colour spaces, and documentation that keeps design and engineering in sync.";
        techTags = ["TypeScript", "Tailwind", "Accessibility", "Design Tokens"];
        links = [
          { labelText = "Documentation"; url = "https://example.com/nebula" },
        ];
        imageRef = null;
        order = 1;
      },
      {
        id = 2;
        title = "Asteroid Trajectory Solver";
        summary = "Numerical orbit propagation with an interactive uncertainty view.";
        description = "A browser-based solver that propagates near-Earth object trajectories and visualises the resulting uncertainty envelope. Implements adaptive-step integration and renders covariance ellipsoids so non-specialists can reason about close approaches.";
        techTags = ["Rust", "WebAssembly", "Numerical Methods"];
        links = [
          { labelText = "Case study"; url = "https://example.com/asteroid-solver" },
        ];
        imageRef = null;
        order = 2;
      },
      {
        id = 3;
        title = "Deep Field Image Archive";
        summary = "A searchable archive of telescope imagery with on-chain provenance.";
        description = "An archive that stores observation metadata on-chain while keeping the imagery itself in object storage. Every record carries a verifiable provenance trail, and the search layer supports faceted queries across instrument, band, and epoch.";
        techTags = ["Motoko", "Object Storage", "Provenance", "Search"];
        links = [
          { labelText = "Live archive"; url = "https://example.com/deep-field" },
        ];
        imageRef = null;
        order = 3;
      },
    ];

    for (project in sampleProjects.values()) {
      projects.add(project.id, project);
    };

    let sampleGroups : [SkillGroup] = [
      {
        id = 0;
        category = "Languages";
        order = 0;
        skills = [
          { name = "Motoko"; proficiency = 92; order = 0 },
          { name = "TypeScript"; proficiency = 95; order = 1 },
          { name = "Rust"; proficiency = 80; order = 2 },
          { name = "Python"; proficiency = 85; order = 3 },
        ];
      },
      {
        id = 1;
        category = "Frontend";
        order = 1;
        skills = [
          { name = "React"; proficiency = 94; order = 0 },
          { name = "WebGL / Three.js"; proficiency = 82; order = 1 },
          { name = "CSS Architecture"; proficiency = 90; order = 2 },
          { name = "Accessibility"; proficiency = 88; order = 3 },
        ];
      },
      {
        id = 2;
        category = "Backend & Infrastructure";
        order = 2;
        skills = [
          { name = "Internet Computer"; proficiency = 90; order = 0 },
          { name = "Distributed Systems"; proficiency = 84; order = 1 },
          { name = "Data Modelling"; proficiency = 87; order = 2 },
        ];
      },
      {
        id = 3;
        category = "Design & Craft";
        order = 3;
        skills = [
          { name = "Interaction Design"; proficiency = 86; order = 0 },
          { name = "Motion Design"; proficiency = 83; order = 1 },
          { name = "Design Systems"; proficiency = 89; order = 2 },
        ];
      },
    ];

    for (group in sampleGroups.values()) {
      skillGroups.add(group.id, group);
    };

    {
      accessControlState = AccessControl.initState();
      projects;
      skillGroups;
      contactMessages;
      counters = {
        var nextProjectId = sampleProjects.size();
        var nextSkillGroupId = sampleGroups.size();
        var nextMessageId = 0;
      };
    };
  };
};
