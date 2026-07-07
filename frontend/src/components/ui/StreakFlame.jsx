import React from 'react';

// Streak chip: flame + day count. Frozen state shows the shield that saved
// it (compassion made visible — the bank protects, never shames).
export default function StreakFlame({ streak, size = 'md' }) {
  if (!streak) return null;
  const frozen = streak.status === 'frozen';
  const big = size === 'lg';
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full font-black ${
        big ? 'px-4 py-2 text-lg' : 'px-3 py-1 text-sm'
      } ${frozen ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-orange-50 text-orange-600 border border-orange-200'}`}
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
