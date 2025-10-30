// src/features/projectHub/sections/database/Database.tsx
import { createSectionView } from "../utils/createSectionView";
import { DatabaseReadView } from "./DatabaseReadView";
import { DatabaseEditView } from "./DatabaseEditView";
import { DEFAULT_DATABASE } from "../../constants/databaseDefault";

export default createSectionView({
  sectionType: "database",
  title: "Database",
  description:
    "Define primary, AI, and supporting databases, along with governance, recovery, and pipelines.",
  ReadView: DatabaseReadView,
  EditView: DatabaseEditView,
  defaultValue: DEFAULT_DATABASE,
});
