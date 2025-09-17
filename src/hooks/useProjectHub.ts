import { useProjectHubContext } from "../features/projectHub/context";
import type { ProjectHubContextValue } from "../types/project-hub";

export default function useProjectHub(): ProjectHubContextValue {
  const ctx = useProjectHubContext();
  if (!ctx)
    throw new Error("useProjectHub must be used within ProjectHubProvider");
  return ctx;
}
