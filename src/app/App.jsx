import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import AppShell from './shell/AppShell';
import LandingPage from '../features/landing/LandingPage';
import BoardView from '../features/board/BoardView';
import DocumentsView from '../features/documents/DocumentsView';
import ReleaseNotesView from '../features/release-notes/ReleaseNotesView';
import ProjectHubView from '../features/projectHub/ProjectHubView';
import SearchProvider from '../lib/search/SearchProvider';
import { ProjectHubProvider } from '../features/projectHub/context';

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
    );
}
