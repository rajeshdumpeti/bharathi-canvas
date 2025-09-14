import React from 'react';
import ProjectHubView from '../../features/projectHub/ProjectHubView';
import { ProjectHubProvider } from '../../features/projectHub/context';

export default function ProjectHubApp() {
    return (
        <ProjectHubProvider>
            <ProjectHubView />
        </ProjectHubProvider>
    );
}
