import React from 'react';
import MarkdownSectionBase from './MarkdownSectionBase';

export default function TechRequirements() {
    return (
        <MarkdownSectionBase
            sectionKey="tech"
            placeholder={`Functional & non-functional requirements, SLOs, constraints…`}
        />
    );
}
