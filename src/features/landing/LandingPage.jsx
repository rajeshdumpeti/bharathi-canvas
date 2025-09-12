import React from "react";
import Header from "../../layout/Header";
import { Link } from "react-router-dom";

const LandingPage = ({ onStart, onStartDocs }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
            <div className="w-full bg-gray-900">
                <Header
                    onToggleSidebar={() => { }}
                    showHamburger={false}
                    showTitle={true}
                />
            </div>
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
                            onClick={onStart}
                            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
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
                            onClick={onStartDocs}
                            className="w-full px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 transition-colors"
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
                        <Link
                            to="/release-notes"
                            className="block w-full text-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                        >
                            Open Release Notes
                        </Link>
                    </div>
                    <div className="p-8 bg-white rounded-xl shadow-xl transform hover:scale-[1.01] transition-transform duration-300">
                        <h2 className="text-2xl font-semibold mb-4">Project Hub</h2>
                        <p className="text-sm text-gray-500 mb-6">Specs, architecture, APIs, links & more—organized per project.</p>
                        <Link
                            to="/hub"
                            className="block w-full text-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                        >
                            Open Project Hub
                        </Link>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
