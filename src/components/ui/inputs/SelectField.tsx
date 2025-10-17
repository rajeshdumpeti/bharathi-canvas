// src/components/ui/inputs/SelectField.tsx
import React from "react";
import clsx from "clsx";

type Option = string | { label: string; value: string };

interface SelectFieldProps
  extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    "size" | "onChange"
  > {
  label?: string;
  error?: string;
  size?: "sm" | "md" | "lg";
  options: Option[];
  onChange?:
    | ((value: string) => void)
    | React.ChangeEventHandler<HTMLSelectElement>;
}

export const SelectField = React.forwardRef<
  HTMLSelectElement,
  SelectFieldProps
>(
  (
    { label, error, size = "md", options, className, onChange, ...rest },
    ref
  ) => {
    const sizeClasses =
      size === "sm"
        ? "px-2 py-1 text-sm"
        : size === "lg"
          ? "px-4 py-2 text-base"
          : "px-3 py-2";

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (typeof onChange === "function") {
        try {
          (onChange as (value: string) => void)(e.target.value);
        } catch {
          (onChange as React.ChangeEventHandler<HTMLSelectElement>)(e);
        }
      }
    };

    const normalizeOptions = (opt: Option) =>
      typeof opt === "string" ? { label: opt, value: opt } : opt;

    return (
      <div>
        {label && (
          <label className="block text-sm text-gray-600 mb-1">{label}</label>
        )}
        <select
          ref={ref}
          onChange={handleChange}
          className={clsx(
            "w-full rounded border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 transition",
            sizeClasses,
            error && "border-red-500 focus:ring-red-100",
            className
          )}
          {...rest}
        >
          {options.map((opt) => {
            const { label, value } = normalizeOptions(opt);
            return (
              <option key={value} value={value}>
                {label}
              </option>
            );
          })}
        </select>
        {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

SelectField.displayName = "SelectField";
