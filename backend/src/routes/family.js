// family.js — family goal, members, contributions, and the contribution plan.
// Same pipeline as simulate.js: read → pure engine fn → single write.
// NXP note: responses expose `loyalty.nxp` read from game.nxp_balance (the
// single source of truth) alongside the stored akthrPoints.
import { Router } from "express";
import { db } from "../firebase.js";
import { readState } from "./simulate.js";
import {
  initialFamilyState,
  generateContributionPlan,
  applyFamilyContribution,
  familyProgressPct,
  validateParentReward,
} from "../logic/familyEngine.js";
import { generatePetMessage } from "../ai/gemini.js";
import { buildNotification } from "../logic/notificationEngine.js";

const router = Router();

export async function readFamilyNodes() {
  const snap = await db.ref("/").get();
  const val = snap.val() || {};
  return {
    family: val.family || initialFamilyState(),
    contributionPlan: val.contributionPlan || null,
    loyalty: val.loyalty || { akthrPoints: 0 },
    game: val.game || {},
  };
}

function loyaltyView(loyalty, game) {
  return { nxp: game?.nxp_balance ?? 0, akthrPoints: loyalty?.akthrPoints ?? 0 };
}

// GET /api/family/state — family + plan + loyalty snapshot.
router.get("/family/state", async (_req, res, next) => {
  try {
    const { family, contributionPlan, loyalty, game } = await readFamilyNodes();
    res.json({
      ok: true,
      family,
      progressPct: familyProgressPct(family),
      contributionPlan,
      loyalty: loyaltyView(loyalty, game),
    });
  } catch (e) {
    next(e);
  }
});

// POST /api/family/goal  { goalTitle?, goalAmount?, deadline? } — update goal.
router.post("/family/goal", async (req, res, next) => {
  try {
    const { family } = await readFamilyNodes();
    const next_ = { ...family };
    if (req.body.goalTitle) next_.goalTitle = String(req.body.goalTitle).slice(0, 60);
    if (Number.isFinite(Number(req.body.goalAmount)) && Number(req.body.goalAmount) > 0) {
      next_.goalAmount = Math.round(Number(req.body.goalAmount));
    }
    if (Number.isFinite(Number(req.body.deadline))) next_.deadline = Number(req.body.deadline);
    await db.ref("/family").set(next_);
    res.json({ ok: true, family: next_, progressPct: familyProgressPct(next_) });
  } catch (e) {
    next(e);
  }
});

// POST /api/family/contribute  { memberId, amount, source? }
router.post("/family/contribute", async (req, res, next) => {
  try {
    const { family } = await readFamilyNodes();
    const amount = Number(req.body.amount);
    const result = applyFamilyContribution(family, {
      memberId: req.body.memberId,
      amount,
      source: req.body.source,
    });
    if (result.error) return res.status(400).json({ ok: false, error: result.error });
    await db.ref("/family").set(result.family);
    res.json({ ok: true, family: result.family, progressPct: familyProgressPct(result.family), event: result.event });
  } catch (e) {
    next(e);
  }
});

// POST /api/family/reward
// { senderId, recipientId, rewardType: "akthr", amount, message }
// Explicit parent → child reward (MOCK Akthr, campaign-funded). Separate from
// offer settlement by design. Idempotent: the reward id derives from the
// event's content, so the same event sent twice hits the stored record and
// returns 409 duplicate_reward with no double credit.
router.post("/family/reward", async (req, res, next) => {
  try {
    const { family, loyalty } = await readFamilyNodes();
    const amount = Number(req.body.amount);
    const validated = validateParentReward(family, {
      eventId: req.body.eventId,
      senderId: req.body.senderId,
      recipientId: req.body.recipientId,
      rewardType: req.body.rewardType,
      amount,
      message: req.body.message,
    });
    if (validated.error) return res.status(400).json({ ok: false, error: validated.error });
    const { reward } = validated;

    const existing = await db.ref(`/family/rewards/${reward.id}`).get();
    if (existing.exists()) {
      return res.status(409).json({ ok: false, error: "duplicate_reward", rewardId: reward.id });
    }

    // Pet celebrates the recognition — health/mood/message only, evolution
    // stage strictly personal-savings-derived and untouched here.
    const stateSnap = await db.ref("/pet").get();
    const petPrev = stateSnap.val() || {};
    const { text: message } = await generatePetMessage({ category: "happy", event: "challenge_done" });
    const pet = { ...petPrev, animationState: "celebrate", message, updatedAt: Date.now() };

    const nextLoyalty = { ...loyalty, akthrPoints: (loyalty.akthrPoints || 0) + amount };
    const txnKey = db.ref("/transactions").push().key;

    const notifTitle = "مكافأة من ولي الأمر 🎖️";
    const notifBody = reward.message || `${reward.senderName} كافأك بـ ${amount} نقطة أكثر`;
    const notification = buildNotification({
      id: reward.id,
      recipientId: reward.recipientId,
      type: "parent_reward",
      title: notifTitle,
      body: notifBody,
      timestamp: reward.at,
      relatedEntityId: reward.id,
      senderId: reward.senderId,
      rewardType: "akthr",
      rewardAmount: amount,
    });

    // Single atomic multi-location update.
    await db.ref("/").update({
      "/loyalty": nextLoyalty,
      [`/family/rewards/${reward.id}`]: reward,
      // Per-role node — drives the in-app RewardNotice celebration toast.
      [`/notifications/${reward.recipientId}/parentReward`]: {
        title: notifTitle,
        body: notifBody,
        from: reward.senderId,
        akthrPoints: amount,
        at: reward.at,
        source: "MOCK akthr",
      },
      // Stable recipient-scoped record used by the realtime notification UI.
      [`/userNotifications/${reward.recipientId}/${reward.id}`]: notification,
      "/pet": pet,
      [`/transactions/${txnKey}`]: {
        type: "reward",
        amount,
        category: "akthr",
        label: `مكافأة أكثر من ${reward.senderName} إلى ${reward.recipientName}`,
        timestamp: reward.at,
      },
    });

    res.json({ ok: true, reward, loyalty: nextLoyalty, pet });
  } catch (e) {
    next(e);
  }
});

// POST /api/contribution-plan/generate — run the Explainable Saving Capacity
// Engine over the seeded MOCK Open-Banking profiles and persist the plan.
router.post("/contribution-plan/generate", async (_req, res, next) => {
  try {
    const { family } = await readFamilyNodes();
    const plan = generateContributionPlan(family);
    await db.ref("/contributionPlan").set(plan);
    res.json({ ok: true, contributionPlan: plan });
  } catch (e) {
    next(e);
  }
});

// GET /api/contribution-plan — last generated plan.
router.get("/contribution-plan", async (_req, res, next) => {
  try {
    const { contributionPlan } = await readFamilyNodes();
    if (!contributionPlan) return res.status(404).json({ ok: false, error: "no_plan" });
    res.json({ ok: true, contributionPlan });
  } catch (e) {
    next(e);
  }
});

export default router;
