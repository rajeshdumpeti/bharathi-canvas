import React from "react";
import LabChipInput from "./LabChipInput";

type Props = {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  onChange: (next: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  }) => void;
};

const SwotEditor: React.FC<Props> = ({
  strengths,
  weaknesses,
  opportunities,
  threats,
  onChange,
}) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded border bg-white p-3">
        <h4 className="font-semibold mb-2">Strengths</h4>
        <LabChipInput
          value={strengths}
          onChange={(v) =>
            onChange({ strengths: v, weaknesses, opportunities, threats })
          }
          placeholder="Add a strength…"
        />
      </div>

      <div className="rounded border bg-white p-3">
        <h4 className="font-semibold mb-2">Weaknesses</h4>
        <LabChipInput
          value={weaknesses}
          onChange={(v) =>
            onChange({ strengths, weaknesses: v, opportunities, threats })
          }
          placeholder="Add a weakness…"
        />
      </div>

      <div className="rounded border bg-white p-3">
        <h4 className="font-semibold mb-2">Opportunities</h4>
        <LabChipInput
          value={opportunities}
          onChange={(v) =>
            onChange({ strengths, weaknesses, opportunities: v, threats })
          }
          placeholder="Add an opportunity…"
        />
      </div>

      <div className="rounded border bg-white p-3">
        <h4 className="font-semibold mb-2">Threats</h4>
        <LabChipInput
          value={threats}
          onChange={(v) =>
            onChange({ strengths, weaknesses, opportunities, threats: v })
          }
          placeholder="Add a threat…"
        />
      </div>
    </div>
  );
};

export default SwotEditor;
