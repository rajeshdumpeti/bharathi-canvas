// src/components/ui/inputs/TextArea.tsx
import React from "react";
import clsx from "clsx";

interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  label?: string;
  error?: string;
  size?: "sm" | "md" | "lg";
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, size = "md", className, ...rest }, ref) => {
    const sizeClasses =
      size === "sm"
        ? "px-2 py-1 text-sm"
        : size === "lg"
          ? "px-4 py-2 text-base"
          : "px-3 py-2";

    return (
      <div>
        {label && (
          <label className="block text-sm text-gray-600 mb-1">{label}</label>
        )}
        <textarea
          ref={ref}
          className={clsx(
            "w-full rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 transition resize-none",
            sizeClasses,
            error && "border-red-500 focus:ring-red-100",
            className
          )}
          {...rest}
        />
        {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);
TextArea.displayName = "TextArea";
