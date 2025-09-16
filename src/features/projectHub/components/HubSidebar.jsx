import React, { useState } from 'react';
import useProjectHub from '../../../hooks/useProjectHub';

export default function HubSidebar({ sections, activeKey, onSelect, onConfirmDelete }) {
    const { projects, selected, setSelectedId, addProject } = useProjectHub();
    const [newName, setNewName] = useState('');

    return (
        <div className="flex h-full flex-col">
            <h3 className="text-xl font-bold mb-4">Projects</h3>
            {/* Projects list */}
            <ul className="space-y-2 mb-4 overflow-y-auto pr-1">
                {projects.map((p) => (
                    <li
                        key={p.id}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition ${selected?.id === p.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
                            }`}
                    >
                        <span onClick={() => setSelectedId(p.id)} className="flex-1 pr-2">{p.name}</span>
                        {projects.length > 0 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onConfirmDelete?.(p); }}
                                className="p-1 rounded text-gray-400 hover:text-red-500"
                                title="Remove from Project Hub"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                    </li>
                ))}
                {projects.length === 0 && (
                    <li className="text-sm text-gray-400">No projects yet.</li>
                )}
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
                    onClick={() => { if (newName.trim()) { addProject(newName.trim()); setNewName(''); } }}

                    className={`w-full py-2 rounded-lg font-semibold transition
                            ${newName.trim()
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-600 text-gray-300 cursor-not-allowed'}`}
                >
                    Add Project
                </button>
            </div>

            {/* Sections */}
            <div className="mt-auto">
                <h4 className="font-semibold mb-2">Sections</h4>
                <ul className="space-y-1 max-h-64 overflow-y-auto pr-1">
                    {sections.map((s) => (
                        <li key={s.key}>
                            <button
                                onClick={() => onSelect?.(s.key)}
                                disabled={!selected}
                                className={`w-full text-left px-2 py-1 rounded ${activeKey === s.key ? 'bg-gray-700' : 'hover:bg-gray-800'
                                    } ${!selected ? 'opacity-50 cursor-not-allowed' : ''}`}
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
