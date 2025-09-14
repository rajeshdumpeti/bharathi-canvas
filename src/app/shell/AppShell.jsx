import React, { useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';

import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import CommandPalette from '../../components/ui/CommandPalette';
import { useSearch } from '../../lib/search/SearchProvider';

const KEYS = {
    BOARD: { PROJECTS: 'projects', TASKS: 'tasks', SELECTED: 'selectedProjectId' },
    DOCS: { ITEMS: 'docs:items', SELECTED: 'docs:selectedId' },
    HUB: { PROJECTS: 'hub:projects', SELECTED: 'hub:selectedProjectId', ACTIVE: 'hub:activeSection' },
};

function TopBar() {
    const loc = useLocation();
    const { open } = useSearch();

    const simple = (href, label) => (
        <Link
            to={href}
            className={`px-3 py-1.5 rounded-md text-sm ${loc.pathname.startsWith(href) ? 'bg-white/10 text-white' : 'text-white/80 hover:text-white'
                }`}
        >
            {label}
        </Link>
    );

    return (
        <div className="w-full bg-gray-900">
            <Header
                showHamburger={false}
                showTitle={true}
                open={open}
                rightSlot={
                    <nav className="flex items-center gap-2">

                        {simple('/', 'Home')}
                        {simple('/board', 'Board')}
                        {simple('/documents', 'Documents')}
                        {simple('/release-notes', 'Release Notes')}
                        {simple('/project-hub', 'Project Hub')}
                    </nav>
                }
            />
        </div>
    );
}

export default function AppShell() {
    const navigate = useNavigate();
    const { registerSource } = useSearch();

    useEffect(() => {
        // Board source: projects + tasks
        const unBoard = registerSource('board', 'Board', (q, { safeGet }) => {
            const ql = (q || '').toLowerCase();

            // normalize possible legacy shapes in localStorage
            const projectsRaw = safeGet(KEYS.BOARD.PROJECTS, []);
            const projects = Array.isArray(projectsRaw)
                ? projectsRaw
                : Array.isArray(projectsRaw?.projects)
                    ? projectsRaw.projects
                    : [];

            const tasksRaw = safeGet(KEYS.BOARD.TASKS, []);
            const tasks = Array.isArray(tasksRaw)
                ? tasksRaw
                : Array.isArray(tasksRaw?.tasks)
                    ? tasksRaw.tasks
                    : [];

            const projItems = projects
                .filter((p) => {
                    const name = (p?.name ?? '').toString();
                    return !ql || name.toLowerCase().includes(ql);
                })
                .slice(0, 10)
                .map((p) => ({
                    id: `board:project:${p.id}`,
                    title: (p?.name ?? 'Untitled').toString(),
                    subtitle: 'Project',
                    action: () => {
                        if (p?.id) localStorage.setItem(KEYS.BOARD.SELECTED, p.id);
                        navigate('/board');
                    },
                }));

            const taskItems = tasks
                .filter((t) => {
                    if (!ql) return false; // only show tasks when searching
                    const hay = `${t?.title ?? ''} ${t?.description ?? ''}`.toLowerCase();
                    return hay.includes(ql);
                })
                .slice(0, 15)
                .map((t) => ({
                    id: `board:task:${t.id}`,
                    title: (t?.title ?? 'Untitled').toString(),
                    subtitle: 'Task',
                    action: () => navigate('/board'),
                }));

            return [...projItems, ...taskItems];
        });

        // Documents source: files by name
        const unDocs = registerSource('docs', 'Documents', (q, { safeGet }) => {
            const ql = (q || '').toLowerCase();
            const docsRaw = safeGet(KEYS.DOCS.ITEMS, []);
            const docs = Array.isArray(docsRaw)
                ? docsRaw
                : Array.isArray(docsRaw?.items)
                    ? docsRaw.items
                    : [];

            return docs
                .filter((d) => !ql || ((d?.name ?? '').toLowerCase().includes(ql)))
                .slice(0, 20)
                .map((d) => ({
                    id: `docs:file:${d.id || d.name}`,
                    title: d?.name ?? 'Untitled',
                    subtitle: (d?.type ?? 'Document').toString().toUpperCase(),
                    action: () => {
                        if (d?.id) localStorage.setItem(KEYS.DOCS.SELECTED, d.id);
                        navigate('/documents');
                    },
                }));
        });

        // Project Hub source: projects + fuzzy section hit
        const unHub = registerSource('hub', 'Project Hub', (q, { safeGet }) => {
            const ql = (q || '').toLowerCase();
            const hubRaw = safeGet(KEYS.HUB.PROJECTS, []);
            const hubProjects = Array.isArray(hubRaw)
                ? hubRaw
                : Array.isArray(hubRaw?.projects)
                    ? hubRaw.projects
                    : [];

            const projectItems = hubProjects
                .filter((p) => !ql || ((p?.name ?? '').toLowerCase().includes(ql)))
                .slice(0, 10)
                .map((p) => ({
                    id: `hub:project:${p.id}`,
                    title: p?.name ?? 'Untitled',
                    subtitle: 'Hub Project',
                    action: () => {
                        if (p?.id) localStorage.setItem(KEYS.HUB.SELECTED, p.id);
                        navigate('/project-hub');
                    },
                }));

            const sectionItems = [];
            if (ql) {
                hubProjects.forEach((p) => {
                    const sections = Object.keys(p?.sections || {});
                    sections.forEach((k) => {
                        const data = JSON.stringify(p.sections[k] || {}).toLowerCase();
                        if (data.includes(ql)) {
                            sectionItems.push({
                                id: `hub:section:${p.id}:${k}`,
                                title: `${p?.name ?? 'Project'} — ${k}`,
                                subtitle: 'Hub Section',
                                action: () => {
                                    if (p?.id) localStorage.setItem(KEYS.HUB.SELECTED, p.id);
                                    localStorage.setItem(KEYS.HUB.ACTIVE, k);
                                    navigate('/project-hub');
                                },
                            });
                        }
                    });
                });
            }

            return [...projectItems, ...sectionItems].slice(0, 20);
        });

        return () => {
            unBoard();
            unDocs();
            unHub();
        };
    }, [navigate, registerSource]);

    return (
        <div className="h-screen w-full flex flex-col bg-gray-50">
            <TopBar />
            <main className="flex-1 min-h-0 overflow-auto">
                <Outlet />
            </main>
            <Footer />
            <CommandPalette />
        </div>
    );
}
