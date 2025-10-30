// src/components/ui/typography/Text.tsx
import React, { JSX } from "react";
import clsx from "clsx";

interface TextProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  weight?: "normal" | "medium" | "semibold";
  tone?: "default" | "muted" | "danger" | "success" | "warning";
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const Text: React.FC<TextProps> = ({
  children,
  size = "md",
  weight = "normal",
  tone = "default",
  as: Component = "p",
  className,
}) => {
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };
  const tones = {
    default: "text-gray-800",
    muted: "text-gray-500",
    danger: "text-red-600",
    success: "text-green-600",
    warning: "text-yellow-700",
  };

  return (
    <Component
      className={clsx(
        sizes[size],
        tones[tone],
        weight === "medium" && "font-medium",
        weight === "semibold" && "font-semibold",
        className
      )}
    >
      {children}
    </Component>
  );
};
