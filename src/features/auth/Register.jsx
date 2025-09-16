import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthProvider';

export default function Register() {
    const navigate = useNavigate();
    const { signIn } = useAuth(); // after register, treat as signed-in for demo

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();
        const name = `${firstName} ${lastName}`.trim() || 'User';
        signIn({ name, email }); // demo
        navigate('/');
    };

    return (
        <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
                <h1 className="text-2xl font-semibold mb-6 text-gray-900">Create your account</h1>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">First name</label>
                            <input
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Ada"
                                required
                                className="w-full rounded border px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Last name</label>
                            <input
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Lovelace"
                                required
                                className="w-full rounded border px-3 py-2"
                            />
                        </div>
                    </div>
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

                    <button
                        type="submit"
                        className="w-full rounded bg-blue-600 text-white px-4 py-2 font-semibold hover:bg-blue-700"
                    >
                        Register
                    </button>

                    <p className="text-xs text-gray-500 mt-2">
                        Already have an account?{' '}
                        <Link to="/signin" className="text-blue-600 hover:underline">Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
