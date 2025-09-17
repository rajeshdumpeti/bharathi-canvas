import React, { useState } from "react";

type Props = {
  value: string;
  className?: string;
};

const SecretText: React.FC<Props> = ({ value, className }) => {
  const [show, setShow] = useState(false);
  return (
    <div className={["inline-flex items-center gap-2", className].join(" ")}>
      <code className="rounded bg-gray-100 px-2 py-1">
        {show ? value : "••••••••"}
      </code>
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="text-xs rounded border px-2 py-1 hover:bg-gray-50"
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
};

export default SecretText;
