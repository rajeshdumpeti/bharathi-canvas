import React from 'react';
import MarkdownSectionBase from './MarkdownSectionBase';

export default function Database() {
    return (
        <MarkdownSectionBase
            sectionKey="database"
            placeholder={`DB engine, schemas, key tables, migrations strategy, diagrams…`}
        />
    );
}
