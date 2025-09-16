import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LS_KEY = 'auth:user';

const AuthCtx = createContext(undefined);

export function useAuth() {
    const ctx = useContext(AuthCtx);
    if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
    return ctx;
}

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // restore from localStorage (if you want “sticky” sign-in across refresh)
    useEffect(() => {
        try {
            const raw = localStorage.getItem(LS_KEY);
            if (raw) setUser(JSON.parse(raw));
        } catch { }
    }, []);

    const signIn = (payload) => {
        const u = {
            name: (payload?.name || '').trim() || 'User',
            email: (payload?.email || '').trim() || '',
        };
        setUser(u);
        localStorage.setItem(LS_KEY, JSON.stringify(u));
    };

    const signOut = () => {
        setUser(null);
        localStorage.removeItem(LS_KEY);
    };

    const value = useMemo(() => ({ user, signIn, signOut }), [user]);

    return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
