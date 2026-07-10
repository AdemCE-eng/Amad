import React from 'react';

// Streak chip: flame + day count. Frozen state shows the shield that saved
// it (compassion made visible — the bank protects, never shames).
// Translucent styling works on both the dark ink canvas and white cards.
export default function StreakFlame({ streak, size = 'md' }) {
  if (!streak) return null;
  const frozen = streak.status === 'frozen';
  const big = size === 'lg';
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full font-black ${
        big ? 'px-4 py-2 text-lg' : 'px-3 py-1 text-sm'
      } ${frozen ? 'bg-sky-400/15 text-sky-300 border border-sky-400/25' : 'bg-orange-400/15 text-orange-300 border border-orange-400/25'}`}
    >
      <span className={big ? 'text-2xl' : 'text-base'}>{frozen ? '❄️' : '🔥'}</span>
      <span>{streak.current}</span>
      <span className={`font-bold ${big ? 'text-sm' : 'text-[10px]'} opacity-70`}>يوم</span>
      {streak.freezesLeft > 0 && !frozen && (
        <span className={`${big ? 'text-sm' : 'text-[10px]'} opacity-60`} title="دروع حماية السلسلة">🛡️×{streak.freezesLeft}</span>
      )}
    </div>
  );
}
