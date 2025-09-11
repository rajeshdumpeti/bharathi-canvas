import React from 'react';
import Header from '../../layout/Header';

const LandingPage = ({ onStart }) => {
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
                <h1 className="text-5xl font-bold text-gray-900 mb-4 animate-fade-in-down">Namaste!</h1>
                <p className="text-lg text-gray-600 mb-8 animate-fade-in-up">Welcome to Bharathi's Canvas</p>
                <div className="p-8 bg-white rounded-xl shadow-xl w-full max-w-sm transform hover:scale-105 transition-transform duration-300">
                    <h2 className="text-2xl font-semibold mb-4">Your Personal Board</h2>
                    <p className="text-sm text-gray-500 mb-6">Create a Project Board for your personal use.</p>
                    <button
                        onClick={onStart}
                        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
