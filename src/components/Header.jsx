import React from 'react';

const Header = ({ onToggleSidebar, showHamburger, showTitle }) => {
    return (
        <header className="bg-gray-900 text-white p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center">
                {showHamburger && (
                    <button onClick={onToggleSidebar} className="p-2 mr-4 rounded-lg hover:bg-gray-700 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                )}
                {showTitle && (
                    <div className="flex items-center">
                        <svg className="h-8 w-8 mr-2 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <line x1="10" y1="9" x2="8" y2="9" />
                        </svg>
                        <h1 className="text-2xl font-bold">Bharathi's Canvas</h1>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;