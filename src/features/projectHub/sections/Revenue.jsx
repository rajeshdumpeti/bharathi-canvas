import React from 'react';
import MarkdownSectionBase from './MarkdownSectionBase';

export default function Revenue() {
    return (
        <MarkdownSectionBase
            sectionKey="revenue"
            placeholder={`Revenue projections, pricing, CAC/LTV notes…`}
        />
    );
}
