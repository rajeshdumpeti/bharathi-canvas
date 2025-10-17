// src/components/ui/inputs/FormField.tsx
import React from "react";

interface FormFieldProps {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  children,
}) => {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm text-gray-600">{label}</label>}
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};
