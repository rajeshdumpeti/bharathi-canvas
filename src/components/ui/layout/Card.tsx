// src/components/ui/layout/Card.tsx
import React from "react";
import clsx from "clsx";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
  actions?: React.ReactNode; // ✅ Added this line
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  className,
  footer,
  actions,
}) => {
  return (
    <section
      className={clsx(
        "rounded-xl border border-gray-200 bg-white shadow-sm p-5 transition hover:shadow-md",
        className
      )}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between mb-3">
          {title && (
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          )}
          {actions && <div className="flex-shrink-0">{actions}</div>}
        </div>
      )}
      <div>{children}</div>
      {footer && (
        <div className="mt-4 border-t pt-3 text-sm text-gray-600">{footer}</div>
      )}
    </section>
  );
};
