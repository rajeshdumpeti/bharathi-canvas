import React from "react";

// Define the props interface
interface PreviewPanelProps {
  version: string;
  setVersion: (version: string) => void;
  notesMd: string;
  setNotesMd: (notes: string) => void;
  onCopy: () => void;
  onDownload: () => void;
  onSave: () => void;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({
  version,
  setVersion,
  notesMd,
  setNotesMd,
  onCopy,
  onDownload,
  onSave,
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="bg-white border-b">
        <div className="mx-auto w-full max-w-7xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Version</label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="rounded-md border border-gray-300 p-2 text-sm"
              placeholder="v1.0.0"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onCopy}
              className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
            >
              Copy MD
            </button>
            <button
              onClick={onDownload}
              className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
            >
              Download .md
            </button>
            <button
              onClick={onSave}
              className="px-3 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm font-semibold"
            >
              Save Release
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <div className="mx-auto w-full max-w-7xl px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg border bg-white p-3">
            <label className="block text-sm text-gray-600 mb-1">
              Markdown (editable)
            </label>
            <textarea
              value={notesMd}
              onChange={(e) => setNotesMd(e.target.value)}
              className="w-full h-[60vh] rounded-md border border-gray-300 p-2 font-mono text-sm"
            />
          </div>
          <div className="rounded-lg border bg-white p-3">
            <label className="block text-sm text-gray-600 mb-1">Preview</label>
            <pre className="w-full h-[60vh] overflow-auto whitespace-pre-wrap text-sm">
              {notesMd}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;
