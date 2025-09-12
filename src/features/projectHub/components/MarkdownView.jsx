import React from 'react';
import { marked } from 'marked';

// Force links to open in new tab
const renderer = new marked.Renderer();
renderer.link = (href, title, text) => {
    const t = title ? ` title="${title}"` : '';
    return `<a href="${href}"${t} target="_blank" rel="noopener noreferrer">${text}</a>`;
};
marked.setOptions({ breaks: true });

export default function MarkdownView({ text }) {
    const html = marked.parse(text || '', { renderer });
    return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
}
