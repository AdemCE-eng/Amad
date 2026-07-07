import React from 'react';
import CountUp from './CountUp';

export default function CoinPill({ coins, size = 'md' }) {
  const big = size === 'lg';
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full font-black bg-amber-50 text-amber-700 border border-amber-200 ${big ? 'px-4 py-2 text-lg' : 'px-3 py-1 text-sm'}`}>
      <span className={big ? 'text-xl' : 'text-base'}>🪙</span>
      <CountUp value={coins ?? 0} decimals={0} duration={0.6} />
    </div>
  );
}
