import React from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  /** Optional: close when clicking the scrim (default true) */
  closeOnBackdrop?: boolean;
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = "bg-white rounded-xl shadow-lg p-6",
  closeOnBackdrop = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={closeOnBackdrop ? onClose : undefined}
      />
      <div className="absolute left-1/2 top-20 -translate-x-1/2 w-full max-w-lg">
        <div
          className={`relative bg-white rounded-xl shadow-lg max-h-[90vh] md:max-h-[80vh] overflow-y-auto ${className}`}
          role="dialog"
          aria-modal
        >
          {title && (
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{title}</h3>
              <button
                aria-label="Close modal"
                onClick={onClose}
                className="rounded p-1 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
