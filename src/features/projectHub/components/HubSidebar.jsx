import React, { useState } from 'react';
import useProjectHub from '../../../hooks/useProjectHub';

export default function HubSidebar({ sections, activeKey, onSelect, onConfirmDelete }) {
    const { projects, selected, selectedId, setSelectedId, selectProject, addProject } = useProjectHub();
    const [newName, setNewName] = useState('');

    return (
        <div className="flex h-full flex-col">
            <h3 className="text-xl font-bold mb-4">Projects</h3>

            {/* Projects list */}
            <ul className="space-y-2 mb-4 overflow-y-auto pr-1">
                {projects.map(p => (
                    <li
                        key={p.id}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition
    ${selected?.id === p.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'}`}
                    >
                        <span onClick={() => selectProject(p.id)} className="flex-1 pr-2">{p.name}</span>
                        {projects.length > 0 && (
                            <button
                                onClick={() => { }}
                                className="p-1 rounded text-gray-400 hover:text-red-500"
                                title="Delete Project"
                            >
                                ×
                            </button>
                        )}
                    </li>

                ))}
            </ul>

            {/* New project */}
            <div className="mb-6">
                <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="New project name"
                    className="w-full p-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
                />
                <button
                    onClick={() => { const n = newName.trim(); if (n) { addProject(n); setNewName(''); } }}
                    className="mt-2 w-full px-3 py-2 rounded bg-blue-600 hover:bg-blue-700"
                >
                    Add Project
                </button>
            </div>

            {/* Sections */}
            <div className="mt-auto">
                <h4 className="font-semibold mb-2">Sections</h4>
                <ul className="space-y-1 max-h-64 overflow-y-auto pr-1">
                    {sections.map(s => (
                        <li key={s.key}>
                            <button
                                onClick={() => onSelect?.(s.key)}
                                disabled={!selected}
                                className={`w-full text-left px-2 py-1 rounded
                  ${activeKey === s.key ? 'bg-gray-700' : 'hover:bg-gray-800'}
                  ${!selected ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {s.title}
                            </button>
                        </li>
                    ))}
                </ul>
                {!selected && (
                    <p className="mt-3 text-xs text-gray-400">
                        Create/select a project to enable sections.
                    </p>
                )}
            </div>
        </div>
    );
}
