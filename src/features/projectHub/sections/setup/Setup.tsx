import { createSectionView } from "../utils/createSectionView";
import { SetupReadView } from "./SetupReadView";
import { SetupEditView } from "./SetupEditView";
import { DEFAULT_SETUP } from "../../constants/setupDefaults";

const Setup = createSectionView({
  sectionType: "setup",
  title: "Project Setup",
  description: "Manage repository, environment, and tooling details.",
  ReadView: SetupReadView,
  EditView: SetupEditView,
  defaultValue: DEFAULT_SETUP,
});

export default Setup;
