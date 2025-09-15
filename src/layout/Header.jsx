import React from 'react';
import LogoMonogram from '../components/ui/LogoMonogram';
import LogoWordmark from '../components/ui/LogoWordmark';
import { Link } from 'react-router-dom';



const Header = ({ onToggleSidebar, showHamburger, showTitle, open }) => {
    return (
        <header className="text-white p-4 flex items-center justify-between shadow-xl border-b border-gray-800">
            <div className="flex items-center space-x-4">
                {showHamburger && (
                    <button
                        onClick={onToggleSidebar}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            ></path>
                        </svg>
                    </button>
                )}

                {showTitle && (
                    <Link to="/">
                        <div className="flex items-center gap-3">
                            {/* pick one: LogoMark or LogoMonogram */}
                            <LogoMonogram className="h-8 w-8 text-white" />
                            {/* Wordmark next to the icon */}
                            <LogoWordmark />
                        </div>
                    </Link>
                )}
            </div>
            <div className="flex items-center gap-6">
                <Link
                    to="/"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
                >
                    Home
                </Link>
            </div>

        </header >
    );
};

export default Header;
