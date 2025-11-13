import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSyncProjectParam } from "hooks/useSyncProjectParam";
import { EmptyState } from "packages/ui";
import { fetchFeaturesByProject } from "api/features";
import FeatureForm from "./FeatureForm";
import FeatureRow from "./FeatureRow";
import { FiPlus, FiFolder, FiList } from "react-icons/fi";
import Modal from "components/ui/Modal";
import { useBoardActions } from "../hooks/useBoardActions";

export default function FeatureDashboard() {
  const [search] = useSearchParams();
  const { selectedProject } = useBoardActions();
  const [showForm, setShowForm] = useState(false);
  const projectId = search.get("project") ?? "";

  // This ensures selectedProject is loaded on hard refresh
  useSyncProjectParam();

  const { data: features = [], isLoading } = useQuery({
    queryKey: ["features", projectId],
    queryFn: () => fetchFeaturesByProject(projectId),
    enabled: !!projectId,
  });

  // Show an empty state if no project is selected or being loaded
  if (!selectedProject && !projectId) {
    return (
      <div className="pt-10">
        <EmptyState
          icon={<FiFolder className="h-12 w-12 text-gray-400" />}
          title="No Project Selected"
          description="Select or create a project to start organizing features and user stories."
          bullets={[
            "Features help group related user stories together",
            "Create epics for larger functionality areas",
            "Organize stories by feature for better planning",
          ]}
        />
      </div>
    );
  }

  // Show a simple loader while the sync hook is running
  if (!selectedProject && projectId) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
        <p className="text-gray-500">Loading project data...</p>
      </div>
    );
  }

  const handleCreateFeature = () => {
    if (!projectId) {
      alert("Please select a project first.");
      return;
    }
    setShowForm(true);
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="px-6 py-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FiList className="h-6 w-6 text-blue-600" />
                {selectedProject.name}
              </h1>
              <p className="text-gray-600 mt-1">Feature Backlog</p>
            </div>
            <button
              onClick={handleCreateFeature}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              <FiPlus className="h-4 w-4" />
              New Feature
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="px-6 py-3 bg-gray-50 border-b">
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <span className="font-medium">{features.length}</span>
              <span>Features</span>
            </span>
            <span>•</span>
            <span>Organize your user stories by feature</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="bg-white rounded-lg border shadow-sm p-8">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
            <p className="text-gray-500">Loading features...</p>
          </div>
        </div>
      ) : features.length === 0 ? (
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
          <FiList className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No features yet
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Features help you group user stories. For example, a{" "}
            <strong>'User Login'</strong> feature might contain stories for the
            login form, password reset, and Google sign-in.
          </p>
          <button
            onClick={handleCreateFeature}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="h-4 w-4" />
            Create Your First Feature
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {features.map((feature) => (
            <FeatureRow
              key={feature.id}
              feature={feature}
              projectId={projectId}
            />
          ))}
        </div>
      )}

      {/* Create Feature Modal */}
      {showForm && (
        <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
          <FeatureForm
            projectId={projectId}
            onClose={() => setShowForm(false)}
          />
        </Modal>
      )}
    </div>
  );
}
