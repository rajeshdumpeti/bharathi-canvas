import React, { useMemo, useState, useEffect } from 'react';

import UploadCard from './components/UploadCard';
import DocumentsList from './components/DocumentsList';
import PreviewPane from './components/PreviewPane';
import Modal from '../../components/ui/Modal'
import { storage, DOCS_NS } from '../../packages/storage';

const DocumentsView = () => {
    const [documents, setDocuments] = useState(() => storage.get(DOCS_NS, 'items', []));
    const [selectedId, setSelectedId] = useState(() => storage.get(DOCS_NS, 'selectedId', null));
    const [pendingFiles, setPendingFiles] = useState([]); // staged in UploadCard
    const [errorMsg, setErrorMsg] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [docToDelete, setDocToDelete] = useState(null);
    const [isDeleteDocOpen, setIsDeleteDocOpen] = useState(false);
    const selectedDoc = useMemo(
        () => documents.find((d) => d.id === selectedId) || null,
        [documents, selectedId]
    );

    useEffect(() => {
        storage.set(DOCS_NS, 'items', documents);
    }, [documents]);

    useEffect(() => {
        if (selectedId) storage.set(DOCS_NS, 'selectedId', selectedId);
        else storage.remove(DOCS_NS, 'selectedId');
    }, [selectedId]);

    const addDocuments = async (files) => {
        setErrorMsg('');
        if (!files || !files.length) return;

        // Validation
        const MAX = 5 * 1024 * 1024; // 5MB
        const allow = [
            'application/pdf',
            'text/plain',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        const byExtOK = (name) => /\.(pdf|txt|docx)$/i.test(name);

        // Readers
        const readFile = (file) =>
            new Promise((resolve, reject) => {
                const reader = new FileReader();

                if (file.type === 'text/plain' || /\.txt$/i.test(file.name)) {
                    reader.onload = () => resolve({ kind: 'txt', text: reader.result });
                    reader.onerror = reject;
                    reader.readAsText(file);
                } else {
                    // PDF/DOCX => dataURL to preview/download
                    reader.onload = () => resolve({ kind: 'data', dataURL: reader.result });
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                }
            });

        try {
            const toAdd = [];
            for (const f of files) {
                if (f.size > MAX) {
                    setErrorMsg(`"${f.name}" is larger than 5 MB.`);
                    return;
                }
                if (!(allow.includes(f.type) || byExtOK(f.name))) {
                    setErrorMsg(`"${f.name}" is not a supported type (PDF, DOCX, TXT).`);
                    return;
                }
            }

            const results = await Promise.all(files.map((f) => readFile(f)));

            results.forEach((res, idx) => {
                const f = files[idx];
                toAdd.push({
                    id: `${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 7)}`,
                    name: f.name,
                    type: f.type || (f.name.match(/\.(\w+)$/)?.[1] || '').toLowerCase(),
                    size: f.size,
                    createdAt: new Date().toISOString(),
                    dataURL: res.kind === 'data' ? res.dataURL : null,
                    text: res.kind === 'txt' ? res.text : null,
                });
            });

            const updated = [...documents, ...toAdd];
            setDocuments(updated);
            storage.set(DOCS_NS, 'items', updated);

            if (!selectedId && updated[0]) {
                setSelectedId(updated[0].id);
                storage.set(DOCS_NS, 'selectedId', updated[0].id);
            }

            // clear staged selection
            setPendingFiles([]);
        } catch (err) {
            console.error(err);
            setErrorMsg('Failed to read one or more files.');
        }
    };

    const handleDelete = (doc) => {
        const updated = documents.filter((d) => d.id !== doc.id);
        setDocuments(updated);
        storage.set(DOCS_NS, 'items', updated);
        if (selectedId === doc.id) {
            const nextId = updated[0]?.id || null;
            setSelectedId(nextId);
            if (nextId) storage.set(DOCS_NS, 'selectedId', nextId);
            else storage.remove(DOCS_NS, 'selectedId');
        }
    };

    const confirmDeleteDocument = (doc) => {
        setDocToDelete(doc);
        setIsDeleteDocOpen(true);
    };

    const handleDeleteDocument = () => {
        if (!docToDelete) return;
        setDocuments((prev) => {
            const next = prev.filter((d) => d.id !== docToDelete.id);
            storage.set(DOCS_NS, 'items', next);
            return next;
        });
        // if you keep a selected doc id, clear it if it was deleted
        if (selectedId === docToDelete.id) {
            setSelectedId(null);
        }
        setIsDeleteDocOpen(false);
        setDocToDelete(null);
    };

    return (
        <div className="h-screen w-full flex flex-col bg-gray-50">
            {/* Shell: left nav + right content */}
            <div className="flex-1 min-h-0 w-full">
                <div className="relative h-full w-full flex overflow-hidden">
                    {/* Backdrop for mobile/tablet */}
                    <div
                        onClick={() => setIsSidebarOpen(false)}
                        className={`lg:hidden fixed inset-0 z-20 bg-black/40 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                            }`}
                    />

                    {/* Left (documents nav) as a drawer on mobile, static on desktop */}
                    <aside
                        aria-label="Documents sidebar"
                        className={`
                            fixed lg:static inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white
                            border-r border-gray-800 overflow-y-auto shrink-0
                            transform transition-transform duration-300 ease-in-out
                            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                            lg:translate-x-0 lg:transform-none
                            `}
                    >
                        <div className="h-full p-4 space-y-6">
                            <UploadCard
                                pendingFiles={pendingFiles}
                                setPendingFiles={setPendingFiles}
                                onConfirm={() => addDocuments(pendingFiles)}
                                errorMsg={errorMsg}
                                clearError={() => setErrorMsg('')}
                            />

                            <DocumentsList
                                onConfirmDelete={confirmDeleteDocument}
                                documents={documents}
                                selectedId={selectedId}
                                onSelect={(id) => {
                                    setSelectedId(id);
                                    storage.set(DOCS_NS, 'selectedId', id);
                                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                                }}
                                onDelete={handleDelete}
                            />
                        </div>
                    </aside>

                    {/* Right content */}
                    <main className="flex-1 min-w-0 h-full overflow-auto">
                        {/* keep your existing right-side content exactly as-is */}
                        <div className="h-full flex flex-col">
                            <div className="bg-white border-b">
                                <div className="mx-auto w-full max-w-7xl flex items-center justify-between px-6 py-4">
                                    <h1 className="text-3xl font-bold text-gray-900">Documents</h1>

                                </div>
                            </div>

                            <div className="flex-1 overflow-auto">
                                <div className="mx-auto w-full max-w-7xl p-6">
                                    <PreviewPane doc={selectedDoc} />
                                </div>
                            </div>
                        </div>
                        <Modal
                            isOpen={isDeleteDocOpen}
                            onClose={() => { setIsDeleteDocOpen(false); setDocToDelete(null); }}
                            title="Delete document?"
                        >
                            <p className="text-gray-700">
                                {`Are you sure you want to delete “${docToDelete?.name || 'this file'}”? This action cannot be undone.`}
                            </p>
                            <div className="flex justify-between space-x-3 mt-6">
                                <button
                                    onClick={() => { setIsDeleteDocOpen(false); setDocToDelete(null); }}
                                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteDocument}
                                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </Modal>

                    </main>
                </div>
            </div>
        </div>
    );
};

export default DocumentsView;
