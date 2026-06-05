import { useEffect } from 'react';

// Module-level counter so nested modals don't prematurely unlock scroll.
let _lockCount = 0;
let _savedPaddingRight = '';

export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;

    _lockCount++;

    if (_lockCount === 1) {
      // Measure scrollbar width BEFORE hiding it to prevent layout shift
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      _savedPaddingRight = document.body.style.paddingRight;

      document.body.style.overflow   = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      // Compensate for the scrollbar disappearing so the page doesn't shift
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }

    return () => {
      _lockCount = Math.max(0, _lockCount - 1);

      if (_lockCount === 0) {
        document.body.style.overflow   = '';
        document.documentElement.style.overflow = '';
        document.body.style.paddingRight = _savedPaddingRight;
        _savedPaddingRight = '';
      }
    };
  }, [active]);
}
