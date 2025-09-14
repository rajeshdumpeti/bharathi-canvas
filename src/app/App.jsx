import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AppShell from './shell/AppShell';
import SearchProvider from '../lib/search/SearchProvider';
import { ProjectHubProvider } from '../features/projectHub/context';

const LandingPage = lazy(() => import('../features/landing/LandingPage'));
const BoardView = lazy(() => import('../features/board/BoardView'));
const DocumentsView = lazy(() => import('../features/documents/DocumentsView'));
const ReleaseNotesView = lazy(() => import('../features/release-notes/ReleaseNotesView'));
const ProjectHubView = lazy(() => import('../features/projectHub/ProjectHubView'));


// Small wrapper so we can pass working navigation callbacks to LandingPage
function LandingRoute() {
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
        <Suspense fallback={<div className="p-6 text-gray-600">Loading…</div>}>
            <SearchProvider>
                <Routes>
                    {/* Layout wrapper */}
                    <Route element={<AppShell />}>
                        <Route path="/" element={<LandingRoute />} />
                        <Route path="/board" element={<BoardView />} />
                        <Route path="/documents" element={<DocumentsView />} />
                        <Route path="/release-notes" element={<ReleaseNotesView />} />
                        <Route
                            path="/project-hub"
                            element={
                                <ProjectHubProvider>
                                    <ProjectHubView />
                                </ProjectHubProvider>
                            }
                        />
                    </Route>

                    {/* safety net */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </SearchProvider>
        </Suspense>
    );
}
