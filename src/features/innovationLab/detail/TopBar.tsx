import React from "react";
import { FiArrowLeft, FiDownload, FiSave, FiTrash2 } from "react-icons/fi";

export default function TopBar({
  onBack,
  onExportMd,
  onExportPdf,
  onSave,
  onDelete,
}: {
  onBack: () => void;
  onExportMd: () => void;
  onExportPdf: () => void;
  onSave: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="sticky top-0 z-10 -mx-4 sm:-mx-6 mb-1 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-100 px-4 sm:px-6 py-2">
      <div className="mx-auto max-w-5xl flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white/70 px-3 py-2 text-gray-700 hover:bg-white shadow-sm"
            onClick={onBack}
          >
            <FiArrowLeft /> Back
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white/70 px-3 py-2 text-gray-700 hover:bg-white shadow-sm"
            onClick={onExportMd}
            title="Export Markdown"
          >
            <FiDownload /> Export
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white/70 px-3 py-2 text-gray-700 hover:bg-white shadow-sm"
            onClick={onExportPdf}
            title="Download PDF"
          >
            <FiDownload /> Download PDF
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-3 py-2 text-white shadow-sm hover:from-indigo-700 hover:to-blue-700 active:translate-y-[1px]"
            onClick={onSave}
          >
            <FiSave /> Save
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-2 text-rose-700 hover:bg-rose-100 border border-rose-100"
            onClick={onDelete}
          >
            <FiTrash2 /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
