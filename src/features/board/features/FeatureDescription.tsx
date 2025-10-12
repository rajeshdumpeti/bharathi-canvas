// src/features/board/features/FeatureDescription.tsx
import React from "react";
import { FiBookOpen } from "react-icons/fi";

export interface FeatureDescriptionProps {
  desc: string;
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onChange: (v: string) => void;
  onSave: () => void;
}

const FeatureDescription: React.FC<FeatureDescriptionProps> = ({
  desc,
  editing,
  onEdit,
  onCancel,
  onChange,
  onSave,
}) => (
  <div className="mb-4 rounded-lg border border-indigo-100 bg-indigo-50/60 p-3 sm:p-4">
    <div className="mb-2 flex items-center justify-between">
      <span className="inline-flex items-center gap-2 font-medium text-indigo-900">
        <FiBookOpen className="text-indigo-500" />
        Description
      </span>
      {!editing && (
        <button
          onClick={onEdit}
          className="text-xs font-medium text-indigo-700 hover:text-indigo-800"
        >
          Edit
        </button>
      )}
    </div>

    {editing ? (
      <>
        <textarea
          value={desc}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe this feature..."
          rows={4}
          className="w-full rounded-md border border-indigo-200 bg-white px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="mt-2 flex items-center justify-end gap-2">
          <button
            onClick={onSave}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="rounded-md border border-indigo-200 bg-white px-3 py-1.5 text-xs hover:bg-indigo-50"
          >
            Cancel
          </button>
        </div>
      </>
    ) : desc ? (
      <p className="text-sm leading-6 text-indigo-900/90 whitespace-pre-wrap break-words">
        {desc}
      </p>
    ) : (
      <button
        onClick={onEdit}
        className="text-xs font-medium text-indigo-700 hover:text-indigo-800"
      >
        + Add description
      </button>
    )}
  </div>
);

export default FeatureDescription;
