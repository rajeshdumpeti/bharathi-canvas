import React from 'react';
import MarkdownSectionBase from './MarkdownSectionBase';

export default function Screenshots() {
    return (
        <MarkdownSectionBase
            sectionKey="screenshots"
            placeholder={`Paste image links or Markdown images to showcase UI & flows.`}
        />
    );
}
