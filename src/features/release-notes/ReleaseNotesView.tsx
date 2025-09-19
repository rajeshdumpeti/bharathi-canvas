import React, { useCallback, useEffect, useMemo, useState } from "react";
import FiltersPanel from "./components/FiltersPanel";
import PreviewPanel from "./components/PreviewPanel";
import {
  tasksToMarkdown,
  classifyTask,
  suggestNextVersion,
} from "../../utils/releaseNotes";
import { storage, RN_NS, BOARD_NS } from "../../packages/storage";
import { EmptyState } from "packages/ui";
import type {
  BoardProject,
  BoardTask,
  ReleaseRecord,
  Grouping,
  Id,
} from "types/release-notes";
/* ----------------------------- Types ----------------------------- */

/* -------------------------- Date helpers -------------------------- */

const todayISO = () => new Date().toISOString().slice(0, 10);
const daysAgoISO = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

const safeFile = (s: string) =>
  (s || "release-notes").replace(/[^\w.-]+/g, "_");

/* --------------------------- Component ---------------------------- */

const ReleaseNotesView: React.FC = () => {
  // load once from storage (avoid effect loops)
  const [projects, setProjects] = useState<BoardProject[]>(
    () => storage.get(BOARD_NS, "projects", []) as BoardProject[]
  );
  const [tasks, setTasks] = useState<BoardTask[]>(
    () => storage.get(BOARD_NS, "tasks", []) as BoardTask[]
  );
  const [releases, setReleases] = useState<ReleaseRecord[]>(
    () => storage.get(RN_NS, "releases", []) as ReleaseRecord[]
  );

  const [selectedProjectId, setSelectedProjectId] = useState<Id | "">(
    () => storage.get(RN_NS, "selectedProjectId", "") as Id | ""
  );

  const [fromDate, setFromDate] = useState<string>(daysAgoISO(14));
  const [toDate, setToDate] = useState<string>(todayISO());
  const [grouping, setGrouping] = useState<Grouping>("type");

  const [generatedTasks, setGeneratedTasks] = useState<BoardTask[]>([]);
  const [notesMd, setNotesMd] = useState<string>("");
  const [version, setVersion] = useState<string>("v0.1.0");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  /* -------- when project changes, suggest version & default dates -------- */
  useEffect(() => {
    if (!selectedProjectId) return;

    const history = releases.filter((r) => r.projectId === selectedProjectId);
    if (history.length > 0) {
      const last = history[history.length - 1];
      const hasFeature = (last.tasks || [])
        .map((id) => tasks.find((t) => t.id === id))
        .filter(Boolean)
        .some((t) => classifyTask(t as BoardTask) === "Features");
      setVersion(suggestNextVersion(last.version, hasFeature));
      setFromDate(last.range?.to?.slice(0, 10) || daysAgoISO(14));
    } else {
      setVersion("v0.1.0");
      setFromDate(daysAgoISO(14));
    }
    setToDate(todayISO());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjectId]);

  /* -------- keep local state in sync if other tabs update storage -------- */
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (!e || e.storageArea !== localStorage) return;

      if (e.key === `${BOARD_NS}:projects`) {
        try {
          setProjects(JSON.parse(e.newValue || "[]"));
        } catch {
          setProjects([]);
        }
      }
      if (e.key === `${BOARD_NS}:tasks`) {
        try {
          setTasks(JSON.parse(e.newValue || "[]"));
        } catch {
          setTasks([]);
        }
      }
      if (e.key === `${RN_NS}:releases`) {
        try {
          setReleases(JSON.parse(e.newValue || "[]"));
        } catch {
          setReleases([]);
        }
      }
      if (e.key === `${RN_NS}:selectedProjectId`) {
        setSelectedProjectId((e.newValue as Id) || "");
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /* ----------------------- persist when local edits ---------------------- */
  useEffect(() => {
    storage.set(RN_NS, "releases", releases);
  }, [releases]);

  useEffect(() => {
    if (selectedProjectId)
      storage.set(RN_NS, "selectedProjectId", selectedProjectId);
    else storage.remove(RN_NS, "selectedProjectId");
  }, [selectedProjectId]);

  /* ----------------------------- derivations ---------------------------- */
  const projectTasks = useMemo(() => {
    if (!selectedProjectId) return [] as BoardTask[];
    return tasks.filter((t) => t.project === selectedProjectId);
  }, [tasks, selectedProjectId]);

  const completedInRange = useMemo(() => {
    if (!fromDate || !toDate) return [] as BoardTask[];
    const from = new Date(`${fromDate}T00:00:00`);
    const to = new Date(`${toDate}T23:59:59`);

    return projectTasks.filter((t) => {
      if (t.status !== "done") return false;
      if (!t.completedAt) return false;
      const completed = new Date(t.completedAt);
      return completed >= from && completed <= to;
    });
  }, [projectTasks, fromDate, toDate]);

  /* ----------------------------- UI handlers ---------------------------- */
  useEffect(() => {
    const handler = () => setIsSidebarOpen((s) => !s);
    window.addEventListener("app:toggleSidebar", handler as EventListener);
    return () =>
      window.removeEventListener("app:toggleSidebar", handler as EventListener);
  }, []);

  const onGenerate = useCallback(() => {
    setGeneratedTasks(completedInRange);
    const md = tasksToMarkdown({
      version,
      date: todayISO(),
      tasks: completedInRange,
      groupBy: grouping,
    });
    setNotesMd(md);
  }, [completedInRange, version, grouping]);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(notesMd || "");
    } catch (e) {
      console.warn("Clipboard failed, falling back to download", e);
      const blob = new Blob([notesMd || ""], {
        type: "text/markdown;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${safeFile(version)}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [notesMd, version]);

  const onDownload = useCallback(() => {
    const blob = new Blob([notesMd || ""], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeFile(version)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [notesMd, version]);

  const onSave = useCallback(() => {
    if (!selectedProjectId) return;
    const rec: ReleaseRecord = {
      id: `${Date.now()}`,
      projectId: selectedProjectId,
      version: version || "v0.0.0",
      date: new Date().toISOString(),
      range: { from: fromDate, to: toDate },
      filters: {},
      grouping,
      notesMd: notesMd || "",
      tasks: generatedTasks.map((t) => t.id),
    };
    setReleases((prev) => [...prev, rec]);
  }, [
    selectedProjectId,
    version,
    fromDate,
    toDate,
    grouping,
    notesMd,
    generatedTasks,
  ]);

  const loadRelease = useCallback((r: ReleaseRecord) => {
    setSelectedProjectId(r.projectId);
    setVersion(r.version);
    setFromDate(r.range?.from?.slice(0, 10) || daysAgoISO(14));
    setToDate(r.range?.to?.slice(0, 10) || todayISO());
    setNotesMd(r.notesMd || "");
  }, []);

  /* ------------------------------ Render ------------------------------- */

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      <div className="flex-1 min-h-0 w-full">
        <div className="relative h-full w-full flex overflow-hidden">
          {/* Backdrop (mobile) */}
          <div
            onClick={() => setIsSidebarOpen(false)}
            className={`lg:hidden fixed inset-0 z-20 bg-black/40 transition-opacity duration-300 ${
              isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          />

          {/* Sidebar: Filters */}
          <aside
            className={`
              fixed lg:static inset-y-0 left-0 z-30 w-72 bg-gray-900 text-white
              transform transition-transform duration-300 ease-in-out
              border-r border-gray-800 overflow-y-auto shrink-0
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
              lg:translate-x-0 lg:transform-none
            `}
          >
            <FiltersPanel
              projects={projects}
              selectedProjectId={selectedProjectId}
              onSelectProject={setSelectedProjectId}
              fromDate={fromDate}
              toDate={toDate}
              onChangeFrom={setFromDate}
              onChangeTo={setToDate}
              grouping={grouping}
              onChangeGrouping={setGrouping}
              onGenerate={onGenerate}
              releases={releases.filter(
                (r) => r.projectId === selectedProjectId
              )}
              onLoadRelease={loadRelease}
            />
          </aside>

          {/* Right: Preview / Empty */}
          {!selectedProjectId ? (
            <EmptyState
              title="Create your first release"
              description={
                <>
                  Use the <span className="font-medium">Project</span> picker on
                  the left to choose a project. Then set a date range and click{" "}
                  <span className="font-medium">Generate</span>. We’ll create
                  editable Markdown and show a live preview here.
                </>
              }
              bullets={[
                <>Group items by Feature / Fix / Chore, etc.</>,
                <>
                  Edit Markdown, copy it, or download as <code>.md</code>.
                </>,
                <>Click “Save Release” to store it locally for later.</>,
              ]}
            />
          ) : (
            <main className="flex-1 min-w-0 h-full overflow-auto">
              <PreviewPanel
                version={version}
                setVersion={setVersion}
                notesMd={notesMd}
                setNotesMd={setNotesMd}
                onCopy={onCopy}
                onDownload={onDownload}
                onSave={onSave}
              />
            </main>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReleaseNotesView;
