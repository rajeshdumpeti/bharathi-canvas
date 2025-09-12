import React from 'react';

export default function MarkdownEditor({ value, onChange, placeholder }) {
    return (
        <textarea
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-[220px] border rounded p-3 focus:outline-none"
        />
    );
}
