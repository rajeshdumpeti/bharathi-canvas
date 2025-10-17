// src/components/ui/inputs/Checkbox.tsx
import React from "react";
import clsx from "clsx";

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  size?: "sm" | "md" | "lg";
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, size = "md", className, ...rest }, ref) => {
    const sizeClasses =
      size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4";

    return (
      <div className="flex flex-col">
        <label className="inline-flex items-center gap-2">
          <input
            ref={ref}
            type="checkbox"
            className={clsx(
              "rounded border-gray-300 text-blue-600 focus:ring-blue-500",
              sizeClasses,
              className
            )}
            {...rest}
          />
          {label && <span className="text-sm text-gray-700">{label}</span>}
        </label>
        {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";
