// src/components/ui/feedback/Empty.tsx
import React from "react";

export const Empty: React.FC<{ text?: string }> = ({ text = "—" }) => (
  <p className="text-sm text-gray-500 italic">{text}</p>
);
