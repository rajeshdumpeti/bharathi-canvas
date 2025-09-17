// src/helpers/useOutsideClose.ts
import { useEffect } from "react";

export interface OutsideCloseOptions {
  closeOnEsc?: boolean;
  closeOnClickOutside?: boolean;
}

/**
 * Calls `onClose` when clicking outside the ref'd node or pressing Escape.
 */
export function useOutsideClose<T extends HTMLElement>(
  ref: React.RefObject<T>,
  onClose?: () => void,
  opts: OutsideCloseOptions = {}
) {
  const { closeOnEsc = true, closeOnClickOutside = true } = opts;

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (!closeOnClickOutside || !ref.current) return;
      if (e.target instanceof Node && !ref.current.contains(e.target))
        onClose?.();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (!closeOnEsc) return;
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [ref, onClose, closeOnEsc, closeOnClickOutside]);
}
