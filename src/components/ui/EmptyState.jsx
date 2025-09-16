import React from 'react';

export default function EmptyState({
    title,
    description,          // string or JSX
    bullets = [],          // array of strings or JSX
    containerClass = 'max-w-2xl', // override width if needed
    className = '',
    children,              // optional extra content (buttons, tips…)
}) {
    return (
        <div className={`mx-auto ${containerClass} px-6 py-12 ${className}`}>
            <div className="rounded-xl border bg-white p-8 shadow-sm">
                {title && <h2 className="text-2xl font-semibold mb-3">{title}</h2>}
                {description && (
                    <div className="text-gray-600 mb-4">
                        {description}
                    </div>
                )}
                {bullets.length > 0 && (
                    <ul className="space-y-2 list-disc pl-6 text-gray-700">
                        {bullets.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                )}
                {children}
            </div>
        </div>
    );
}
