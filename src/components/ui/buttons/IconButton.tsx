// src/components/ui/buttons/IconButton.tsx
import React from "react";
import clsx from "clsx";

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "solid" | "outline" | "neutral";
  icon?: React.ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({
  size = "md",
  variant = "ghost",
  icon,
  className,
  children,
  ...rest
}) => {
  const sizeClasses =
    size === "sm"
      ? "p-1.5 text-sm"
      : size === "lg"
        ? "p-3 text-base"
        : "p-2 text-sm";

  const variantClasses = {
    ghost: "text-gray-600 hover:bg-gray-100",
    solid: "bg-gray-200 hover:bg-gray-300 text-gray-700",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400",
    neutral:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300 border border-transparent",
  };

  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-md transition",
        sizeClasses,
        variantClasses[variant],
        className
      )}
      {...rest}
    >
      {icon}
      {children && <span className="ml-1">{children}</span>}
    </button>
  );
};
