import React from 'react';
import MarkdownSectionBase from './MarkdownSectionBase';

export default function Architecture() {
    return (
        <MarkdownSectionBase
            sectionKey="architecture"
            placeholder={`High-level diagram, services, data flow, boundaries, decisions…`}
        />
    );
}
