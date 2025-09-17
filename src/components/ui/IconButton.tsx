import React from "react";

type Props = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  className?: string;
  title?: string;
  disabled?: boolean;
};

const IconButton: React.FC<Props> = ({
  children,
  onClick,
  type = "button",
  className = "",
  title,
  disabled,
}) => (
  <button
    type={type}
    title={title}
    disabled={disabled}
    onClick={onClick}
    className={[
      "inline-flex items-center gap-1 rounded border px-3 py-1.5 text-sm",
      "bg-white hover:bg-gray-50 text-gray-700",
      "disabled:opacity-60 disabled:cursor-not-allowed",
      className,
    ].join(" ")}
  >
    {children}
  </button>
);

export default IconButton;
