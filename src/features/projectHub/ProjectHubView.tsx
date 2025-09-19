import React, { JSX, useEffect, useMemo, useState } from "react";
import HubSidebar from "./components/HubSidebar";
import { ProjectHubProvider } from "./context";
import { EmptyState } from "packages/ui";

// Sections
import Setup from "./sections/Setup";
import Architecture from "./sections/Architecture";
import Database from "./sections/Database";
import UX from "./sections/UX";
import Documents from "./sections/Documents";
import Links from "./sections/Links";
import Issues from "./sections/Issues";
import POCs from "./sections/POCs";
import Screenshots from "./sections/Screenshots";
import Revenue from "./sections/Revenue";
import Value from "./sections/Value";
import Maintenance from "./sections/Maintenance";
import Demand from "./sections/Demand";
import TechRequirements from "./sections/TechRequirements";
import Deployment from "./sections/Deployment";
import Releases from "./sections/Releases";

import useProjectHub from "../../hooks/useProjectHub";
import Modal from "../../components/ui/Modal";

import { storage, HUB_NS } from "packages/storage";
import type {
  SectionDef,
  HubProject,
  SectionKey,
  UseProjectHubShape,
} from "types/project-hub";
/** ---- Types (co-located for now; feel free to move to src/types/hub.ts) ---- */

/** ---- Static section map ---- */

const SECTIONS: SectionDef[] = [
  { key: "setup", title: "Setup", comp: Setup },
  { key: "architecture", title: "Architecture", comp: Architecture },
  { key: "database", title: "Database", comp: Database },
  { key: "links", title: "Links", comp: Links },
  { key: "deployment", title: "Deployment guide", comp: Deployment },
  { key: "issues", title: "Issues faced", comp: Issues },
  { key: "pocs", title: "Proof of concepts", comp: POCs },
  { key: "screenshots", title: "Screenshots", comp: Screenshots },
  { key: "revenue", title: "Revenue", comp: Revenue },
  { key: "value", title: "Immediate value", comp: Value },
  { key: "maintenance", title: "Maintenance", comp: Maintenance },
  { key: "demand", title: "Demand", comp: Demand },
  { key: "tech", title: "Tech Requirements", comp: TechRequirements },
  { key: "releases", title: "Releases", comp: Releases },
  { key: "ux", title: "UX", comp: UX },
  { key: "documents", title: "Documents", comp: Documents },
];

/** ---- Public component ---- */

export default function ProjectHubView() {
  return (
    <ProjectHubProvider>
      <ProjectHubInner />
    </ProjectHubProvider>
  );
}

/** ---- Inner (uses the hub context) ---- */

function ProjectHubInner(): JSX.Element {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<HubProject | null>(
    null
  );

  // initial section from storage; fall back to first valid section
  const initialKey: SectionKey = useMemo(() => {
    const saved = storage.get<SectionKey>(HUB_NS, "activeSection");
    const valid = SECTIONS.some((s) => s.key === saved);
    return (valid ? saved : SECTIONS[0].key) as SectionKey;
  }, []);
  const [activeKey, setActiveKey] = useState<SectionKey>(initialKey);

  const ActiveComp = SECTIONS.find((s) => s.key === activeKey)?.comp ?? Setup;

  // Delete modal state from hub hook (typed minimally for this file)
  const { deleteProject, selected } = useProjectHub() as UseProjectHubShape;

  // persist active section
  useEffect(() => {
    storage.set(HUB_NS, "activeSection", activeKey);
  }, [activeKey]);

  // listen for global sidebar toggle (same pattern used elsewhere)
  useEffect(() => {
    const handler = () => setIsSidebarOpen((s) => !s);
    window.addEventListener("app:toggleSidebar", handler);
    return () => window.removeEventListener("app:toggleSidebar", handler);
  }, []);

  // delete modal helpers
  const openDelete = (proj: HubProject) => {
    setProjectToDelete(proj);
    setIsDeleteOpen(true);
  };
  const closeDelete = () => {
    setProjectToDelete(null);
    setIsDeleteOpen(false);
  };
  const confirmDelete = () => {
    if (projectToDelete) deleteProject(projectToDelete.id);
    closeDelete();
  };

  return (
    <div className="h-full w-full flex flex-col bg-gray-50 font-sans text-gray-800">
      <div className="flex-1 min-h-0 w-full">
        <div className="relative h-full w-full flex overflow-hidden">
          {/* Backdrop (mobile) */}
          <div
            onClick={() => setIsSidebarOpen(false)}
            className={`lg:hidden fixed inset-0 z-20 bg-black/40 transition-opacity duration-300 ${
              isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          />

          {/* Sidebar */}
          <aside
            className={`
              fixed lg:static inset-y-0 left-0 z-30 w-72 bg-gray-900 text-white
              transform transition-transform duration-300 ease-in-out
              border-r border-gray-800 overflow-y-auto shrink-0
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
              lg:translate-x-0 lg:transform-none
            `}
          >
            <div className="h-full p-4">
              <HubSidebar
                sections={SECTIONS}
                activeKey={activeKey}
                onSelect={(key: SectionKey) => {
                  setActiveKey(key);
                  storage.set(HUB_NS, "activeSection", key);
                  setIsSidebarOpen(false);
                }}
                onConfirmDelete={openDelete}
              />
            </div>
          </aside>

          {/* Right pane */}
          <main className="flex-1 min-w-0 h-full overflow-auto">
            {!selected ? (
              <EmptyState
                title="Create your first project"
                description={
                  <>
                    Use the{" "}
                    <span className="font-medium">“New project name”</span>{" "}
                    field in the left sidebar to add a project. Once created,
                    you can document sections like <em>Setup</em>,{" "}
                    <em>Architecture</em>, and more.
                  </>
                }
                bullets={[
                  "Your projects list is shared with your board.",
                  "Select a section on the left to start documenting.",
                  <>
                    Deleting here only clears <em>Project Hub</em> data for that
                    project.
                  </>,
                ]}
              />
            ) : (
              <>
                {/* <SectionHeader
                  title={
                    SECTIONS.find((s) => s.key === activeKey)?.title ||
                    "Section"
                  }
                /> */}
                <div className="mt-4">
                  <ActiveComp />
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      {/* Delete Project Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={closeDelete}
        title="Delete project?"
      >
        <p className="text-gray-700">
          {`Clear Project Hub data for “${
            projectToDelete?.name || "this project"
          }”? This removes only the Hub sections (Setup, Architecture, etc.). Your project, board columns and tasks remain intact.`}
        </p>
        <div className="flex justify-between space-x-3 mt-6">
          <button
            onClick={closeDelete}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
