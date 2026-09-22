import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/portfolio";
import PortfolioLib "../lib/portfolio";

mixin (
  accessControlState : AccessControl.AccessControlState,
  projects : PortfolioLib.ProjectStore,
  groups : PortfolioLib.SkillGroupStore,
  messages : PortfolioLib.ContactStore,
  counters : PortfolioLib.Counters,
) {
  // --- Public reads ---

  /// All projects, ordered for display.
  public query func listProjects() : async [Types.Project] {
    PortfolioLib.listProjects(projects);
  };

  /// A single project by id.
  public query func getProject(id : Types.Id) : async ?Types.Project {
    PortfolioLib.getProject(projects, id);
  };

  /// All skill groups with their skills, ordered for display.
  public query func listSkillGroups() : async [Types.SkillGroup] {
    PortfolioLib.listSkillGroups(groups);
  };

  // --- Public write ---

  /// Submits a contact message from the public contact form.
  public shared func submitContactMessage(input : Types.ContactInput) : async { #ok : Types.Id; #err : Types.WriteError } {
    PortfolioLib.submitContactMessage(messages, counters, input);
  };

  // --- Admin-only writes ---

  /// Creates a project. Admin only.
  public shared ({ caller }) func createProject(input : Types.ProjectInput) : async { #ok : Types.Id; #err : Types.WriteError } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err(#notAuthorized);
    };
    PortfolioLib.createProject(projects, counters, input);
  };

  /// Updates a project. Admin only.
  public shared ({ caller }) func updateProject(id : Types.Id, input : Types.ProjectInput) : async { #ok; #err : Types.WriteError } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err(#notAuthorized);
    };
    PortfolioLib.updateProject(projects, id, input);
  };

  /// Deletes a project. Admin only.
  public shared ({ caller }) func deleteProject(id : Types.Id) : async { #ok; #err : Types.WriteError } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err(#notAuthorized);
    };
    PortfolioLib.deleteProject(projects, id);
  };

  /// Creates a skill group. Admin only.
  public shared ({ caller }) func createSkillGroup(input : Types.SkillGroupInput) : async { #ok : Types.Id; #err : Types.WriteError } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err(#notAuthorized);
    };
    PortfolioLib.createSkillGroup(groups, counters, input);
  };

  /// Updates a skill group. Admin only.
  public shared ({ caller }) func updateSkillGroup(id : Types.Id, input : Types.SkillGroupInput) : async { #ok; #err : Types.WriteError } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err(#notAuthorized);
    };
    PortfolioLib.updateSkillGroup(groups, id, input);
  };

  /// Deletes a skill group. Admin only.
  public shared ({ caller }) func deleteSkillGroup(id : Types.Id) : async { #ok; #err : Types.WriteError } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err(#notAuthorized);
    };
    PortfolioLib.deleteSkillGroup(groups, id);
  };

  /// Lists contact messages, newest first. Admin only.
  public query ({ caller }) func listContactMessages() : async [Types.ContactMessage] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return [];
    };
    PortfolioLib.listContactMessages(messages);
  };

  /// Marks a contact message as read. Admin only.
  public shared ({ caller }) func markMessageRead(id : Types.Id) : async { #ok; #err : Types.WriteError } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err(#notAuthorized);
    };
    PortfolioLib.markMessageRead(messages, id);
  };
};
