import React, { InputHTMLAttributes, ChangeEvent } from "react";

interface TextFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "size"
  > {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  size?: "sm" | "md" | "lg"; // ✅ Added size support
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  value = "",
  onChange,
  className = "",
  size = "md",
  ...rest
}) => {
  const sizeClasses =
    size === "sm"
      ? "px-2 py-1 text-sm"
      : size === "lg"
        ? "px-4 py-3 text-base"
        : "px-3 py-2";

  return (
    <div className={`flex flex-col ${className}`}>
      {label && <label className="text-sm text-gray-600 mb-1">{label}</label>}
      <input
        {...rest}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChange?.(e.target.value)
        }
        className={`border rounded-md ${sizeClasses} focus:ring-2 focus:ring-blue-500 focus:outline-none`}
      />
    </div>
  );
};
