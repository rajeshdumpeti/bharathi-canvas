import React, { useRef, useState } from 'react';

const UploadCard = ({
    pendingFiles,
    setPendingFiles,
    onConfirm,
    errorMsg,
    clearError,
}) => {
    const inputRef = useRef(null);
    const [isOver, setIsOver] = useState(false);

    const accept =
        '.pdf,.txt,.docx,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    const addFiles = (fileList) => {
        if (!fileList?.length) return;
        clearError?.();
        const arr = Array.from(fileList);
        // de-dup by name+size for this staging area
        const key = (f) => `${f.name}-${f.size}`;
        const existing = new Set(pendingFiles.map(key));
        const merged = [...pendingFiles];
        arr.forEach((f) => {
            if (!existing.has(key(f))) merged.push(f);
        });
        setPendingFiles(merged);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsOver(false);
        addFiles(e.dataTransfer.files);
    };

    return (
        <div>
            <h3 className="text-sm font-semibold text-gray-100 mb-2">Upload document</h3>
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsOver(true);
                }}
                onDragLeave={() => setIsOver(false)}
                onDrop={onDrop}
                className={`rounded-lg border-2 border-dashed p-4 text-sm bg-gray-800/40 ${isOver ? 'border-blue-400 bg-gray-800/70' : 'border-gray-700'
                    }`}
            >
                <p className="text-gray-300 mb-2">
                    Drag & drop PDF / DOCX / TXT here
                </p>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => inputRef.current?.click()}
                        className="px-3 py-1.5 rounded-md bg-white text-gray-900 text-sm font-medium hover:bg-gray-100"
                        type="button"
                    >
                        Browse files
                    </button>
                    <span className="text-gray-400 text-xs">Max 5 MB each</span>
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple
                    onChange={(e) => addFiles(e.target.files)}
                    className="hidden"
                />

                {pendingFiles.length > 0 && (
                    <ul className="mt-3 space-y-1 text-gray-200 max-h-28 overflow-auto pr-1">
                        {pendingFiles.map((f, i) => (
                            <li key={`${f.name}-${i}`} className="flex justify-between text-xs">
                                <span className="truncate">{f.name}</span>
                                <span className="text-gray-400 ml-2">
                                    {(f.size / 1024 / 1024).toFixed(2)} MB
                                </span>
                            </li>
                        ))}
                    </ul>
                )}

                {errorMsg && (
                    <div className="mt-3 text-xs text-red-400">{errorMsg}</div>
                )}
            </div>

            <button
                onClick={onConfirm}
                disabled={pendingFiles.length === 0}
                className={`mt-3 w-full px-3 py-2 rounded-md text-sm font-semibold ${pendingFiles.length
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                type="button"
            >
                Confirm & Upload
            </button>

            {pendingFiles.length > 0 && (
                <button
                    onClick={() => setPendingFiles([])}
                    type="button"
                    className="mt-2 w-full px-3 py-2 rounded-md text-sm bg-gray-800 text-gray-300 hover:bg-gray-700"
                >
                    Clear selection
                </button>
            )}
        </div>
    );
};

export default UploadCard;
