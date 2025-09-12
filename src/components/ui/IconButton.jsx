import React from 'react';
import clsx from 'clsx';

const styles = {
    base: 'inline-flex items-center justify-center rounded border text-xs font-medium transition-colors',
    size: {
        sm: 'px-2 py-1',
        md: 'px-3 py-2 text-sm',
    },
    variant: {
        neutral: 'border-gray-300 text-gray-700 hover:bg-gray-50',
        primary: 'border-transparent bg-blue-600 text-white hover:bg-blue-700',
        danger: 'border-transparent bg-red-600 text-white hover:bg-red-700',
        ghost: 'border-transparent text-gray-600 hover:bg-gray-100',
    },
};

export default function IconButton({
    children,
    className,
    size = 'sm',
    variant = 'neutral',
    ...props
}) {
    return (
        <button
            {...props}
            className={clsx(styles.base, styles.size[size], styles.variant[variant], className)}
        >
            {children}
        </button>
    );
}
