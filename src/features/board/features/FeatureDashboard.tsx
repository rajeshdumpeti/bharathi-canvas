import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchFeaturesByProject } from "api/features";
import FeatureForm from "./FeatureForm";
import FeatureRow from "./FeatureRow";
import { FiPlus } from "react-icons/fi";
import Modal from "components/ui/Modal"; // adjust import path if needed
import { useBoardActions } from "../hooks/useBoardActions";

export default function FeatureDashboard() {
  const [search] = useSearchParams();
  const { selectedProject } = useBoardActions();
  const [showForm, setShowForm] = useState(false);
  const projectId = search.get("project") ?? "";

  const { data: features = [], isLoading } = useQuery({
    queryKey: ["features", projectId],
    queryFn: () => fetchFeaturesByProject(projectId),
    enabled: !!projectId,
  });

  const handleCreateFeature = () => {
    if (!projectId) {
      alert("Please select a project first.");
      return;
    }
    setShowForm(true);
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4">
      <div className="sticky top-0 z-10 -mx-4 sm:mx-0 border-b ">
        <div className="px-4 sm:px-0 py-3 flex flex-row items-center justify-between">
          <span className="font-bold">
            {selectedProject.name.toUpperCase()} B
          </span>
          <button
            onClick={handleCreateFeature}
            className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
          >
            <FiPlus className="h-4 w-4" /> New Feature
          </button>
        </div>
        <h4 className="text-2xl font-bold">Backlog</h4>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500 py-10">Loading features...</p>
      ) : features.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed p-8 text-center text-gray-600">
          <p>No features yet for this project.</p>
          <button
            onClick={handleCreateFeature}
            className="mt-3 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
          >
            + Create First Feature
          </button>
        </div>
      ) : (
        <div className="grid gap-3 px-4">
          {features.map((feature) => (
            <FeatureRow
              key={feature.id}
              feature={feature}
              projectId={projectId}
            />
          ))}
        </div>
      )}

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
