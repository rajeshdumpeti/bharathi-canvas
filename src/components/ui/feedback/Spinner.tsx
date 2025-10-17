// src/components/ui/feedback/Spinner.tsx
import React from "react";
import clsx from "clsx";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "blue" | "gray" | "white";
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "blue",
  className,
}) => {
  const sizeClasses =
    size === "sm"
      ? "h-4 w-4 border-2"
      : size === "lg"
        ? "h-8 w-8 border-4"
        : "h-6 w-6 border-2";

  const colorClasses =
    color === "white"
      ? "border-white border-t-transparent"
      : color === "gray"
        ? "border-gray-300 border-t-gray-500"
        : "border-blue-300 border-t-blue-600";

  return (
    <div
      className={clsx(
        "inline-block rounded-full animate-spin",
        sizeClasses,
        colorClasses,
        className
      )}
      role="status"
    />
  );
};
