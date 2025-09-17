import React from "react";

type EmptyStateProps = {
  title: string;
  description?: React.ReactNode;
  bullets?: React.ReactNode[];
  action?: React.ReactNode; // e.g. a CTA button
  className?: string;
};

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  bullets,
  action,
  className = "rounded-xl border bg-white p-8",
}) => {
  return (
    <div className={className}>
      <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
      {description && (
        <div className="mt-2 text-gray-600 text-sm">{description}</div>
      )}
      {bullets?.length ? (
        <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-gray-700">
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      ) : null}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
