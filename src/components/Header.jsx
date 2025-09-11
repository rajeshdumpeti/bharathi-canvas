import React from 'react';
import companyImage from '../assests/image.png';

const Header = ({ onToggleSidebar, showHamburger, showTitle }) => {
    return (
        <header className="text-white p-6 flex items-center justify-between shadow-xl border-b ">
            <div className="flex items-center space-x-4">
                {showHamburger && (
                    <button
                        onClick={onToggleSidebar}
                        className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            src={companyImage} // Replace the h1 text with this image
                            alt="Bharathi's Canvas Logo"
                            className="h-25 w-auto max-w-[200px] object-contain"
                        />
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;