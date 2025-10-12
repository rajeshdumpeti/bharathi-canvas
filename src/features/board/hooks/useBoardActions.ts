// src/features/board/hooks/useBoardActions.ts
import { useProjects } from "./useProjects";
import { useTasks } from "./useTasks";

export const useBoardActions = () => {
  const project = useProjects();
  const task = useTasks();

  // ✅ Explicitly merge both contexts with spread — not inferred as intersection type
  return {
    ...project,
    ...task,
  };
};
