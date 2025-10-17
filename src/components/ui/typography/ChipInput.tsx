import React, { useRef, useState } from "react";

type Props = {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  className?: string;
  /** If true, trims and dedups automatically */
  dedupe?: boolean;
};

const ChipInput: React.FC<Props> = ({
  value,
  onChange,
  placeholder = "Add and press Enter",
  className = "",
  dedupe = true,
}) => {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const commit = (raw: string) => {
    const v = raw.trim();
    if (!v) return;
    const next = dedupe ? Array.from(new Set([...value, v])) : [...value, v];
    onChange(next);
    setDraft("");
  };

  const splitAndCommit = (raw: string) => {
    const parts = raw
      .split(/[,;]/g)
      .map((s) => s.trim())
      .filter(Boolean);
    if (!parts.length) return;
    const base = new Set(value);
    const next = dedupe
      ? [...new Set([...value, ...parts])]
      : [...value, ...parts];
    if (next.length !== value.length || parts.some((p) => !base.has(p))) {
      onChange(next);
    }
    setDraft("");
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // allow comma-separated on enter too
      splitAndCommit(draft);
    } else if (e.key === "Backspace" && !draft && value.length) {
      // remove last chip
      onChange(value.slice(0, -1));
    } else if (e.key === "," || e.key === ";") {
      e.preventDefault();
      splitAndCommit(draft);
    }
  };

  const removeAt = (idx: number) => {
    const next = value.filter((_, i) => i !== idx);
    onChange(next);
    // keep focus for fast editing
    inputRef.current?.focus();
  };

  return (
    <div
      className={[
        "flex flex-wrap gap-2 rounded border bg-white px-2 py-2",
        className,
      ].join(" ")}
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((chip, i) => (
        <span
          key={`${chip}-${i}`}
          className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-800"
        >
          {chip}
          <button
            type="button"
            aria-label={`Remove ${chip}`}
            className="rounded p-0.5 hover:bg-gray-200"
            onClick={() => removeAt(i)}
          >
            ✕
          </button>
        </span>
      ))}

      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => commit(draft)}
        placeholder={value.length ? "" : placeholder}
        className="min-w-[8ch] flex-1 outline-none text-sm placeholder:text-gray-400 bg-transparent"
      />
    </div>
  );
};

export default ChipInput;
