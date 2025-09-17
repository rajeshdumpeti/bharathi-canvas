// src/utils/getInitials.ts

/**
 * Derive up to two uppercase initials from a name or email.
 */
export function getInitials(input?: string | null): string {
  const s = (input ?? "").trim();
  if (!s) return "U";
  // If it's an email, use first char before @
  if (s.includes("@")) return s[0]!.toUpperCase();

  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0] + parts[1]![0]).toUpperCase();
}
