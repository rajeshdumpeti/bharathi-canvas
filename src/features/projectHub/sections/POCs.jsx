import React from 'react';
import MarkdownSectionBase from './MarkdownSectionBase';

export default function POCs() {
    return (
        <MarkdownSectionBase
            sectionKey="pocs"
            placeholder={`Proofs of concept: approach, outcomes, code pointers…`}
        />
    );
}
