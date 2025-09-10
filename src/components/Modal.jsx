import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg border border-gray-200 relative overflow-hidden"> {/* Increased max-w-lg and added overflow-hidden */}
                <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
                <div className="text-gray-700 mb-6 overflow-y-auto max-h-[calc(100vh-150px)] pr-2"> {/* Added scroll and max-height */}
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;