import React, { useEffect, useMemo, useState } from 'react';
import Footer from '../../layout/Footer';
import useLocalStorage from '../../hooks/useLocalStorage';

import FiltersPanel from './components/FiltersPanel';
import PreviewPanel from './components/PreviewPanel';
import { tasksToMarkdown, classifyTask, suggestNextVersion } from '../../utils/releaseNotes';

const LS_PROJECTS = 'board:projects';
const LS_TASKS = 'tasks';
const LS_RELEASES = 'releases';
const LS_SELECTED_PROJECT = 'selectedProjectId';

function todayISO() {
    return new Date().toISOString().slice(0, 10);
}
function daysAgoISO(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10);
}

// imports...


// imports...

const ReleaseEmptyState = () => (
    <div className="mx-auto max-w-3xl px-6 py-12">
        <div className='rounded-xl border bg-white p-8 shadow-sm'>
            <h2 className="text-2xl font-semibold mb-3">Create your first release</h2>
            <p className="mb-4">
                Use the <span className="font-medium">Project</span> picker on the left to choose a project.
                Then set a date range and click <span className="font-medium">Generate</span>.
                We’ll create editable Markdown and show a live preview here.
            </p>
            <ul className="space-y-2 list-disc pl-6">
                <li>Group items by Feature / Fix / Chore, etc.</li>
                <li>Edit Markdown, copy it, or download as <code>.md</code>.</li>
                <li>Click “Save Release” to store it locally for later.</li>
            </ul></div>

    </div>
);


const ReleaseNotesView = () => {
    const [projects] = useLocalStorage(LS_PROJECTS, []);
    const [tasks] = useLocalStorage(LS_TASKS, []);
    const [releases, setReleases] = useLocalStorage(LS_RELEASES, []);

    const [selectedProjectId, setSelectedProjectId] = useLocalStorage(LS_SELECTED_PROJECT, '');
    const [fromDate, setFromDate] = useState(daysAgoISO(14));
    const [toDate, setToDate] = useState(todayISO());
    const [grouping, setGrouping] = useState('type');

    const [generatedTasks, setGeneratedTasks] = useState([]);
    const [notesMd, setNotesMd] = useState('');
    const [version, setVersion] = useState('v0.1.0');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Pick last saved release for this project to suggest next version / default "from"
    useEffect(() => {
        if (!selectedProjectId) return;
        const history = releases.filter((r) => r.projectId === selectedProjectId);
        if (history.length > 0) {
            const last = history[history.length - 1];
            const hasFeature = (last.tasks || [])
                .map((id) => tasks.find((t) => t.id === id))
                .filter(Boolean)
                .some((t) => classifyTask(t) === 'Features');
            setVersion(suggestNextVersion(last.version, hasFeature));
            setFromDate(last.range?.to?.slice(0, 10) || daysAgoISO(14));
        } else {
            setVersion('v0.1.0');
            setFromDate(daysAgoISO(14));
        }
        setToDate(todayISO());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProjectId]);

    const projectTasks = useMemo(() => {
        if (!selectedProjectId) return [];
        return tasks.filter((t) => t.project === selectedProjectId);
    }, [tasks, selectedProjectId]);

    const completedInRange = useMemo(() => {
        const from = new Date(fromDate + 'T00:00:00');
        const to = new Date(toDate + 'T23:59:59');
        return projectTasks.filter((t) => {
            if (t.status !== 'done') return false;
            const completed = t.completedAt ? new Date(t.completedAt) : null;
            if (!completed) return false;
            return completed >= from && completed <= to;
        });
    }, [projectTasks, fromDate, toDate]);

    const onGenerate = () => {
        setGeneratedTasks(completedInRange);
        const md = tasksToMarkdown({
            version,
            date: new Date().toISOString().slice(0, 10),
            tasks: completedInRange,
            groupBy: grouping,
        });
        setNotesMd(md);
    };

    const onCopy = async () => {
        try {
            await navigator.clipboard.writeText(notesMd || '');
        } catch (e) {
            console.warn('Clipboard failed, offering fallback download', e);
            onDownload(); // fallback
        }
    };

    const onDownload = () => {
        const blob = new Blob([notesMd || ''], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const safe = (version || 'release-notes').replace(/[^\w.-]+/g, '_');
        a.download = `${safe}.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const onSave = () => {
        if (!selectedProjectId) return;
        const rec = {
            id: `${Date.now()}`,
            projectId: selectedProjectId,
            version: version || 'v0.0.0',
            date: new Date().toISOString(),
            range: { from: fromDate, to: toDate },
            filters: {}, // extend later if you add labels/assignee
            grouping,
            notesMd: notesMd || '',
            tasks: generatedTasks.map((t) => t.id),
        };
        const next = [...releases, rec];
        setReleases(next);
    };

    const loadRelease = (r) => {
        setSelectedProjectId(r.projectId);
        setVersion(r.version);
        setFromDate(r.range?.from?.slice(0, 10) || daysAgoISO(14));
        setToDate(r.range?.to?.slice(0, 10) || todayISO());
        setNotesMd(r.notesMd || '');
    };

    return (
        <div className="h-screen w-full flex flex-col bg-gray-50">
            <div className="flex-1 min-h-0 w-full">
                <div className="relative h-full w-full flex overflow-hidden">
                    <div
                        onClick={() => setIsSidebarOpen(false)}
                        className={`lg:hidden fixed inset-0 z-20 bg-black/40 transition-opacity duration-300
                ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    />
                    {/* Left filters */}
                    <aside className={`
                fixed lg:static inset-y-0 left-0 z-30 w-72 bg-gray-900 text-white
                transform transition-transform duration-300 ease-in-out
                border-r border-gray-800 overflow-y-auto shrink-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:transform-none
              `}>
                        <FiltersPanel
                            projects={projects}
                            selectedProjectId={selectedProjectId}
                            onSelectProject={setSelectedProjectId}
                            fromDate={fromDate}
                            toDate={toDate}
                            onChangeFrom={setFromDate}
                            onChangeTo={setToDate}
                            grouping={grouping}
                            onChangeGrouping={setGrouping}
                            onGenerate={onGenerate}
                            releases={releases.filter((r) => r.projectId === selectedProjectId)}
                            onLoadRelease={loadRelease}
                        />
                    </aside>

                    {/* Right preview */}
                    {!selectedProjectId ? (
                        ReleaseEmptyState()
                    ) :
                        <main className="flex-1 min-w-0 h-full overflow-auto">
                            <PreviewPanel
                                version={version}
                                setVersion={setVersion}
                                notesMd={notesMd}
                                setNotesMd={setNotesMd}
                                onCopy={onCopy}
                                onDownload={onDownload}
                                onSave={onSave}
                            />

                            {/* Helpful tip when no project selected */}

                        </main>}

                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ReleaseNotesView;
