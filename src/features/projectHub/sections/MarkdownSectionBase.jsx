import React, { useState, useEffect } from 'react';
import useProjectHub from '../../../hooks/useProjectHub';
import MarkdownEditor from '../components/MarkdownEditor';
import MarkdownView from '../components/MarkdownView';

export default function MarkdownSectionBase({ sectionKey, placeholder }) {
    const { selected, updateSection } = useProjectHub();
    const [mode, setMode] = useState('read');
    const [text, setText] = useState('');

    useEffect(() => {
        setText(selected?.sections?.[sectionKey] || '');
    }, [selected, sectionKey]);

    const onSave = () => {
        updateSection(sectionKey, text);
        setMode('read');
    };

    if (!selected) {
        return (
            <div className="rounded-lg border bg-white p-8 text-gray-600">
                Create or select a project on the left to edit this section.
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <div className="ml-auto flex gap-2">
                    {mode === 'read' ? (
                        <button onClick={() => setMode('edit')} className="px-3 py-2 rounded bg-gray-900 text-white">Edit</button>
                    ) : (
                        <>
                            <button onClick={() => setMode('read')} className="px-3 py-2 rounded bg-gray-200">Cancel</button>
                            <button onClick={onSave} className="px-3 py-2 rounded bg-blue-600 text-white">Save</button>
                        </>
                    )}
                </div>
            </div>

            {mode === 'read' ? (
                text?.trim() ? (
                    <div className="rounded border bg-white p-4">
                        <MarkdownView text={text} />
                    </div>
                ) : (
                    <div className="rounded-lg border bg-white p-8 text-gray-500">
                        Nothing here yet. Click <strong>Edit</strong> to add content.
                    </div>
                )
            ) : (
                <MarkdownEditor value={text} onChange={setText} placeholder={placeholder} />
            )}
        </div>
    );
}
