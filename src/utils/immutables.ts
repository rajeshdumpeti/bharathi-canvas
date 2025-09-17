/** Immutable update: patch object or updater fn */
export function updateAt<T>(
  arr: readonly T[],
  idx: number,
  patch: Partial<T> | ((prev: T) => T)
): T[] {
  return arr.map((v, i) =>
    i !== idx
      ? (v as T)
      : typeof patch === "function"
        ? (patch as (p: T) => T)(v as T)
        : ({ ...(v as any), ...(patch as any) } as T)
  );
}

export function removeAt<T>(arr: readonly T[], idx: number): T[] {
  return arr.filter((_, i) => i !== idx) as T[];
}
