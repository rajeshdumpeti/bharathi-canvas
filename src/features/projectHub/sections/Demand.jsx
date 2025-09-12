import React from 'react';
import MarkdownSectionBase from './MarkdownSectionBase';

export default function Demand() {
    return (
        <MarkdownSectionBase
            sectionKey="demand"
            placeholder={`User demand, backlog, roadmap confidence, market signals…`}
        />
    );
}
