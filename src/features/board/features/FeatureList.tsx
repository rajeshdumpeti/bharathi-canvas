// src/features/board/features/FeatureList.tsx
import React from "react";
import FeatureRow from "./FeatureRow";
import type { Feature } from "types/boardFeatures";

interface FeatureListProps {
  features: Feature[];
}

const FeatureList: React.FC<FeatureListProps> = ({ features }) => (
  <div className="space-y-3">
    {features.map((f) => (
      <FeatureRow key={f.id} feature={f} projectId={f?.projectId} />
    ))}
  </div>
);

export default FeatureList;
