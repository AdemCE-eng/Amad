import React from 'react';

// Income-relative NXP receipt for the last save (backend game.lastSaveReward,
// timestamp-keyed like lastCelebration). Two cases:
//   nxp > 0  — "+X NXP — you saved Y% of your income"
//   nxp == 0 — the anti-farming case: the deposit only refilled savings back
//              toward their all-time high, so no NXP; explain it instead of
//              looking broken.
// compact = the Pet Room line; full = the Home strip (same convention as
// ChallengeCard).
const ZERO_TEXT = 'رجعت لأفضل مستوى مدخراتك — كل ريال فوقه يكسبك NXP من جديد';

export default function SaveRewardTag({ reward, compact = false }) {
  if (!reward || !(reward.at > 0)) return null;
  const zero = reward.nxp === 0;

  if (compact) {
    return (
      <p className={`text-[11px] font-bold text-center mt-3 ${zero ? 'text-cream/60' : 'text-violet'}`}>
        {zero ? `✦ ${ZERO_TEXT}` : `✦ +${reward.nxp} NXP — وفّرت ${reward.pctOfIncome}٪ من دخلك الشهري`}
      </p>
    );
  }

  if (zero) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-center">
        <span className="text-cream/60 text-[11px] font-bold">✦ {ZERO_TEXT}</span>
      </div>
    );
  }
  return (
    <div className="bg-violet/10 border border-violet/25 rounded-2xl px-4 py-2.5 flex items-center justify-center gap-1.5 flex-wrap text-center">
      <span className="text-violet font-black text-sm">✦ +{reward.nxp} NXP</span>
      <span className="text-cream/60 text-[11px] font-bold">— وفّرت {reward.pctOfIncome}٪ من دخلك الشهري</span>
    </div>
  );
}
