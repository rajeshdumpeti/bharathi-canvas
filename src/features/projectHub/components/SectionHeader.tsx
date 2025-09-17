import React from "react";
import useProjectHub from "../../../hooks/useProjectHub";

export default function SectionHeader({ title }) {
  const { selected } = useProjectHub();
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="text-sm text-gray-500">
        {selected ? `Project: ${selected.name}` : "No project selected"}
      </div>
    </div>
  );
}
