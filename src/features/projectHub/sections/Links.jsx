import React from 'react';
import MarkdownSectionBase from './MarkdownSectionBase';

export default function Links() {
    return (
        <MarkdownSectionBase
            sectionKey="links"
            placeholder={`Important links: repos, dashboards, builds, environments…`}
        />
    );
}
