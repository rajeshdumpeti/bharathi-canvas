import React from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthProvider';

export default function LandingPage({
    onStart,
    onStartDocs,
    onOpenReleaseNotes,
    onOpenProjectHub
}) {
    const navigate = useNavigate();
    const { user } = useAuth();

    const go = (path) => {
        if (!user) navigate('/signin');
        else navigate(path);
    };
    return (
        <div className="bg-gray-50 flex flex-col items-center justify-center">
            <div className="flex flex-1 flex-col p-4 text-center">
                <h1 className="text-5xl font-bold text-gray-900 mb-4 animate-fade-in-down">
                    Namaste!
                </h1>
                <p className="text-lg text-gray-600 mb-8 animate-fade-in-up">
                    Welcome to Bharathi's Canvas
                </p>
                {/* Cards row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                    {/* Personal Board */}
                    <div className="p-8 bg-white rounded-xl shadow-xl transform hover:scale-[1.01] transition-transform duration-300">
                        <h2 className="text-2xl font-semibold mb-2">Your Personal Board</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Create a Project Board for your personal use.
                        </p>
                        <button
                            type="button"
                            onClick={() => go('/board')}
                            className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3"
                        >
                            Get Started
                        </button>
                    </div>

                    {/* Personal Documents */}
                    <div className="p-8 bg-white rounded-xl shadow-xl transform hover:scale-[1.01] transition-transform duration-300">
                        <h2 className="text-2xl font-semibold mb-2">
                            Your Personal Documents
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Upload, organize and preview PDFs, DOCX, and TXT files.
                        </p>
                        <button
                            type="button"
                            onClick={() => go('/documents')}
                            className="w-full rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3"
                        >
                            Open Documents
                        </button>
                    </div>
                    <div className="p-8 bg-white rounded-xl shadow-xl transform hover:scale-[1.01] transition-transform duration-300">
                        <h2 className="text-2xl font-semibold mb-2">
                            Release Notes Builder
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Turn your Done tasks into clean, categorized release notes.
                        </p>
                        <button
                            type="button"
                            onClick={() => go('/release-notes')}
                            className="w-full rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3"
                        >
                            Open Release Notes
                        </button>
                    </div>
                    <div className="p-8 bg-white rounded-xl shadow-xl transform hover:scale-[1.01] transition-transform duration-300">
                        <h2 className="text-2xl font-semibold mb-4">Project Hub</h2>
                        <p className="text-sm text-gray-500 mb-6">Specs, architecture, APIs, links & more—organized per project.</p>
                        <button
                            type="button"
                            onClick={() => go('/project-hub')}
                            className="w-full rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3"
                        >
                            Open Project Hub
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

