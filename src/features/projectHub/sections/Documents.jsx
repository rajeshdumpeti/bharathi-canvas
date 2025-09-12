import React from 'react';
import MarkdownSectionBase from './MarkdownSectionBase';

export default function Documents() {
    return (
        <MarkdownSectionBase
            sectionKey="documents"
            placeholder={`Add links to specs, design docs, spreadsheets, etc. (Markdown links).`}
        />
    );
}
