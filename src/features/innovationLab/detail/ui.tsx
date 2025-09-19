import React, { useState } from "react";

export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
      {children}
    </span>
  );
}

/** Generic tag editor for string[] */
export function TagInput({
  value,
  onChange,
  placeholder = "Add item and press Enter",
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const add = (t: string) => {
    const v = t.trim();
    if (!v) return;
    if (value.includes(v)) return;
    onChange([...value, v]);
    setDraft("");
  };
  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-2">
        {value.map((t) => (
          <Chip key={t}>
            {t}
            <button
              className="ml-1 text-gray-400 hover:text-gray-700"
              onClick={() => onChange(value.filter((x) => x !== t))}
              type="button"
              aria-label={`Remove ${t}`}
              title="Remove"
            >
              ×
            </button>
          </Chip>
        ))}
      </div>
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add(draft);
          }
        }}
        placeholder={placeholder}
        className="w-full rounded-md border px-3 py-2"
      />
    </div>
  );
}

export function NumberChip({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: number | undefined;
  onChange: (n: number) => void;
  hint?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-28 text-sm text-gray-600">{label}</span>
      <input
        type="range"
        min={0}
        max={5}
        step={1}
        value={value ?? 0}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="flex-1"
      />
      <Chip>{value ?? 0}/5</Chip>
      {hint ? <span className="ml-1 text-xs text-gray-400">{hint}</span> : null}
    </div>
  );
}
