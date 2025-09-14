import React, { useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import Header from '../../layout/Header';
import CommandPalette from '../../components/ui/CommandPalette';
import { useSearch } from '../../lib/search/SearchProvider';
import Footer from '../../layout/Footer';

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

    // Register sources once
    useEffect(() => {
        // Board: projects + tasks
        const unBoard = registerSource('board', 'Board', (q, { safeGet }) => {
            const ql = (q || '').toLowerCase();
            const projects = safeGet(KEYS.BOARD.PROJECTS, []);
            const tasks = safeGet(KEYS.BOARD.TASKS, []);
            const projItems = projects
                .filter(p => !q || (p.name || '').toLowerCase().includes(ql)
                )
                .slice(0, 10)
                .map(p => ({
                    id: `board:project:${p.id}`,
                    title: p?.name || 'Untitled',
                    subtitle: 'Project',
                    action: () => {
                        localStorage.setItem(KEYS.BOARD.SELECTED, p.id);
                        navigate('/board');
                    },
                }));
            const taskItems = tasks
                .filter(t => {
                    if (!q) return false; // only show tasks when searching
                    const hay = `${t.title} ${t.description || ''}`.toLowerCase();
                    return hay.includes(ql);
                })
                .slice(0, 15)
                .map(t => ({
                    id: `board:task:${t.id}`,
                    title: t?.title || 'Untitled task',
                    subtitle: 'Task',
                    action: () => navigate('/board'),
                }));
            return [...projItems, ...taskItems];
        });

        // Documents: file names
        const unDocs = registerSource('docs', 'Documents', (q, { safeGet }) => {
            const ql = (q || '').toLowerCase();
            const docs = safeGet(KEYS.DOCS.ITEMS, []);
            const items = docs
                .filter(d => !q || (d.name || '').toLowerCase().includes(ql))
                .slice(0, 20)
                .map(d => ({
                    id: `doc:${d.id || d.name}`,
                    title: d?.name || 'Untitled document',
                    subtitle: d?.type?.toUpperCase() || 'Document',
                    action: () => {
                        if (d.id) localStorage.setItem(KEYS.DOCS.SELECTED, d.id);
                        navigate('/documents');
                    },
                }));
            return items;
        });

        // Project Hub: projects and sections
        const unHub = registerSource('hub', 'Project Hub', (q, { safeGet }) => {
            const ql = (q || '').toLowerCase();
            const projects = safeGet(KEYS.HUB.PROJECTS, []);
            const projectItems = projects
                .filter(p => !q || (p.name || '').toLowerCase().includes(ql)
                )
                .slice(0, 10)
                .map(p => ({
                    id: `hub:project:${p.id}`,
                    title: p?.name || 'Untitled',
                    subtitle: 'Hub Project',
                    action: () => {
                        localStorage.setItem(KEYS.HUB.SELECTED, p.id);
                        navigate('/project-hub');
                    },
                }));
            const sectionItems = [];
            if (q) {
                projects.forEach(p => {
                    const sections = Object.keys(p.sections || {});
                    sections.forEach(k => {
                        // very simple include on serialized payload
                        const data = JSON.stringify(p.sections[k] || {}).toLowerCase();
                        if (data.includes(ql)) {
                            sectionItems.push({
                                id: `hub:section:${p.id}:${k}`,
                                title: `${p?.name || 'Project'} — ${k}`,
                                subtitle: 'Hub Section',
                                action: () => {
                                    localStorage.setItem(KEYS.HUB.SELECTED, p.id);
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

        return () => { unBoard(); unDocs(); unHub(); };
    }, [navigate, registerSource]);

    return (
        <div className="h-screen w-full flex flex-col bg-gray-50">
            <TopBar />
            <main className="flex-1 min-h-0 overflow-auto">
                <Outlet />
            </main>
            <Footer />

            {/* palette mounted once at shell level */}
            <CommandPalette />
        </div>
    );
}
