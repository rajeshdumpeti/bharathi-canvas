import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AppShell from '../app/shell/AppShell';
import SearchProvider from '../lib/search/SearchProvider';
import StoriesView from '../features/board/StoriesView';

// Lazy app entrypoints (one chunk per app)
const BoardApp = lazy(() => import('../app/board/App'));
const DocumentsApp = lazy(() => import('../app/documents/App'));
const ReleaseNotesApp = lazy(() => import('../app/release-notes/App'));
const ProjectHubApp = lazy(() => import('../app/project-hub/App'));
const LandingPage = lazy(() => import('../features/landing/LandingPage'));

// tiny wrapper to keep your LandingPage callbacks working
function LandingWithNav() {
    const navigate = useNavigate();
    return (
        <LandingPage
            onStart={() => navigate('/board')}
            onStartDocs={() => navigate('/documents')}
            onOpenReleaseNotes={() => navigate('/release-notes')}
            onOpenProjectHub={() => navigate('/project-hub')}
        />
    );
}

export default function App() {
    return (
        <Suspense fallback={<div className="p-6">Loading…</div>}>
            <SearchProvider>
                <Routes>
                    {/* Shell layout (TopBar + Outlet + Footer) */}
                    <Route element={<AppShell />}>
                        <Route index element={<LandingWithNav />} />
                        <Route path="board" element={<BoardApp />} />
                        <Route path="/board/stories" element={<StoriesView />} />
                        <Route path="documents" element={<DocumentsApp />} />
                        <Route path="release-notes" element={<ReleaseNotesApp />} />
                        <Route path="project-hub" element={<ProjectHubApp />} />
                    </Route>

                    {/* safety net */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </SearchProvider>
        </Suspense>
    );
}
