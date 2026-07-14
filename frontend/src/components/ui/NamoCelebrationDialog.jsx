import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';

const BORDER_CLASS = {
  coral: 'border-coral/35',
  gold: 'border-amber-300/35',
  emerald: 'border-emerald-300/35',
};

export default function NamoCelebrationDialog({
  children,
  variant,
  titleId,
  descriptionId,
  onDismiss,
  leaving = false,
  dismissDisabled = false,
  reducedMotion: reducedMotionOverride,
  testId = 'namo-celebration-overlay',
}) {
  const systemReducedMotion = useReducedMotion();
  const reducedMotion = reducedMotionOverride ?? systemReducedMotion;
  const dialogRef = useRef(null);
  const dismissRef = useRef(onDismiss);
  dismissRef.current = onDismiss;

  useEffect(() => {
    const previousFocus = document.activeElement;
    dialogRef.current?.focus();
    return () => {
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && !dismissDisabled) {
      event.preventDefault();
      dismissRef.current?.();
      return;
    }
    if (event.key === 'Tab') {
      const focusable = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  const accent = variant === 'achievement' ? 'gold' : variant === 'challenge' ? 'emerald' : 'coral';

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center px-5 pointer-events-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: reducedMotion ? 0.1 : 0.24 }}
      data-testid={testId}
    >
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" data-testid="namo-celebration-backdrop" />
      <motion.section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        dir="rtl"
        onKeyDown={handleKeyDown}
        data-celebration-variant={variant}
        data-testid="namo-celebration-dialog"
        className={`namo-celebration-dialog relative w-full max-w-[310px] overflow-hidden rounded-3xl border ${BORDER_CLASS[accent]} bg-ink-card px-5 py-4 text-center text-cream shadow-[0_24px_70px_rgba(0,0,0,0.65)] outline-none focus-visible:ring-2 focus-visible:ring-coral/60`}
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 14 }}
        animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: reducedMotion ? 0.14 : 0.36, ease: [0.22, 1, 0.36, 1] }}
      >
        {typeof children === 'function' ? children({ reducedMotion }) : children}
      </motion.section>
    </motion.div>
  );
}
