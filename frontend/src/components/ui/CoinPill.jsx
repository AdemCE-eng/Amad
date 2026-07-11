import React from 'react';
import CountUp from './CountUp';

// NXP balance chip — translucent amber, reads on dark ink and white cards.
export default function CoinPill({ nxp, size = 'md' }) {
  const big = size === 'lg';
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full font-black bg-amber-400/15 text-amber-300 border border-amber-400/25 ${big ? 'px-4 py-2 text-lg' : 'px-3 py-1 text-sm'}`}>
      <span className={big ? 'text-xl' : 'text-base'}>🪙</span>
      <CountUp value={nxp ?? 0} decimals={0} duration={0.6} />
      <span className={`font-bold opacity-70 ${big ? 'text-xs' : 'text-[10px]'}`}>NXP</span>
    </div>
  );
}
