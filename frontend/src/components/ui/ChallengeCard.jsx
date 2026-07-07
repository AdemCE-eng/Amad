import React from 'react';

// Weekly challenge card. compact = the Home strip; full = Rewards version.
export default function ChallengeCard({ challenge, compact = false }) {
  if (!challenge) return null;
  const done = challenge.status === 'done';
  const pct = Math.min(100, Math.round((challenge.used / challenge.limit) * 100));

  if (compact) {
    return (
      <div className={`rounded-2xl p-3 border flex items-center gap-3 ${done ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'}`}>
        <span className="text-2xl">{done ? '✅' : '☕'}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-800 truncate">{challenge.title}</p>
          <p className="text-[11px] text-gray-500">{done ? `أنجزته! +${challenge.reward} 🪙` : `${challenge.used}/${challenge.limit} هذا الأسبوع`}</p>
        </div>
        {!done && (
          <div className="w-16 bg-gray-100 rounded-full h-2">
            <div className={`h-2 rounded-full ${pct >= 100 ? 'bg-red-400' : 'bg-alinma'}`} style={{ width: `${pct}%` }}></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`rounded-2xl p-5 border ${done ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'} shadow-sm`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-[11px] font-bold text-alinma mb-1">تحدي الأسبوع</p>
          <h3 className="font-black text-gray-800">{challenge.title}</h3>
          {challenge.desc && <p className="text-xs text-gray-500 mt-1">{challenge.desc}</p>}
        </div>
        <span className="text-3xl">{done ? '🎉' : '☕'}</span>
      </div>
      {done ? (
        <p className="text-sm font-bold text-green-700">أنجزته! حصلت على {challenge.reward} 🪙</p>
      ) : (
        <>
          <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
            <div className={`h-3 rounded-full transition-all duration-700 ${pct >= 100 ? 'bg-red-400' : 'bg-alinma'}`} style={{ width: `${pct}%` }}></div>
          </div>
          <div className="flex justify-between text-xs font-bold text-gray-500">
            <span>{challenge.used} من {challenge.limit}</span>
            <span>الجائزة: {challenge.reward} 🪙</span>
          </div>
        </>
      )}
    </div>
  );
}
