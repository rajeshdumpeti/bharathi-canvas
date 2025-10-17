// src/components/ui/typography/Heading.tsx
import React, { JSX } from "react";
import clsx from "clsx";

interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

export const Heading: React.FC<HeadingProps> = ({
  level = 2,
  children,
  className,
  align = "left",
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const baseStyles = "font-semibold text-gray-900 tracking-tight";
  const sizes: Record<number, string> = {
    1: "text-4xl",
    2: "text-2xl",
    3: "text-xl",
    4: "text-lg",
    5: "text-base",
    6: "text-sm",
  };

  return (
    <Tag className={clsx(baseStyles, sizes[level], `text-${align}`, className)}>
      {children}
    </Tag>
  );
};
