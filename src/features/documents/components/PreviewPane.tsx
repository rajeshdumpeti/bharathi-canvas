import React from "react";
import DocxRenderer from "./DocxRenderer";
import { EmptyState } from "packages/ui";
import type { DocItem } from "types/documents";
import { DOCS_NS } from "stores/docs.store"; // <-- FIX: Import from store

const DocumentEmptyState: React.FC = () => (
  <EmptyState
    title="Add your first document"
    description={
      <>
        Use the <span className="font-medium">“Upload Document”</span> card in
        the left sidebar menu to add files. We’ll store them locally and show a
        preview here.
      </>
    }
    bullets={[
      <>
        Supported types: PDF, DOCX, TXT, PNG, JPG, GIF, WEBP (max 5 MB each).
      </>,
      "Your documents will appear in the list on the left.",
      "Click a document to open its preview on this page.",
    ]}
  />
);

type Props = { doc: DocItem | null };

const PreviewPane: React.FC<Props> = ({ doc }) => {
  if (!doc) return <DocumentEmptyState />;

  const isPDF = /pdf/i.test(doc.type) || /\.pdf$/i.test(doc.name);
  const isTXT = /text\/plain/i.test(doc.type) || /\.txt$/i.test(doc.name);
  const isDOCX = /docx/i.test(doc.type) || /\.docx$/i.test(doc.name);
  const isImage =
    /image\/(png|jpe?g|gif|webp)/i.test(doc.type) ||
    /\.(png|jpe?g|gif|webp)$/i.test(doc.name);

  // --- FIX: Read from session storage with the correct key ---
  const cachedDataURL =
    doc.dataURL ?? sessionStorage.getItem(`${DOCS_NS}:blob:${doc.id}`) ?? null;
  const cachedText =
    doc.text ?? sessionStorage.getItem(`${DOCS_NS}:txt:${doc.id}`) ?? null;
  // --- END FIX ---

  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold truncate pr-4">{doc.name}</h2>

        {/* FIX: Use normalized 'size' property */}
        <div className="text-xs text-gray-500">
          {(doc.size / 1024 / 1024).toFixed(2)} MB
        </div>
      </div>

      {/* FIX: Check cachedDataURL, not doc.dataURL */}
      {isPDF && cachedDataURL && (
        <iframe
          title={doc.name}
          src={cachedDataURL}
          className="w-full h-[70vh] rounded border"
        />
      )}

      {isTXT && (
        <pre className="w-full h-[70vh] overflow-auto bg-gray-50 p-4 rounded text-sm whitespace-pre-wrap">
          {cachedText ?? "(empty file)"}
        </pre>
      )}

      {isDOCX && cachedDataURL && (
        <DocxRenderer
          dataURL={cachedDataURL}
          className="h-[70vh] overflow-auto rounded border bg-white"
        />
      )}

      {isImage && cachedDataURL && (
        <img
          src={cachedDataURL}
          alt={doc.name}
          className="max-h-[70vh] w-auto mx-auto rounded shadow-md object-contain"
        />
      )}

      {/* FIX: Check cachedDataURL, not doc.dataURL */}
      {(isDOCX || isImage || isPDF) && !cachedDataURL && (
        <div className="p-6 text-center text-gray-600">
          Preview not available.
        </div>
      )}
    </div>
  );
};

export default PreviewPane;
