import * as React from "react";

export type OutsideCloseOptions = {
  /** Close when Escape is pressed (default: true) */
  closeOnEsc?: boolean;
  /** Close when a pointer occurs outside the element (default: true) */
  closeOnOutside?: boolean;
  /** Event type for outside detection (default: 'pointerdown') */
  outsideEvent?: "pointerdown" | "mousedown" | "click";
  /** Use capture phase to catch events before stopPropagation (default: true) */
  capture?: boolean;
};

/**
 * Calls `onClose` when clicking/tapping outside the ref'd node or pressing Escape.
 * Works with portals by checking `event.composedPath()`.
 */
export function useOutsideClose<T extends HTMLElement>(
  ref: React.RefObject<T>,
  onClose?: () => void,
  {
    closeOnEsc = true,
    closeOnOutside = true,
    outsideEvent = "pointerdown",
    capture = true,
  }: OutsideCloseOptions = {}
) {
  // keep latest callback without re-binding listeners
  const onCloseRef = React.useRef(onClose);
  onCloseRef.current = onClose;

  React.useEffect(() => {
    const el = ref.current;
    if (!closeOnOutside && !closeOnEsc) return;
    if (!el && !closeOnEsc) return;

    const handleOutside = (e: Event) => {
      if (!closeOnOutside) return;
      const target = e.target as Node | null;
      // composedPath supports clicks from shadow DOM/portals
      const path = (e as any).composedPath?.() as EventTarget[] | undefined;
      const contains = el
        ? path
          ? path.includes(el)
          : el.contains(target as Node)
        : false;
      if (!contains) onCloseRef.current?.();
    };

    const handleKey = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === "Escape") onCloseRef.current?.();
    };

    document.addEventListener(outsideEvent, handleOutside, { capture });
    document.addEventListener("keydown", handleKey, { capture: false });

    return () => {
      document.removeEventListener(outsideEvent, handleOutside, {
        capture,
      } as any);
      document.removeEventListener("keydown", handleKey);
    };
  }, [ref, closeOnEsc, closeOnOutside, outsideEvent, capture]);
}
