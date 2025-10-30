import React, { useEffect, useMemo, useState } from "react";
import HubSidebar from "./components/HubSidebar";
import { ProjectHubProvider, useProjectHubContext } from "./context";
import { EmptyState, Spinner } from "components/ui/index";
import { useProjectStore } from "stores/projectStore";
import Modal from "../../components/ui/Modal";
import type { SectionKey, SectionDef } from "types/project-hub";

// --- Sections (auto-generated structure) ---
import Setup from "./sections/setup/Setup";
import Architecture from "./sections/architecture/Architecture";
import Database from "./sections/database/Database";
import Links from "./sections/links/Links";
import DeploymentGuide from "./sections/deploymentGuide/DeploymentGuide";
// import Issues from "./sections/issues";
// import ProofOfConcepts from "./sections/proofOfConcepts";
// import UX from "./sections/ux";
// import Documents from "./sections/documents";

// // Optional future sections (ready to plug-in)
// import Screenshots from "./sections/screenshots";
// import Revenue from "./sections/revenue";
// import Value from "./sections/value";
// import Maintenance from "./sections/maintenance";
// import Demand from "./sections/demand";
// import TechRequirements from "./sections/techRequirements";
// import Releases from "./sections/releases";

// Centralized definition of all sections
const SECTIONS: SectionDef[] = [
  { key: "setup", title: "Setup", comp: Setup },
  { key: "architecture", title: "Architecture", comp: Architecture },
  { key: "database", title: "Database", comp: Database },
  { key: "links", title: "Links", comp: Links },
  { key: "deploymentGuide", title: "Deployment", comp: DeploymentGuide },
  // { key: "issues", title: "Issues", comp: Issues },
  // { key: "pocs", title: "Proof of Concepts", comp: ProofOfConcepts },
  // { key: "ux", title: "UX", comp: UX },
  // { key: "documents", title: "Documents", comp: Documents },
  // { key: "screenshots", title: "Screenshots", comp: Screenshots },
  // { key: "revenue", title: "Revenue", comp: Revenue },
  // { key: "value", title: "Immediate Value", comp: Value },
  // { key: "maintenance", title: "Maintenance", comp: Maintenance },
  // { key: "demand", title: "Demand", comp: Demand },
  // { key: "tech", title: "Tech Requirements", comp: TechRequirements },
  // { key: "releases", title: "Releases", comp: Releases },
];

// -------------------------------
//  Main Wrapper
// -------------------------------
export default function ProjectHubView() {
  return (
    <ProjectHubProvider>
      <ProjectHubInner />
    </ProjectHubProvider>
  );
}

// -------------------------------
//  Inner Hub Component
// -------------------------------
function ProjectHubInner() {
  const [activeKey, setActiveKey] = useState<SectionKey>("setup");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { projects, selectedProjectId, selectProject } = useProjectStore();
  const { isLoading } = useProjectHubContext();

  // Dynamically resolve active section component
  const ActiveComp = useMemo(
    () => SECTIONS.find((s) => s.key === activeKey)?.comp ?? Setup,
    [activeKey]
  );

  // Auto-select first project if none selected
  useEffect(() => {
    if (!selectedProjectId && projects.length > 0) {
      selectProject(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="h-full w-full flex bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-72 bg-gray-900 text-white border-r border-gray-800 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:transform-none`}
      >
        <div className="h-full p-4">
          <HubSidebar
            sections={SECTIONS}
            activeKey={activeKey}
            onSelect={(key: SectionKey) => {
              setActiveKey(key);
              setIsSidebarOpen(false);
            }}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        {!selectedProject ? (
          <EmptyState
            title="No project selected"
            description="Please select or create a project from the sidebar."
          />
        ) : isLoading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <Spinner size="lg" color="gray" />
          </div>
        ) : (
          <ActiveComp />
        )}
      </main>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Project?"
      >
        <p className="text-gray-700">
          Are you sure you want to delete this project from the Hub? This will
          remove Hub metadata (Setup, Architecture, etc.) but not the board or
          columns.
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setIsDeleteOpen(false)}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (selectedProjectId) {
                // TODO: Hook deleteProject logic here
                setIsDeleteOpen(false);
              }
            }}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
