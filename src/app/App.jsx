import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import LandingPage from '../features/landing/LandingPage';
import BoardView from '../features/board/BoardView';
import DocumentsView from '../features/documents/DocumentsView'; // stub or your real view
import ReleaseNotesView from '../features/release-notes/ReleaseNotesView';
import ProjectHubView from '../features/projectHub/ProjectHubView';
import { ProjectHubProvider } from '../features/projectHub/context';

const App = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LandingPage
            onStart={() => navigate('/board')}
            onStartDocs={() => navigate('/documents')}
          />
        }
      />
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

      {/* safety net */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
