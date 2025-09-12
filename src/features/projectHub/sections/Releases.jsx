import React from 'react';
import MarkdownSectionBase from './MarkdownSectionBase';

export default function Releases() {
    return (
        <MarkdownSectionBase
            sectionKey="releases"
            placeholder={`Released versions, links to release notes, known issues…`}
        />
    );
}
