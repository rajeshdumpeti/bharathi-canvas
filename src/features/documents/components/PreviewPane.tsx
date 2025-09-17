import React from "react";
import DocxRenderer from "./DocxRenderer";
import { EmptyState } from "packages/ui";
import type { DocItem } from "types/documents";

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
        Supported types: <code>PDF</code>, <code>DOCX</code>, <code>TXT</code>{" "}
        (max 5&nbsp;MB each).
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

  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold truncate pr-4">{doc.name}</h2>
        <div className="text-xs text-gray-500">
          {(doc.size / 1024 / 1024).toFixed(2)} MB
        </div>
      </div>

      {isPDF && doc.dataURL && (
        <iframe
          title={doc.name}
          src={doc.dataURL}
          className="w-full h-[70vh] rounded border"
        />
      )}

      {isTXT && (
        <pre className="w-full h-[70vh] overflow-auto bg-gray-50 p-4 rounded text-sm whitespace-pre-wrap">
          {doc.text ?? "(empty file)"}
        </pre>
      )}

      {isDOCX && doc.dataURL && (
        <DocxRenderer
          dataURL={doc.dataURL}
          className="h-[70vh] overflow-auto rounded border bg-white"
        />
      )}

      {isDOCX && !doc.dataURL && (
        <div className="p-6 text-center text-gray-600">
          Preview not available.
        </div>
      )}
    </div>
  );
};

export default PreviewPane;
