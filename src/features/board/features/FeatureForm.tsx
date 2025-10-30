import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiX } from "react-icons/fi";
import { createFeature, updateFeature } from "api/features";
import type { Feature } from "types/boardFeatures";

interface Props {
  projectId: string;
  onClose: () => void;
  feature?: Feature | null;
}

export default function FeatureForm({ projectId, onClose, feature }: Props) {
  const queryClient = useQueryClient();
  const isEdit = !!feature;

  const [form, setForm] = useState({
    name: feature?.name ?? "",
    details: feature?.details ?? "",
    userStory: feature?.userStory ?? "",
    coreRequirements: feature?.coreRequirements ?? "",
    acceptanceCriteria: feature?.acceptanceCriteria ?? "",
    technicalNotes: feature?.technicalNotes ?? "",
  });

  const handleChange = (key: string, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        project_id: projectId,
        name: form.name,
        details: form.details,
        user_story: form.userStory,
        core_requirements: form.coreRequirements,
        acceptance_criteria: form.acceptanceCriteria,
        technical_notes: form.technicalNotes,
      };
      return isEdit
        ? updateFeature(feature!.id, payload)
        : createFeature(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["features", projectId] });
      onClose();
    },
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 max-h-[85vh]">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
      >
        <FiX size={20} />
      </button>

      <h2 className="text-xl font-semibold mb-4">
        {isEdit ? "Edit Feature" : "New Feature"}
      </h2>

      <div className="space-y-3">
        {[
          ["name", "Feature Name"],
          ["details", "Feature Details"],
        ].map(([key, label]) => (
          <div key={key}>
            <label className="block text-md font-bold text-gray-700">
              {label}:
            </label>
            {key === "name" ? (
              <input
                type="text"
                value={(form as any)[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <textarea
                rows={3}
                value={(form as any)[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between py-4">
        <button
          onClick={onClose}
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {mutation.isPending
            ? "Saving..."
            : isEdit
              ? "Save Changes"
              : "Create Feature"}
        </button>
      </div>
    </div>
  );
}
