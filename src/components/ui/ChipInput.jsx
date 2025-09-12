import React, { useState } from 'react';
import clsx from 'clsx';

export default function ChipInput({
    value = [],
    onChange,
    placeholder = 'Add item and press Enter',
    className,
}) {
    const [text, setText] = useState('');

    const add = () => {
        const v = text.trim();
        if (!v) return;
        if (!value.includes(v)) onChange?.([...value, v]);
        setText('');
    };

    const remove = (token) => onChange?.(value.filter((t) => t !== token));

    return (
        <div className={clsx('w-full', className)}>
            <div className="flex flex-wrap gap-2 mb-2">
                {value.map((t) => (
                    <span
                        key={t}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs"
                    >
                        {t}
                        <button
                            type="button"
                            onClick={() => remove(t)}
                            className="hover:text-blue-900"
                            aria-label={`Remove ${t}`}
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        add();
                    }
                }}
                placeholder={placeholder}
                className="w-full rounded border px-3 py-2"
            />
        </div>
    );
}
