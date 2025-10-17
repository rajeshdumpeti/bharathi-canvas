// src/components/ui/inputs/CheckboxGroup.tsx
import React from "react";
import { Checkbox } from "./Checkbox";

interface CheckboxOption {
  label: string;
  value: string;
}

interface CheckboxGroupProps {
  label?: string;
  options: CheckboxOption[];
  values: string[];
  onChange: (newValues: string[]) => void;
  error?: string;
  size?: "sm" | "md" | "lg";
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  options,
  values,
  onChange,
  error,
  size = "md",
}) => {
  const handleChange = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-sm text-gray-600 mb-1">{label}</label>
      )}
      <div className="space-y-1">
        {options.map((opt) => (
          <Checkbox
            key={opt.value}
            label={opt.label}
            checked={values.includes(opt.value)}
            onChange={() => handleChange(opt.value)}
            size={size}
          />
        ))}
      </div>
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
};
