// كاش باك — third reward type, fully separate from NXP (game.nxp_balance) and
// Akthr (/loyalty.akthrPoints). DEMO/MOCK rewards only: values are
// deterministic and derived client-side from existing backend state, so no
// Firebase shape, calculation, or contract changes. Campaign-funded framing
// is part of the label — never presented as an unconditional bank payout.

export const CASHBACK_REWARDS = [
  {
    id: 'first_goal',
    title: 'أول هدف ادخار مكتمل',
    amount: 5, // SAR — mock demo reward
    earned: (user) => user.savedAmount >= user.goalAmount && user.goalAmount > 0,
  },
  {
    id: 'streak_30',
    title: '٣٠ يوم داخل الميزانية',
    amount: 10,
    earned: (_user, game) => (game?.streak?.best ?? 0) >= 30,
  },
  {
    id: 'first_1000',
    title: 'أول ١٠٠٠ ر.س مدخرات',
    amount: 20,
    earned: (user) => user.savedAmount >= 1000,
  },
];

export const CASHBACK_SPONSOR_LABEL = 'مكافأة تجريبية · بتمويل حملات التجار';

export function cashbackState(user, game) {
  if (!user) return { earned: [], locked: CASHBACK_REWARDS, total: 0 };
  const earned = CASHBACK_REWARDS.filter((r) => r.earned(user, game));
  const locked = CASHBACK_REWARDS.filter((r) => !r.earned(user, game));
  return { earned, locked, total: earned.reduce((s, r) => s + r.amount, 0) };
}
