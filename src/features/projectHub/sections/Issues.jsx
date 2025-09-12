import React from 'react';
import MarkdownSectionBase from './MarkdownSectionBase';

export default function Issues() {
    return (
        <MarkdownSectionBase
            sectionKey="issues"
            placeholder={`List blockers, risks, mitigations, lessons learned…`}
        />
    );
}
