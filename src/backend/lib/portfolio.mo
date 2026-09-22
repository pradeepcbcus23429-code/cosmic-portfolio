import Char "mo:core/Char";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Types "../types/portfolio";

module {
  /// All projects, keyed by id.
  public type ProjectStore = Map.Map<Types.Id, Types.Project>;

  /// All skill groups, keyed by id.
  public type SkillGroupStore = Map.Map<Types.Id, Types.SkillGroup>;

  /// All contact messages, keyed by id.
  public type ContactStore = Map.Map<Types.Id, Types.ContactMessage>;

  /// Mutable counters shared with the mixins.
  public type Counters = {
    var nextProjectId : Nat;
    var nextSkillGroupId : Nat;
    var nextMessageId : Nat;
  };

  /// Maximum accepted contact message length, in characters.
  public let maxMessageLength : Nat = 4000;

  /// Maximum accepted name / email length, in characters.
  public let maxFieldLength : Nat = 200;

  // --- Ordering helpers ---

  func compareByOrder(a : Nat, b : Nat) : { #less; #equal; #greater } {
    if (a < b) { #less } else if (a > b) { #greater } else { #equal };
  };

  func sortSkills(skills : [Types.Skill]) : [Types.Skill] {
    skills.sort(func(a, b) = compareByOrder(a.order, b.order));
  };

  func sortGroups(groups : [Types.SkillGroup]) : [Types.SkillGroup] {
    groups.sort(func(a, b) = compareByOrder(a.order, b.order));
  };

  // --- Reads ---

  /// Projects sorted by ascending `order`.
  public func listProjects(projects : ProjectStore) : [Types.Project] {
    projects.values().toArray().sort(func(a, b) = compareByOrder(a.order, b.order));
  };

  /// A single project by id, or null when absent.
  public func getProject(projects : ProjectStore, id : Types.Id) : ?Types.Project {
    projects.get(id);
  };

  /// Skill groups sorted by ascending `order`, each with skills sorted by `order`.
  public func listSkillGroups(groups : SkillGroupStore) : [Types.SkillGroup] {
    sortGroups(
      groups.values().toArray().map(func(group) = { group with skills = sortSkills(group.skills) })
    );
  };

  /// All contact messages, newest first.
  public func listContactMessages(messages : ContactStore) : [Types.ContactMessage] {
    messages.values().toArray().sort(func(a, b) = compareByOrder(b.submittedAt, a.submittedAt));
  };

  // --- Validation ---

  func validateProject(input : Types.ProjectInput) : ?Text {
    if (input.title.trim(#predicate(Char.isWhitespace)) == "") {
      return ?"Project title is required";
    };
    if (input.summary.trim(#predicate(Char.isWhitespace)) == "") {
      return ?"Project summary is required";
    };
    if (input.title.size() > maxFieldLength) {
      return ?"Project title is too long";
    };
    if (input.summary.size() > maxFieldLength) {
      return ?"Project summary is too long";
    };
    null;
  };

  func validateSkillGroup(input : Types.SkillGroupInput) : ?Text {
    if (input.category.trim(#predicate(Char.isWhitespace)) == "") {
      return ?"Skill group category is required";
    };
    if (input.category.size() > maxFieldLength) {
      return ?"Skill group category is too long";
    };
    for (skill in input.skills.values()) {
      if (skill.name.trim(#predicate(Char.isWhitespace)) == "") {
        return ?"Skill name is required";
      };
      if (skill.proficiency > 100) {
        return ?"Skill proficiency must be between 0 and 100";
      };
    };
    null;
  };

  /// A deliberately permissive email shape check: one `@`, a non-empty local
  /// part, and a dotted domain with no whitespace.
  func isPlausibleEmail(email : Text) : Bool {
    let trimmed = email.trim(#predicate(Char.isWhitespace));
    if (trimmed.size() == 0 or trimmed.size() > maxFieldLength) {
      return false;
    };
    if (trimmed.contains(#char ' ') or trimmed.contains(#char '\t') or trimmed.contains(#char '\n')) {
      return false;
    };
    let parts = trimmed.split(#char '@').toArray();
    if (parts.size() != 2) {
      return false;
    };
    let local = parts[0];
    let domain = parts[1];
    if (local.size() == 0 or domain.size() == 0) {
      return false;
    };
    if (not domain.contains(#char '.')) {
      return false;
    };
    if (domain.startsWith(#char '.') or domain.endsWith(#char '.')) {
      return false;
    };
    true;
  };

  func validateContact(input : Types.ContactInput) : ?Text {
    if (input.name.trim(#predicate(Char.isWhitespace)) == "") {
      return ?"Name is required";
    };
    if (input.email.trim(#predicate(Char.isWhitespace)) == "") {
      return ?"Email is required";
    };
    if (input.message.trim(#predicate(Char.isWhitespace)) == "") {
      return ?"Message is required";
    };
    if (input.name.size() > maxFieldLength) {
      return ?"Name is too long";
    };
    if (input.email.size() > maxFieldLength) {
      return ?"Email is too long";
    };
    if (input.message.size() > maxMessageLength) {
      return ?"Message is too long";
    };
    if (not isPlausibleEmail(input.email)) {
      return ?"Email address is not valid";
    };
    null;
  };

  // --- Writes ---

  /// Validates and stores a new project, returning its id.
  public func createProject(
    projects : ProjectStore,
    counters : Counters,
    input : Types.ProjectInput,
  ) : { #ok : Types.Id; #err : Types.WriteError } {
    switch (validateProject(input)) {
      case (?reason) { #err(#invalidInput(reason)) };
      case null {
        let id = counters.nextProjectId;
        counters.nextProjectId := id + 1;
        projects.add(id, {
          id;
          title = input.title;
          summary = input.summary;
          description = input.description;
          techTags = input.techTags;
          links = input.links;
          imageRef = input.imageRef;
          order = input.order;
        });
        #ok(id);
      };
    };
  };

  /// Replaces an existing project, or reports `#notFound`.
  public func updateProject(
    projects : ProjectStore,
    id : Types.Id,
    input : Types.ProjectInput,
  ) : { #ok; #err : Types.WriteError } {
    switch (projects.get(id)) {
      case null { #err(#notFound(id)) };
      case (?_) {
        switch (validateProject(input)) {
          case (?reason) { #err(#invalidInput(reason)) };
          case null {
            projects.add(id, {
              id;
              title = input.title;
              summary = input.summary;
              description = input.description;
              techTags = input.techTags;
              links = input.links;
              imageRef = input.imageRef;
              order = input.order;
            });
            #ok;
          };
        };
      };
    };
  };

  /// Removes a project, or reports `#notFound`.
  public func deleteProject(projects : ProjectStore, id : Types.Id) : { #ok; #err : Types.WriteError } {
    switch (projects.get(id)) {
      case null { #err(#notFound(id)) };
      case (?_) {
        projects.remove(id);
        #ok;
      };
    };
  };

  /// Validates and stores a new skill group, returning its id.
  public func createSkillGroup(
    groups : SkillGroupStore,
    counters : Counters,
    input : Types.SkillGroupInput,
  ) : { #ok : Types.Id; #err : Types.WriteError } {
    switch (validateSkillGroup(input)) {
      case (?reason) { #err(#invalidInput(reason)) };
      case null {
        let id = counters.nextSkillGroupId;
        counters.nextSkillGroupId := id + 1;
        groups.add(id, {
          id;
          category = input.category;
          order = input.order;
          skills = input.skills;
        });
        #ok(id);
      };
    };
  };

  /// Replaces an existing skill group, or reports `#notFound`.
  public func updateSkillGroup(
    groups : SkillGroupStore,
    id : Types.Id,
    input : Types.SkillGroupInput,
  ) : { #ok; #err : Types.WriteError } {
    switch (groups.get(id)) {
      case null { #err(#notFound(id)) };
      case (?_) {
        switch (validateSkillGroup(input)) {
          case (?reason) { #err(#invalidInput(reason)) };
          case null {
            groups.add(id, {
              id;
              category = input.category;
              order = input.order;
              skills = input.skills;
            });
            #ok;
          };
        };
      };
    };
  };

  /// Removes a skill group, or reports `#notFound`.
  public func deleteSkillGroup(groups : SkillGroupStore, id : Types.Id) : { #ok; #err : Types.WriteError } {
    switch (groups.get(id)) {
      case null { #err(#notFound(id)) };
      case (?_) {
        groups.remove(id);
        #ok;
      };
    };
  };

  /// Validates and stores a contact message, returning its id.
  public func submitContactMessage(
    messages : ContactStore,
    counters : Counters,
    input : Types.ContactInput,
  ) : { #ok : Types.Id; #err : Types.WriteError } {
    switch (validateContact(input)) {
      case (?reason) { #err(#invalidInput(reason)) };
      case null {
        let id = counters.nextMessageId;
        counters.nextMessageId := id + 1;
        messages.add(id, {
          id;
          name = input.name;
          email = input.email;
          message = input.message;
          submittedAt = Time.now().toNat();
          read = false;
        });
        #ok(id);
      };
    };
  };

  /// Marks a contact message as read, or reports `#notFound`.
  public func markMessageRead(messages : ContactStore, id : Types.Id) : { #ok; #err : Types.WriteError } {
    switch (messages.get(id)) {
      case null { #err(#notFound(id)) };
      case (?message) {
        messages.add(id, { message with read = true });
        #ok;
      };
    };
  };
};
