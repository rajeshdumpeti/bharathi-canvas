import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthProvider';

function initialsFrom(name = '') {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function ProfileAvatar() {
    const { user } = useAuth();

    if (!user) {
        return (
            <Link
                to="/signin"
                className="px-3 py-1.5 rounded-md text-sm bg-white/10 text-white hover:bg-white/20"
            >
                Sign in
            </Link>
        );
    }

    return (
        <div
            className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/20 text-white font-semibold"
            title={user.name || 'Profile'}
            aria-label="Profile"
        >
            {initialsFrom(user.name)}
        </div>
    );
}
