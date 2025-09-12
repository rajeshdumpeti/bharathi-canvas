import React, { useState } from 'react';
import IconButton from './IconButton';

export default function SecretText({ children, className }) {
    const [show, setShow] = useState(false);
    return (
        <span className={`inline-flex items-center gap-2 ${className || ''}`}>
            <span className="font-mono">{show ? children : '••••••••'}</span>
            <IconButton
                variant="ghost"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? 'Hide' : 'Show'}
            >
                {show ? 'Hide' : 'Show'}
            </IconButton>
        </span>
    );
}
