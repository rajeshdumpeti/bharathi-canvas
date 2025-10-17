import React from "react";
import clsx from "clsx";
interface BadgeProps {
  color?: "blue" | "green" | "red" | "gray" | "yellow";
  label?: string;
  children?: React.ReactNode;
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  color = "gray",
  label,
  children,
  size = "md",
}) => {
  const colorClasses =
    color === "blue"
      ? "bg-blue-100 text-blue-800"
      : color === "green"
        ? "bg-green-100 text-green-800"
        : color === "red"
          ? "bg-red-100 text-red-800"
          : color === "yellow"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-gray-100 text-gray-800";

  const sizeClasses =
    size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";
  console.log("Badge label:", label, "children:", children);

  return (
    <span
      className={clsx(
        "inline-flex items-center font-medium rounded-full",
        colorClasses,
        sizeClasses
      )}
    >
      {label || children}
    </span>
  );
};
