import React from 'react';

const FiltersPanel = ({
    projects = [],
    selectedProjectId,
    onSelectProject,
    fromDate,
    toDate,
    onChangeFrom,
    onChangeTo,
    grouping,
    onChangeGrouping,
    onGenerate,
    releases = [],
    onLoadRelease,
}) => {
    return (
        <div className="h-full p-4 space-y-6 text-white">
            <div>
                <h3 className="text-sm font-semibold mb-2">Project</h3>
                <select
                    value={selectedProjectId || ''}
                    onChange={(e) => onSelectProject(e.target.value)}
                    className="w-full rounded-md bg-gray-800 border border-gray-700 p-2 text-sm"
                >
                    <option value="">Select a project…</option>
                    {projects.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <h3 className="text-sm font-semibold mb-2">Date range</h3>
                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => onChangeFrom(e.target.value)}
                        className="rounded-md bg-gray-800 border border-gray-700 p-2 text-sm"
                    />
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => onChangeTo(e.target.value)}
                        className="rounded-md bg-gray-800 border border-gray-700 p-2 text-sm"
                    />
                </div>
            </div>

            <div>
                <h3 className="text-sm font-semibold mb-2">Group by</h3>
                <select
                    value={grouping}
                    onChange={(e) => onChangeGrouping(e.target.value)}
                    className="w-full rounded-md bg-gray-800 border border-gray-700 p-2 text-sm"
                >
                    <option value="type">Change type (Feature/Fix/…)</option>
                    <option value="label">First label</option>
                </select>
            </div>

            <button
                onClick={onGenerate}
                disabled={!selectedProjectId}
                title={selectedProjectId ? 'Generate release notes' : 'Select a project first'}
                className={`w-full px-4 py-2 rounded-lg font-semibold ${selectedProjectId
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
            >
                Generate
            </button>

            <div>
                <h3 className="text-sm font-semibold mb-2 mt-4">Previous releases</h3>
                {releases.length === 0 ? (
                    <p className="text-gray-400 text-sm">No saved releases.</p>
                ) : (
                    <ul className="space-y-1 max-h-48 overflow-auto pr-1">
                        {releases
                            .slice()
                            .reverse()
                            .map((r) => (
                                <li
                                    key={r.id}
                                    className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-gray-800 text-sm cursor-pointer"
                                    onClick={() => onLoadRelease(r)}
                                    title={r.version}
                                >
                                    <span className="truncate">{r.version}</span>
                                    <span className="text-gray-400 ml-2">{new Date(r.date).toLocaleDateString()}</span>
                                </li>
                            ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default FiltersPanel;
