// src/components/ui/inputs/RadioGroup.tsx
import React from "react";
import { Radio } from "./Radio";

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  label?: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  options,
  value,
  onChange,
  error,
  name,
  size = "md",
}) => {
  return (
    <div>
      {label && (
        <label className="block text-sm text-gray-600 mb-1">{label}</label>
      )}
      <div className="space-y-1">
        {options.map((opt) => (
          <Radio
            key={opt.value}
            label={opt.label}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            name={name}
            size={size}
          />
        ))}
      </div>
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
};
