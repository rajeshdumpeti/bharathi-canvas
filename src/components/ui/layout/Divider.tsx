// src/components/ui/layout/Divider.tsx
import React from "react";
import clsx from "clsx";

interface DividerProps {
  vertical?: boolean;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  vertical = false,
  className,
}) => {
  return (
    <div
      className={clsx(
        vertical
          ? "h-full w-px bg-gray-200 mx-3"
          : "h-px w-full bg-gray-200 my-4",
        className
      )}
    />
  );
};
