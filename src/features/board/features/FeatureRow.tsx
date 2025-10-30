import React, { useState } from "react";
import Modal from "components/ui/Modal"; // adjust import path if needed
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFeatureById } from "api/features";
import {
  FiChevronDown,
  FiChevronRight,
  FiEdit2,
  FiExternalLink,
} from "react-icons/fi";
import FeatureForm from "./FeatureForm";
import type { Feature } from "types/boardFeatures";
import FeatureStories from "./FeatureStories";

export default function FeatureRow({
  feature,
  projectId,
}: {
  feature: Feature;
  projectId: string;
}) {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteFeatureById(feature.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["features", projectId] });
      setShowDeleteModal(false);
    },
  });

  const handleDelete = () => deleteMutation.mutate();

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(!open)}
            className="rounded-md border bg-white px-2 py-1 hover:bg-gray-100"
          >
            {open ? <FiChevronDown /> : <FiChevronRight />}
          </button>
          <h2 className="text-lg font-semibold text-gray-900">
            {feature.name}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
          >
            <FiEdit2 className="h-4 w-4" /> Edit
          </button>

          <button
            onClick={() =>
              (window.location.href = `/board?project=${feature.projectId}`)
            }
            className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
          >
            <FiExternalLink className="h-4 w-4" /> Open Board
          </button>
        </div>
      </div>

      {/* Expanded View */}
      {open && (
        <div className="p-5 space-y-4 bg-white">
          <FeatureSection title="Feature Details" content={feature.details} />
          {/* <FeatureSection title="User Story" content={feature.userStory} />
          <FeatureSection
            title="Core Requirements"
            content={feature.coreRequirements}
          />
          <FeatureSection
            title="Acceptance Criteria"
            content={feature.acceptanceCriteria}
          />
          <FeatureSection
            title="Technical Notes"
            content={feature.technicalNotes}
          /> */}

          {/* 🧩 Added: User Stories from backend */}
          <FeatureStories featureId={feature.id} />
        </div>
      )}

      {/* Feature Edit Modal */}
      {editMode && (
        <Modal isOpen={editMode} onClose={() => setEditMode(false)}>
          <FeatureForm
            projectId={projectId}
            feature={feature}
            onClose={() => setEditMode(false)}
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Feature"
      >
        <p className="text-gray-700 mb-4">
          Are you sure you want to delete <b>{feature.name}</b>? This action
          cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}

/* --- small helper --- */
const FeatureSection = ({
  title,
  content,
}: {
  title: string;
  content?: string | null;
}) => {
  if (!content) return null;
  return (
    <div className="border-b">
      <h3 className="text-lg font-semibold text-gray-800 mb-1 ">{title}:</h3>
      <p className="text-sm text-gray-700 whitespace-pre-line p-4">{content}</p>
    </div>
  );
};
