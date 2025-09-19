import React, { useState } from "react";

type Props = {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
};

const LabChipInput: React.FC<Props> = ({ value, onChange, placeholder }) => {
  const [draft, setDraft] = useState("");

  const add = () => {
    const t = draft.trim();
    if (!t) return;
    if (value.includes(t)) {
      setDraft("");
      return;
    }
    onChange([...value, t]);
    setDraft("");
  };

  const remove = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((t, i) => (
          <span
            key={`${t}-${i}`}
            className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs"
          >
            {t}
            <button
              type="button"
              className="rounded p-0.5 hover:bg-gray-200"
              onClick={() => remove(i)}
              aria-label="Remove"
              title="Remove"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder || "Add and press Enter"}
          className="w-full rounded border px-2 py-2 text-sm"
        />
        <button
          type="button"
          onClick={add}
          className="rounded-md bg-gray-800 px-3 py-2 text-white hover:bg-gray-700 text-sm"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default LabChipInput;
