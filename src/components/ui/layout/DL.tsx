// src/components/ui/layout/DL.tsx
import React from "react";

interface DLProps {
  rows: [string, React.ReactNode][];
  className?: string;
}

export const DL: React.FC<DLProps> = ({ rows, className }) => (
  <dl className={`grid grid-cols-3 gap-y-2 text-sm ${className || ""}`}>
    {rows.map(([dt, dd], i) => (
      <React.Fragment key={i}>
        <dt className="text-gray-500">{dt}</dt>
        <dd className="col-span-2">{dd}</dd>
      </React.Fragment>
    ))}
  </dl>
);
