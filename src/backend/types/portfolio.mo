import Common "common";

module {
  public type Id = Common.Id;
  public type Timestamp = Common.Timestamp;

  /// A portfolio project shown as a card and opened in a detail view.
  public type Project = {
    id : Id;
    title : Text;
    summary : Text;
    description : Text;
    techTags : [Text];
    /// External links (live site, repository, case study).
    links : [ProjectLink];
    /// Object-storage reference for the project image, when one exists.
    imageRef : ?Text;
    /// Ascending display order; lower values render first.
    order : Nat;
  };

  public type ProjectLink = {
    labelText : Text;
    url : Text;
  };

  /// A named group of related skills (e.g. "Languages", "Tooling").
  public type SkillGroup = {
    id : Id;
    category : Text;
    /// Ascending display order; lower values render first.
    order : Nat;
    skills : [Skill];
  };

  public type Skill = {
    name : Text;
    /// Proficiency from 0 to 100, rendered as an animated indicator.
    proficiency : Nat;
    /// Ascending display order within the group; lower values render first.
    order : Nat;
  };

  /// A message submitted through the public contact form.
  public type ContactMessage = {
    id : Id;
    name : Text;
    email : Text;
    message : Text;
    submittedAt : Timestamp;
    read : Bool;
  };

  /// Caller-supplied contact form payload.
  public type ContactInput = {
    name : Text;
    email : Text;
    message : Text;
  };

  /// Caller-supplied project payload for admin create/update.
  public type ProjectInput = {
    title : Text;
    summary : Text;
    description : Text;
    techTags : [Text];
    links : [ProjectLink];
    imageRef : ?Text;
    order : Nat;
  };

  /// Caller-supplied skill group payload for admin create/update.
  public type SkillGroupInput = {
    category : Text;
    order : Nat;
    skills : [Skill];
  };

  /// Caller-visible failure for a rejected write.
  public type WriteError = {
    #notAuthorized;
    #notFound : Id;
    #invalidInput : Text;
  };
};
