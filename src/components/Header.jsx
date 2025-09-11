import React from 'react';
import companyImage from '../assests/image.png'; // keep your existing path

const Header = ({ onToggleSidebar, showHamburger, showTitle, userInitials = "BC", }) => {
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
                    <div className="flex items-center space-x-3">
                        <img
                            src={companyImage}
                            alt="Bharathi's Canvas Logo"
                            className="h-10 w-auto object-contain"
                        />
                    </div>
                )}
            </div>

            <div className="flex items-center gap-6">
                <button
                    className="hidden md:inline text-gray-300 hover:text-white transition-colors"
                >
                    Docs
                </button>
            </div>

        </header >
    );
};

export default Header;
