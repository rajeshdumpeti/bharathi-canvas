import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useProjectStore } from "stores/projectStore";

export function useSyncProjectParam() {
  const [search, setSearch] = useSearchParams();
  const navigate = useNavigate();
  const { projects, selectedProjectId, selectProject } = useProjectStore();

  useEffect(() => {
    const qid = search.get("project");
    if (qid && qid !== selectedProjectId) {
      selectProject(qid);
      return;
    }

    // No ?project param → redirect to first project
    if (!qid && projects.length > 0) {
      const first = projects[0].id;
      selectProject(first);
      navigate(`/board?project=${first}`, { replace: true });
    }
  }, [projects, search]);
}
