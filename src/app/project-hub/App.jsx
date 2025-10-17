import React from 'react';
import { Routes, Route } from "react-router-dom";
import ProjectHubView from 'features/projectHub/ProjectHubView';

export default function ProjectHubApp() {
    return (
        <Routes>
            {/* Always render DocumentsView; it now reads ?project= from URL */}
            <Route index element={<ProjectHubView />} />
        </Routes>
    );
}


