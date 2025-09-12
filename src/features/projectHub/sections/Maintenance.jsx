import React from 'react';
import MarkdownSectionBase from './MarkdownSectionBase';

export default function Maintenance() {
    return (
        <MarkdownSectionBase
            sectionKey="maintenance"
            placeholder={`Oncall, SLAs, runbooks, monitoring, alerting, upgrade paths…`}
        />
    );
}
