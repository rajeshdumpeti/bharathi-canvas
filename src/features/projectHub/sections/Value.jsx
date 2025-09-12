import React from 'react';
import MarkdownSectionBase from './MarkdownSectionBase';

export default function Value() {
    return (
        <MarkdownSectionBase
            sectionKey="value"
            placeholder={`Immediate value, success metrics, stakeholder impact…`}
        />
    );
}
