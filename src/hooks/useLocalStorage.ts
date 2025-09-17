import * as React from "react";

type Init<T> = T | (() => T);

export type UseLocalStorageOptions<T> = {
  /** default: window.localStorage */
  storage?: Storage | null;
  /** custom JSON serializer  */
  serialize?: (value: T) => string;
  /** custom JSON deserializer */
  deserialize?: (raw: string) => T;
  /** optional versioning + migration */
  version?: number;
  migrate?: (oldValue: unknown, oldVersion: number | undefined) => T;
};

const canUseDOM =
  typeof window !== "undefined" && typeof document !== "undefined";
const defaultStorage = canUseDOM ? window.localStorage : null;

export function useLocalStorage<T>(
  key: string,
  initialValue: Init<T>,
  opts: UseLocalStorageOptions<T> = {}
): [T, React.Dispatch<React.SetStateAction<T>>, () => void] {
  const {
    storage = defaultStorage,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    version,
    migrate,
  } = opts;

  // lazy init so we only touch storage once on mount
  const [value, setValue] = React.useState<T>(() => {
    try {
      if (!storage)
        return typeof initialValue === "function"
          ? (initialValue as Function)()
          : initialValue;

      const raw = storage.getItem(key);
      if (raw == null) {
        return typeof initialValue === "function"
          ? (initialValue as Function)()
          : initialValue;
      }

      const parsed = deserialize(raw) as
        | { __v?: number; data?: unknown }
        | unknown;

      // simple versioning wrapper support
      if (
        parsed &&
        typeof parsed === "object" &&
        "__v" in (parsed as any) &&
        "data" in (parsed as any)
      ) {
        const v = (parsed as any).__v as number | undefined;
        const data = (parsed as any).data;
        if (version != null && v !== version && migrate) {
          return migrate(data, v);
        }
        return data as T;
      }

      // plain value stored (no wrapper)
      if (version != null && migrate) {
        return migrate(parsed, undefined);
      }
      return parsed as T;
    } catch {
      return typeof initialValue === "function"
        ? (initialValue as Function)()
        : initialValue;
    }
  });

  // write-through on changes
  React.useEffect(() => {
    if (!storage) return;
    try {
      const payload =
        version == null
          ? serialize(value)
          : serialize({ __v: version, data: value } as any);
      storage.setItem(key, payload);
    } catch {
      // ignore quota or serialization errors
    }
  }, [key, value, storage, serialize, version]);

  // clear helper for callers
  const clear = React.useCallback(() => {
    if (!storage) return;
    try {
      storage.removeItem(key);
    } catch {}
  }, [key, storage]);

  return [value, setValue, clear];
}

export default useLocalStorage;
