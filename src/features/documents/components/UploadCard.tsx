import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDocsStore } from "stores/docs.store";

type FormData = { files: FileList | null };

const ACCEPT =
  ".pdf,.txt,.docx,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const UploadCard: React.FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isOver, setIsOver] = useState(false);

  // ⚠️ Use separate selectors (stable functions), not a single object-returning selector
  const pending = useDocsStore((s) => s.pending);
  const error = useDocsStore((s) => s.error);
  const stageFiles = useDocsStore((s) => s.stageFiles);
  const clearPending = useDocsStore((s) => s.clearPending);
  const setError = useDocsStore((s) => s.setError);
  const clearError = useDocsStore((s) => s.clearError);
  const addDocuments = useDocsStore((s) => s.addDocuments);

  const { register, handleSubmit, setValue } = useForm<FormData>({
    defaultValues: { files: null },
  });

  // ✅ Call register("files") exactly ONCE per render
  const fileReg = register("files");

  const addFiles = (list: FileList | null) => {
    if (!list?.length) return;
    clearError();
    stageFiles(Array.from(list));
    // keep the RHF value in sync so re-submitting works
    setValue("files", list);
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setIsOver(false);
    addFiles(e.dataTransfer.files);
  };

  const onConfirm = async () => {
    if (!pending.length) {
      setError("Please select at least one file.");
      return;
    }
    await addDocuments(pending);
  };

  return (
    <form onSubmit={handleSubmit(onConfirm)}>
      <h3 className="text-sm font-semibold text-gray-100 mb-2">
        Upload document
      </h3>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsOver(true);
        }}
        onDragLeave={() => setIsOver(false)}
        onDrop={onDrop}
        className={`rounded-lg border-2 border-dashed p-4 text-sm bg-gray-800/40 ${
          isOver ? "border-blue-400 bg-gray-800/70" : "border-gray-700"
        }`}
      >
        <p className="text-gray-300 mb-2">Drag & drop PDF / DOCX / TXT here</p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="px-3 py-1.5 rounded-md bg-white text-gray-900 text-sm font-medium hover:bg-gray-100"
          >
            Browse files
          </button>
          <span className="text-gray-400 text-xs">Max 5 MB each</span>
        </div>

        <input
          {...fileReg}
          // ✅ Use the same register result; DO NOT call register(...) again here
          ref={(el) => {
            inputRef.current = el;
            fileReg.ref(el);
          }}
          type="file"
          accept={ACCEPT}
          multiple
          onChange={(e) => addFiles(e.target.files)}
          className="hidden"
        />

        {pending.length > 0 && (
          <ul className="mt-3 space-y-1 text-gray-2 00 max-h-28 overflow-auto pr-1">
            {pending.map((f, i) => (
              <li
                key={`${f.name}-${i}`}
                className="flex justify-between text-xs"
              >
                <span className="truncate">{f.name}</span>
                <span className="text-gray-400 ml-2">
                  {(f.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </li>
            ))}
          </ul>
        )}

        {error && <div className="mt-3 text-xs text-red-400">{error}</div>}
      </div>

      <button
        type="submit"
        disabled={pending.length === 0}
        className={`mt-3 w-full px-3 py-2 rounded-md text-sm font-semibold ${
          pending.length
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-700 text-gray-400 cursor-not-allowed"
        }`}
      >
        Confirm & Upload
      </button>

      {pending.length > 0 && (
        <button
          type="button"
          onClick={() => {
            clearPending();
            clearError();
            if (inputRef.current) inputRef.current.value = "";
          }}
          className="mt-2 w-full px-3 py-2 rounded-md text-sm bg-gray-800 text-gray-300 hover:bg-gray-700"
        >
          Clear selection
        </button>
      )}
    </form>
  );
};

export default UploadCard;
