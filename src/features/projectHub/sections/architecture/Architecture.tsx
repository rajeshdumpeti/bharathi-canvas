import { createSectionView } from "../utils/createSectionView";
import { ArchitectureReadView } from "./ArchitectureReadView";
import { ArchitectureEditView } from "./ArchitectureEditView";
import architectureDefault from "../../constants/architectureDefault";

const Architecture = createSectionView({
  sectionType: "architecture",
  title: "System Architecture",
  description: "Document services, APIs, data stores, and observability.",
  ReadView: ArchitectureReadView,
  EditView: ArchitectureEditView,
  defaultValue: architectureDefault,
});

export default Architecture;
