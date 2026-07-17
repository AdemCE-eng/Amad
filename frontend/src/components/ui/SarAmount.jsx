import React from 'react';

const formatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

export default function SarAmount({ value, children, className = '', prefix = '' }) {
  const amount = children ?? formatter.format(Number(value || 0));

  return (
    <span dir="ltr" className={`inline-flex items-baseline gap-1 whitespace-nowrap tabular-nums ${className}`}>
      <span aria-hidden="true">⃁</span>
      <span>{prefix}{amount}</span>
    </span>
  );
}
