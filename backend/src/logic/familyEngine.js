// familyEngine.js — family goal, members, contributions, and the Explainable
// Saving Capacity Engine. Pure functions, zero I/O — same style as petEngine
// (health) and gameEngine (streaks/NXP/achievements). This module owns ONLY
// family state; it never touches /pet, /game, or /user.
//
// The Capacity Engine is deterministic and explainable — NOT an LLM, NOT ML:
//   safeSurplus      = income - fixedExpenses - essentialExpenses - safetyBuffer
//   savingCapacity   = max(0, safeSurplus * SAFE_SAVING_RATE)
//   contribution     = memberCapacity / totalFamilyCapacity * monthlyRequired
// Every allocation carries its inputs + formula result so the UI can show
// exactly WHY each member pays what they pay.

import { MOCK_FINANCIAL_PROFILES } from "../mocks/openBanking.js";

const SAFE_SAVING_RATE = 0.2; // spend at most 20% of safe surplus on goals
const DAY_MS = 86_400_000;

// ── Initial state ────────────────────────────────────────

// Demo-tuned: remaining 8400 over 7 months → monthlyRequired 1200, which the
// Capacity Engine splits 700/400/100 from the MOCK Open-Banking profiles.
export function initialFamilyState() {
  return {
    id: "fam_demo",
    goalTitle: "رحلة العائلة إلى العلا",
    goalAmount: 12000,
    savedAmount: 3600,
    deadline: Date.now() + 7 * 30 * DAY_MS, // 7 months out
    status: "active",
    members: {
      ahmed: { name: "أحمد", role: "parent", relation: "الأب", contributed: 2000 },
      sarah: { name: "سارة", role: "parent", relation: "الأم", contributed: 1300 },
      rashid: { name: "راشد", role: "child", relation: "الابن", contributed: 300 },
    },
  };
}

// ── Explainable Saving Capacity Engine ───────────────────

export function memberCapacity(profile) {
  const safeSurplus =
    profile.income - profile.fixedExpenses - profile.essentialExpenses - profile.safetyBuffer;
  const savingCapacity = Math.max(0, Math.round(safeSurplus * SAFE_SAVING_RATE));
  return { safeSurplus, savingCapacity };
}

// months remaining, minimum 1 so a past deadline never divides by zero.
function monthsRemaining(family, now = Date.now()) {
  return Math.max(1, Math.round((family.deadline - now) / (30 * DAY_MS)));
}

export function generateContributionPlan(family, profiles = MOCK_FINANCIAL_PROFILES, now = Date.now()) {
  const remaining = Math.max(0, family.goalAmount - family.savedAmount);
  const months = monthsRemaining(family, now);
  const monthlyRequired = Math.ceil(remaining / months);

  const capacities = Object.keys(family.members).map((id) => {
    const profile = profiles[id];
    if (!profile) return { memberId: id, safeSurplus: 0, savingCapacity: 0 };
    return { memberId: id, ...memberCapacity(profile), profile };
  });
  const totalCapacity = capacities.reduce((s, c) => s + c.savingCapacity, 0);
  const allocationMode = totalCapacity > 0 ? "saving-capacity" : "equal-fallback";
  const shares = capacities.map((c) => (
    totalCapacity > 0
      ? c.savingCapacity / totalCapacity
      : capacities.length > 0 ? 1 / capacities.length : 0
  ));

  // Largest-remainder allocation keeps the family total exact and prevents
  // an all-zero result for small targets or legacy members without profiles.
  const rawAmounts = shares.map((share) => monthlyRequired * share);
  const amounts = rawAmounts.map(Math.floor);
  let undistributed = monthlyRequired - amounts.reduce((sum, amount) => sum + amount, 0);
  const remainderOrder = rawAmounts
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction
      || capacities[a.index].memberId.localeCompare(capacities[b.index].memberId));
  for (const { index } of remainderOrder) {
    if (undistributed <= 0) break;
    amounts[index] += 1;
    undistributed -= 1;
  }

  const allocations = {};
  capacities.forEach((c, index) => {
    const share = shares[index];
    const amount = amounts[index];
    allocations[c.memberId] = {
      memberId: c.memberId,
      name: family.members[c.memberId].name,
      role: family.members[c.memberId].role,
      // Explainability payload — the exact inputs and derived numbers:
      income: c.profile?.income ?? 0,
      fixedExpenses: c.profile?.fixedExpenses ?? 0,
      essentialExpenses: c.profile?.essentialExpenses ?? 0,
      safetyBuffer: c.profile?.safetyBuffer ?? 0,
      safeSurplus: c.safeSurplus,
      savingCapacity: c.savingCapacity,
      sharePct: Math.round(share * 100),
      amount,
      explanation: totalCapacity > 0
        ? `الدخل ${c.profile?.income ?? 0} − التزامات ${(c.profile?.fixedExpenses ?? 0) + (c.profile?.essentialExpenses ?? 0)} − احتياطي ${c.profile?.safetyBuffer ?? 0} = فائض آمن ${c.safeSurplus} ← قدرة ادخار ${c.savingCapacity} (${Math.round(share * 100)}٪ من قدرة العائلة)`
        : `لم تتوفر بيانات مالية كافية، لذلك وزع المبلغ الشهري بالتساوي بنسبة ${Math.round(share * 100)}٪.`,
    };
  });

  return {
    familyId: family.id,
    monthlyRequired,
    monthsRemaining: months,
    remainingToGoal: remaining,
    totalCapacity,
    allocationMode,
    safeSavingRate: SAFE_SAVING_RATE,
    allocations,
    generatedAt: now,
    status: remaining === 0 ? "completed" : "active",
    engine: "explainable-saving-capacity", // deterministic — not LLM, not ML
  };
}

