// src/components/ui/layout/Modal.tsx
import React, { useEffect } from "react";
import clsx from "clsx";

interface ModalProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export const Modal: React.FC<ModalProps> = ({
  open,
  title,
  onClose,
  children,
  size = "md",
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  const sizeClasses =
    size === "sm" ? "max-w-sm" : size === "lg" ? "max-w-4xl" : "max-w-xl";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={clsx(
          "bg-white w-full rounded-lg shadow-lg p-6 relative mx-4",
          sizeClasses
        )}
        role="dialog"
      >
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};
