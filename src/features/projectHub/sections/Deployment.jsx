import React from 'react';
import MarkdownSectionBase from './MarkdownSectionBase';

export default function Deployment() {
    return (
        <MarkdownSectionBase
            sectionKey="deployment"
            placeholder={`Environments, CI/CD, secrets, rollouts, backouts, smoke checks…`}
        />
    );
}
