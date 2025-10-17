import React from "react";
import clsx from "clsx";

interface AlertProps {
  type: "success" | "error" | "info" | "warning";
  message: string;
  onClose?: () => void;
  className?: string; // ✅ added to support external styling
}

export const Alert: React.FC<AlertProps> = ({
  type,
  message,
  onClose,
  className,
}) => {
  const baseStyles =
    "rounded-md p-3 flex items-center justify-between text-sm border";

  const typeStyles =
    type === "success"
      ? "bg-green-50 text-green-800 border-green-200"
      : type === "error"
        ? "bg-red-50 text-red-800 border-red-200"
        : type === "info"
          ? "bg-blue-50 text-blue-800 border-blue-200"
          : "bg-yellow-50 text-yellow-800 border-yellow-200";

  return (
    <div className={clsx(baseStyles, typeStyles, className)}>
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-3 text-xs text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
      )}
    </div>
  );
};