// ── Contributions ────────────────────────────────────────

// A member moves money toward the family goal. Source marks where it came
// from: "manual" | "offer-saving" | "salary-slice".
export function applyFamilyContribution(family, { memberId, amount, source = "manual" }) {
  if (!family.members[memberId]) return { error: "unknown_member" };
  if (!Number.isFinite(amount) || amount <= 0) return { error: "invalid_amount" };

  const member = family.members[memberId];
  const savedAmount = family.savedAmount + amount;
  const next = {
    ...family,
    savedAmount,
    status: savedAmount >= family.goalAmount ? "reached" : family.status,
    members: {
      ...family.members,
      [memberId]: { ...member, contributed: member.contributed + amount },
    },
  };
  return { family: next, event: { memberId, amount, source, at: Date.now() } };
}

// ── Parent reward (validation + record; the route applies side effects) ──

// Deterministic id from the reward's content — the SAME reward event sent
// twice maps to the same id, making the endpoint idempotent.
export function rewardId({ senderId, recipientId, rewardType, amount, message }) {
  const key = `${senderId}|${recipientId}|${rewardType}|${amount}|${message || ""}`;
  let h = 0;
  for (const ch of key) h = (h * 31 + ch.codePointAt(0)) >>> 0;
  return "rwd_" + h.toString(36);
}

export function validateParentReward(family, { eventId, senderId, recipientId, rewardType, amount, message }) {
  const sender = family.members[senderId];
  const recipient = family.members[recipientId];
  if (!sender) return { error: "unknown_sender" };
  if (!recipient) return { error: "unknown_recipient" };
  if (senderId === recipientId) return { error: "self_reward" };
  if (sender.role !== "parent") return { error: "sender_not_parent" };
  if (rewardType !== "akthr") return { error: "unsupported_reward_type" };
  if (!Number.isFinite(amount) || amount <= 0) return { error: "invalid_amount" };

  // Idempotency key: the caller's eventId when provided (demo controller
  // sends e.g. "reward_demo_001"); otherwise a deterministic content hash.
  // RTDB paths forbid . # $ [ ] / — sanitize.
  const id = eventId
    ? String(eventId).slice(0, 60).replace(/[.#$/\[\]]/g, "_")
    : rewardId({ senderId, recipientId, rewardType, amount, message });
  return {
    reward: {
      id,
      senderId,
      senderName: sender.name,
      recipientId,
      recipientName: recipient.name,
      rewardType,
      amount,
      message: String(message || "").slice(0, 200),
      source: "MOCK akthr",
      at: Date.now(),
    },
  };
}

export function familyProgressPct(family) {
  return family.goalAmount > 0
    ? Math.min(100, Math.round((family.savedAmount / family.goalAmount) * 100))
    : 0;
}
