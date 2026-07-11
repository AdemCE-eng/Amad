import React from 'react';

// Weekly challenge card, dark-ink styling. compact = the Home strip;
// full = Rewards version.
export default function ChallengeCard({ challenge, compact = false }) {
  if (!challenge) return null;
  const done = challenge.status === 'done';
  const pct = Math.min(100, Math.round((challenge.used / challenge.limit) * 100));

  if (compact) {
    return (
      <div className={`rounded-3xl p-3.5 flex items-center gap-3 ${done ? 'bg-emerald-400/10 border border-emerald-400/25' : 'bg-ink-card'}`}>
        <span className="text-2xl">{done ? '✅' : '☕'}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-cream truncate">{challenge.title}</p>
          <p className="text-[11px] text-cream/50">{done ? `أنجزته! +${challenge.reward} 🪙` : `${challenge.used}/${challenge.limit} هذا الأسبوع`}</p>
        </div>
        {!done && (
          <div className="w-16 bg-white/10 rounded-full h-2">
            <div className={`h-2 rounded-full ${pct >= 100 ? 'bg-red-400' : 'bg-coral'}`} style={{ width: `${pct}%` }}></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`rounded-3xl p-5 ${done ? 'bg-emerald-400/10 border border-emerald-400/25' : 'bg-ink-card'}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-[11px] font-bold text-coral mb-1">تحدي الأسبوع</p>
          <h3 className="font-black text-cream">{challenge.title}</h3>
          {challenge.desc && <p className="text-xs text-cream/50 mt-1">{challenge.desc}</p>}
        </div>
        <span className="text-3xl">{done ? '🎉' : '☕'}</span>
      </div>
      {done ? (
        <p className="text-sm font-bold text-emerald-300">أنجزته! حصلت على {challenge.reward} 🪙</p>
      ) : (
        <>
          <div className="w-full bg-white/10 rounded-full h-3 mb-2">
            <div className={`h-3 rounded-full transition-all duration-700 ${pct >= 100 ? 'bg-red-400' : 'bg-coral'}`} style={{ width: `${pct}%` }}></div>
          </div>
          <div className="flex justify-between text-xs font-bold text-cream/50">
            <span>{challenge.used} من {challenge.limit}</span>
            <span>الجائزة: {challenge.reward} 🪙</span>
          </div>
        </>
      )}
    </div>
  );
}
