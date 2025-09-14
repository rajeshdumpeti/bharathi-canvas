import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { storage, HUB_NS } from '../../packages/storage';

export const ProjectHubContext = createContext(undefined);
export const useProjectHubContext = () => useContext(ProjectHubContext);

const LIST_KEY = 'hub:projects';
const SELECTED_KEY = 'selectedProjectId';

function loadProjects() {
    return storage.get(HUB_NS, LIST_KEY, []);
}
function persistProjects(list) {
    storage.set(HUB_NS, LIST_KEY, list);
}

export function ProjectHubProvider({ children }) {
    const [projects, setProjects] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    const refresh = () => setProjects(loadProjects());

    useEffect(() => {
        refresh();
        setSelectedId(storage.get(HUB_NS, SELECTED_KEY, null));
    }, []);

    useEffect(() => {
        if (selectedId) storage.set(HUB_NS, SELECTED_KEY, selectedId);
        else storage.remove(HUB_NS, SELECTED_KEY);
    }, [selectedId]);

    const selected = useMemo(
        () => projects.find((p) => p.id === selectedId) || null,
        [projects, selectedId]
    );

    const selectProject = (id) => setSelectedId(id);

    const addProject = (name) => {
        const n = (name || '').trim();
        if (!n) return null;
        const id = `${n.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
        const proj = {
            id,
            name: n,
            sections: {}, // Hub-only data
            // NOTE: no Board columns here; Hub is independent
        };
        const next = [...projects, proj];
        setProjects(next);
        persistProjects(next);
        setSelectedId(id);
        return proj;
    };

    // Hub-only delete (does NOT touch Board data)
    const deleteProject = (id) => {
        const next = projects.filter((p) => p.id !== id);
        setProjects(next);
        persistProjects(next);
        if (selectedId === id) setSelectedId(null);
    };

    const updateSection = (sectionKey, data) => {
        if (!selectedId) return;
        const next = projects.map((p) =>
            p.id !== selectedId ? p : { ...p, sections: { ...(p.sections || {}), [sectionKey]: data } }
        );
        setProjects(next);
        persistProjects(next);
    };

    const value = {
        projects,
        selected,
        selectedId,
        setSelectedId,   // used by your sidebar; safe to expose
        selectProject,
        addProject,
        deleteProject,
        updateSection,
        refresh,
    };

    return <ProjectHubContext.Provider value={value}>{children}</ProjectHubContext.Provider>;
}

export default function useProjectHub() {
    const ctx = useProjectHubContext();
    if (!ctx) throw new Error('useProjectHub must be used within ProjectHubProvider');
    return ctx;
}
