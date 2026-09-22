import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Expose "mo:caffeineai-oql/Expose";
import Entity "mo:caffeineai-oql/Entity";
import MapEntity "mo:caffeineai-oql/MapEntity";
import RecordValue "mo:caffeineai-oql/RecordValue";
import NatValue "mo:caffeineai-oql/NatValue";
import TextValue "mo:caffeineai-oql/TextValue";
import BoolValue "mo:caffeineai-oql/BoolValue";
import Text "mo:core/Text";
import Types "types/portfolio";
import PortfolioLib "lib/portfolio";
import PortfolioApi "mixins/portfolio-api";
import ApiDocMixin "mixins/api-doc";

actor {
  let accessControlState : AccessControl.AccessControlState;

  let projects : PortfolioLib.ProjectStore;
  let skillGroups : PortfolioLib.SkillGroupStore;
  let contactMessages : PortfolioLib.ContactStore;
  let counters : PortfolioLib.Counters;

  // Serialise a project's link list into a single queryable text column.
  func linksToText(links : [Types.ProjectLink]) : Text {
    links.values().map(func(link) = link.labelText # " " # link.url).join(" | ");
  };

  // Serialise a skill group's skills into a single queryable text column.
  func skillsToText(skills : [Types.Skill]) : Text {
    skills.values().map(func(skill) = skill.name).join(", ");
  };

  include MixinAuthorization(accessControlState, null);
  include PortfolioApi(accessControlState, projects, skillGroups, contactMessages, counters);
  include ApiDocMixin();
  include Expose({
    entities = [
      projects.toEntityManual("project", "Project", "id")
        .sample({
          id = 0;
          title = "";
          summary = "";
          description = "";
          techTags = [];
          links = [];
          imageRef = null;
          order = 0;
        })
        .payload("title", func(p) = p.title)
        .payload("summary", func(p) = p.summary)
        .payload("description", func(p) = p.description)
        .payload("techTags", func(p) = p.techTags.values().join(", "))
        .payload("links", func(p) = linksToText(p.links))
        .payload("imageRef", func(p) = p.imageRef ?? "")
        .payload("order", func(p) = p.order)
        .public_()
        .build(),
      skillGroups.toEntityManual("skillGroup", "SkillGroup", "id")
        .sample({ id = 0; category = ""; order = 0; skills = [] })
        .payload("category", func(g) = g.category)
        .payload("order", func(g) = g.order)
        .payload("skills", func(g) = skillsToText(g.skills))
        .public_()
        .build(),
      contactMessages.toEntity("contactMessage", "ContactMessage", "id")
        .sample({ id = 0; name = ""; email = ""; message = ""; submittedAt = 0; read = false })
        .controllerOnly()
        .build(),
    ];
  });
};
