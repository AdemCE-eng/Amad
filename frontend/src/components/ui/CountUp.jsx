import React, { useEffect, useRef } from 'react';
import { animate } from 'motion/react';

// Number ticker: animates from the previously shown value to the new one.
// Writes into the DOM node directly — no per-frame React renders.
export default function CountUp({ value, decimals = 2, duration = 0.8, className, startFrom }) {
  const ref = useRef(null);
  const shown = useRef(startFrom ?? value);

  useEffect(() => {
    const from = shown.current ?? value;
    const controls = animate(from, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = v.toFixed(decimals);
      },
    });
    shown.current = value;
    return () => controls.stop();
  }, [value, decimals, duration]);

  return <span ref={ref} className={className}>{Number(startFrom ?? value).toFixed(decimals)}</span>;
}
