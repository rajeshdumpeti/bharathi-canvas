// src/components/ui/typography/MutedText.tsx
import React from "react";
import clsx from "clsx";

interface MutedTextProps {
  children: React.ReactNode;
  size?: "xs" | "sm";
  className?: string;
}

export const MutedText: React.FC<MutedTextProps> = ({
  children,
  size = "sm",
  className,
}) => {
  const sizeClass = size === "xs" ? "text-xs" : "text-sm";

  return (
    <p className={clsx("text-gray-500", sizeClass, className)}>{children}</p>
  );
};
