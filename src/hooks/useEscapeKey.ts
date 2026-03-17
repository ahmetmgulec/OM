import { useEffect } from 'react';

/**
 * Calls onClose when Escape key is pressed.
 * Use in modals for keyboard-accessible close.
 */
export function useEscapeKey(onClose: () => void, isActive: boolean) {
  useEffect(() => {
    if (!isActive) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isActive]);
}
