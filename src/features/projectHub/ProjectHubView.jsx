import React, { useState } from 'react';
import Header from '../../layout/Header';
import HubSidebar from './components/HubSidebar';
import { ProjectHubProvider } from './context';
import SectionHeader from './components/SectionHeader';
import Setup from './sections/Setup';
import Architecture from './sections/Architecture';
import Database from './sections/Database';
import UX from './sections/UX';
import Documents from './sections/Documents';
import Links from './sections/Links';
import Issues from './sections/Issues';
import POCs from './sections/POCs';
import Screenshots from './sections/Screenshots';
import Revenue from './sections/Revenue';
import Value from './sections/Value';
import Maintenance from './sections/Maintenance';
import Demand from './sections/Demand';
import TechRequirements from './sections/TechRequirements';
import Deployment from './sections/Deployment';
import Releases from './sections/Releases';

const SECTIONS = [
    { key: 'setup', title: 'Setup', comp: Setup },
    { key: 'architecture', title: 'Architecture', comp: Architecture },
    { key: 'database', title: 'Database', comp: Database },
    { key: 'ux', title: 'UX', comp: UX },
    { key: 'documents', title: 'Documents', comp: Documents },
    { key: 'links', title: 'Links', comp: Links },
    { key: 'issues', title: 'Issues faced', comp: Issues },
    { key: 'pocs', title: 'Proof of concepts', comp: POCs },
    { key: 'screenshots', title: 'Screenshots', comp: Screenshots },
    { key: 'revenue', title: 'Revenue', comp: Revenue },
    { key: 'value', title: 'Immediate value', comp: Value },
    { key: 'maintenance', title: 'Maintenance', comp: Maintenance },
    { key: 'demand', title: 'Demand', comp: Demand },
    { key: 'tech', title: 'Tech Requirements', comp: TechRequirements },
    { key: 'deployment', title: 'Deployment guide', comp: Deployment },
    { key: 'releases', title: 'Releases', comp: Releases },
];

export default function ProjectHubView() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeKey, setActiveKey] = useState(SECTIONS[0].key);
    const ActiveComp = SECTIONS.find(s => s.key === activeKey)?.comp ?? Setup;

    return (
        <ProjectHubProvider>
            <div className="h-screen w-full flex flex-col bg-gray-50">
                {/* Fixed header */}
                <div className="w-full bg-gray-900">
                    <Header
                        onToggleSidebar={() => setIsSidebarOpen(s => !s)}
                        showHamburger={true}
                        showTitle={true}
                        rightSlot={
                            <a href="#/" className="text-sm text-white/80 hover:text-white">Home</a>
                        }
                    />
                </div>

                {/* Main scroll area */}
                <div className="flex-1 min-h-0 w-full">
                    <div className="relative h-full w-full flex overflow-hidden">
                        {/* Backdrop (mobile) */}
                        <div
                            onClick={() => setIsSidebarOpen(false)}
                            className={`lg:hidden fixed inset-0 z-20 bg-black/40 transition-opacity duration-300
                ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                        />

                        {/* Sidebar */}
                        <aside
                            className={`
                fixed lg:static inset-y-0 left-0 z-30 w-72 bg-gray-900 text-white
                transform transition-transform duration-300 ease-in-out
                border-r border-gray-800 overflow-y-auto shrink-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:transform-none
              `}
                        >
                            <div className="h-full p-4">
                                <HubSidebar
                                    sections={SECTIONS}
                                    activeKey={activeKey}
                                    onSelect={(key) => { setActiveKey(key); setIsSidebarOpen(false); }}
                                />
                            </div>
                        </aside>

                        {/* Right pane */}
                        <main className="flex-1 min-w-0 h-full overflow-auto">
                            <div className="mx-auto w-full max-w-6xl px-6 py-6">
                                <SectionHeader title={SECTIONS.find(s => s.key === activeKey)?.title || 'Section'} />
                                <div className="mt-4">
                                    <ActiveComp />
                                </div>
                            </div>
                        </main>
                    </div>
                </div>

                {/* Fixed footer */}
                <footer className="h-10 flex items-center justify-center text-xs text-gray-500 bg-white border-t">
                    © {new Date().getFullYear()} Bharathi’s Canvas
                </footer>
            </div>
        </ProjectHubProvider>
    );
}
