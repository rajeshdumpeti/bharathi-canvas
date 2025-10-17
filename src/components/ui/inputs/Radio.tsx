// src/components/ui/inputs/Radio.tsx
import React from "react";
import clsx from "clsx";

interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  size?: "sm" | "md" | "lg";
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error, size = "md", className, ...rest }, ref) => {
    const sizeClasses =
      size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4";

    return (
      <div className="flex flex-col">
        <label className="inline-flex items-center gap-2">
          <input
            ref={ref}
            type="radio"
            className={clsx(
              "text-blue-600 focus:ring-blue-500",
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
Radio.displayName = "Radio";
