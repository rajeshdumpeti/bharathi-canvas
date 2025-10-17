import { createSectionView } from "../utils/createSectionView";
import { DeploymentGuideReadView } from "./DeploymentGuideReadView";
import { DeploymentGuideEditView } from "./DeploymentGuideEditView";
import deploymentGuideDefault from "../../constants/defaultDeploymentGuide";

const DeploymentGuide = createSectionView({
  sectionType: "deploymentGuide",
  title: "Deployment Guide",
  description:
    "Define CI/CD pipelines, environments, rollback strategies, and monitoring setup.",
  ReadView: DeploymentGuideReadView,
  EditView: DeploymentGuideEditView,
  defaultValue: deploymentGuideDefault,
});

export default DeploymentGuide;
