import { useEffect } from 'react';

// Module-level counter so nested modals don't prematurely unlock scroll.
// Count > 0  → body + html are locked.
// Count = 0  → lock is released.
let _lockCount = 0;

export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;

    _lockCount++;
    if (_lockCount === 1) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }

    return () => {
      _lockCount = Math.max(0, _lockCount - 1);
      if (_lockCount === 0) {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
    };
  }, [active]);
}
