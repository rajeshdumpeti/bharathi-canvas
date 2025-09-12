import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

export const useProjectHubContext = () => useContext(ProjectHubContext)

// export default useProjectHub;
const STORAGE_KEY = 'projects';               // shared with Board
const SELECTED_KEY = 'hub:selectedProjectId'; // hub-only selection

const ProjectHubContext = createContext(undefined);

function loadProjects() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const list = raw ? JSON.parse(raw) : [];
        return Array.isArray(list) ? list : [];
    } catch {
        return [];
    }
}

function persistProjects(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
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

        // independent default Board columns so Board stays happy
        const defaults = [
            { id: 'to-do', title: 'To Do' },
            { id: 'in-progress', title: 'In Progress' },
            { id: 'done', title: 'Done' },
        ];

        const proj = {
            id,
            name: projectName,
            columns: defaults.slice(),
            sections: {}, // where Project Hub stores its section data
        };

        const next = [...projects, proj];
        setProjects(next);
        persistProjects(next);
        setSelectedId(id);
        return proj;
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
        selectProject,
        addProject,
        updateSection,
        refresh,
    };

    return (
        <ProjectHubContext.Provider value={value}>
            {children}
        </ProjectHubContext.Provider>
    );
}
