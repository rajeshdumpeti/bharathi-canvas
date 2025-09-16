import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthProvider';

export default function SignIn() {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();
        // demo: accept anything and mark user “signed in”
        signIn({ name: email.split('@')[0] || 'User', email });
        navigate('/'); // back to landing
    };

    return (
        <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
                <h1 className="text-2xl font-semibold mb-6 text-gray-900">Sign in</h1>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Email</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="you@example.com"
                            required
                            className="w-full rounded border px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Password</label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="••••••••"
                            required
                            className="w-full rounded border px-3 py-2"
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <Link to="#" onClick={(e) => { e.preventDefault(); alert('Forgot password flow not wired yet.'); }} className="text-blue-600 hover:underline">
                            Forgot password?
                        </Link>
                        <Link to="/register" className="text-gray-600 hover:underline">Create account</Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded bg-blue-600 text-white px-4 py-2 font-semibold hover:bg-blue-700"
                    >
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    );
}
