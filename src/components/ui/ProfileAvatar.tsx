import React from "react";

type Props = {
  name: string;
  src?: string | null;
  size?: number; // px
  className?: string;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
}

const ProfileAvatar: React.FC<Props> = ({
  name,
  src,
  size = 32,
  className,
}) => {
  const style = { width: size, height: size } as React.CSSProperties;
  return src ? (
    <img
      src={src}
      alt={name}
      style={style}
      className={["rounded-full object-cover", className]
        .filter(Boolean)
        .join(" ")}
    />
  ) : (
    <div
      style={style}
      className={[
        "rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-medium",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={name}
    >
      {initials(name)}
    </div>
  );
};

export default ProfileAvatar;
