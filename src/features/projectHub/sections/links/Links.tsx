import { createSectionView } from "../utils/createSectionView";
import { LinksReadView } from "./LinksReadView";
import { LinksEditView } from "./LinksEditView";
import linksDefault from "../../constants/linksDefault";

const Links = createSectionView({
  sectionType: "links",
  title: "Project Links",
  description:
    "Centralized repository for all project URLs — code repos, documentation, dashboards, cloud resources, and knowledge base.",
  ReadView: LinksReadView,
  EditView: LinksEditView,
  defaultValue: linksDefault,
});

export default Links;
