import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

export const useProjectHubContext = () => useContext(ProjectHubContext)

// export default useProjectHub;
const HUB_STORAGE_KEY = 'hub:projects';     // Project Hub’s own list
const BOARD_STORAGE_KEY = 'projects';         // Board’s list (for one-time migration)
const SELECTED_KEY = 'hub:selectedProjectId';

export const ProjectHubContext = createContext(undefined);

function persistProjects(list) {
    localStorage.setItem(HUB_STORAGE_KEY, JSON.stringify(list));
}

function loadProjects() {
    try {
        // Prefer hub list
        const hubRaw = localStorage.getItem(HUB_STORAGE_KEY);
        if (hubRaw) {
            const list = JSON.parse(hubRaw);
            return Array.isArray(list) ? list : [];
        }

        // One-time migration from Board's "projects"
        const boardRaw = localStorage.getItem(BOARD_STORAGE_KEY);
        const boardList = boardRaw ? JSON.parse(boardRaw) : [];
        const migrated = Array.isArray(boardList)
            ? boardList.map(p => ({
                id: p.id,
                name: p.name,
                // keep any hub data if it existed, otherwise empty
                sections: p.sections || {},
            }))
            : [];

        persistProjects(migrated);
        return migrated;
    } catch {
        return [];
    }
}

export function ProjectHubProvider({ children }) {
    const [projects, setProjects] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    const refresh = () => setProjects(loadProjects());

    // initial load + restore last hub selection
    useEffect(() => {
        refresh();
        setSelectedId(localStorage.getItem(SELECTED_KEY));
    }, []);

    // keep hub selection persisted
    useEffect(() => {
        if (selectedId) localStorage.setItem(SELECTED_KEY, selectedId);
        else localStorage.removeItem(SELECTED_KEY);
    }, [selectedId]);

    const selected = useMemo(
        () => projects.find((p) => p.id === selectedId) || null,
        [projects, selectedId]
    );

    const selectProject = (id) => setSelectedId(id);

    const addProject = (name) => {
        const projectName = (name || '').trim();
        if (!projectName) return null;

        const id = `${projectName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

        const proj = {
            id,
            name: projectName,
            sections: {}, // Hub keeps its own section data only
        };

        const next = [...projects, proj];
        setProjects(next);
        persistProjects(next);
        setSelectedId(id);
        return proj;
    };


    const deleteProject = (id) => {
        const next = projects.filter(p => p.id !== id);
        setProjects(next);
        persistProjects(next);

        if (selectedId === id) {
            const fallback = next[0]?.id || null;
            setSelectedId(fallback);
            if (fallback) localStorage.setItem(SELECTED_KEY, fallback);
            else localStorage.removeItem(SELECTED_KEY);
        }
    };


    const updateSection = (sectionKey, data) => {
        if (!selectedId) return;
        const next = projects.map((p) =>
            p.id !== selectedId
                ? p
                : { ...p, sections: { ...(p.sections || {}), [sectionKey]: data } }
        );
        setProjects(next);
        persistProjects(next);
    };
    const value = {
        projects,
        selected,
        selectedId,
        setSelectedId: (id) => selectProject(id),
        selectProject,
        addProject,
        updateSection,
        deleteProject,     // hub-only delete
        refresh,
    };

    return (
        <ProjectHubContext.Provider value={value}>
            {children}
        </ProjectHubContext.Provider>
    );
}
