// Route-level tests against a RUNNING backend + Firebase emulator.
// Run: npm run test:routes   (requires: emulator on :9000, backend on :3000)
// Covers the P0 scenario end-to-end plus atomicity/idempotency guarantees.
import { test, before } from "node:test";
import assert from "node:assert/strict";

const B = process.env.API_BASE || "http://localhost:3000";

async function api(method, path, body) {
  const res = await fetch(`${B}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, data: await res.json() };
}
const get = (p) => api("GET", p);
const post = (p, b) => api("POST", p, b);

before(async () => {
  try {
    const { data } = await get("/health");
    assert.equal(data.ok, true);
  } catch {
    throw new Error(`Backend not reachable at ${B} — start emulator + backend first.`);
  }
});

test("P0 scenario: reset → plan → predict → wait → settle → reward", async () => {
  // 1. Reset — deterministic initial state.
  assert.equal((await post("/api/reset")).data.ok, true);
  let fam = (await get("/api/family/state")).data;
  assert.equal(fam.family.savedAmount, 3600);
  assert.equal(fam.loyalty.nxp, 60);
  assert.equal(fam.loyalty.akthrPoints, 120);

  // 2. Plan — approved allocations emerge from the capacity engine.
  const plan = (await post("/api/contribution-plan/generate")).data.contributionPlan;
  assert.equal(plan.monthlyRequired, 1200);
  assert.equal(plan.allocations.ahmed.amount, 700);
  assert.equal(plan.allocations.sarah.amount, 400);
  assert.equal(plan.allocations.rashid.amount, 100);

  // 3. Predict — Half Million, spec-exact, deterministic.
  const predicted = (await get("/api/offers/predicted")).data.predicted;
  const hm = Object.values(predicted).find((o) => o.merchant === "هاف مليون");
  assert.equal(hm.probability, 78);
  assert.equal(hm.windowDays, 3);
  assert.equal(hm.potentialSaving, 15);

  // 4. Wait — decision only, balances untouched.
  const decided = (await post("/api/offers/decide", { offerId: hm.id, decision: "wait" })).data;
  assert.equal(decided.offer.status, "waiting");
  fam = (await get("/api/family/state")).data;
  assert.equal(fam.family.savedAmount, 3600); // unchanged
  assert.equal(fam.loyalty.nxp, 60);

  // 5. Settle — family +15, NXP +10, Akthr UNTOUCHED.
  const settled = (await post("/api/offers/settle", { offerId: hm.id, memberId: "rashid" })).data;
  assert.equal(settled.family.savedAmount, 3615);
  assert.equal(settled.family.members.rashid.contributed, 315);
  assert.equal(settled.game.nxp_balance, 70); // canonical NXP field (was `coins`)
  assert.equal(settled.loyalty.nxp, 70);
  fam = (await get("/api/family/state")).data;
  assert.equal(fam.loyalty.akthrPoints, 120); // settlement never touches Akthr

  // Idempotency: second settle → 400, nothing duplicated.
  const again = await post("/api/offers/settle", { offerId: hm.id });
  assert.equal(again.status, 400);
  assert.equal(again.data.error, "not_waiting");
  fam = (await get("/api/family/state")).data;
  assert.equal(fam.family.savedAmount, 3615);
  assert.equal(fam.loyalty.nxp, 70);

  // 6. Parent reward — Ahmed → Rashid, Akthr 120 → 145.
  const rewardBody = {
    eventId: "reward_demo_001",
    senderId: "ahmed",
    recipientId: "rashid",
    rewardType: "akthr",
    amount: 25,
    message: "تستاهل يا بطل، استمريت داخل ميزانيتك 7 أيام.",
  };
  const rewarded = (await post("/api/family/reward", rewardBody)).data;
  assert.equal(rewarded.ok, true);
  assert.equal(rewarded.loyalty.akthrPoints, 145);
  assert.equal(rewarded.reward.senderId, "ahmed");
  assert.equal(rewarded.reward.recipientId, "rashid");

  // Notification written to the canonical path (read straight from the
  // emulator's REST surface — no extra backend route needed).
  const EMU = process.env.FIREBASE_DATABASE_EMULATOR_HOST || "127.0.0.1:9000";
  const notif = await (await fetch(`http://${EMU}/notifications/rashid/parentReward.json?ns=amad-demo-default-rtdb`)).json();
  assert.ok(notif, "notification exists at /notifications/rashid/parentReward");
  assert.equal(notif.from, "ahmed");
  assert.equal(notif.akthrPoints, 25);

  // Idempotency: identical reward event → 409, no double credit.
  const dup = await post("/api/family/reward", rewardBody);
  assert.equal(dup.status, 409);
  assert.equal(dup.data.error, "duplicate_reward");
  fam = (await get("/api/family/state")).data;
  assert.equal(fam.loyalty.akthrPoints, 145); // unchanged

  // Reward error paths.
  assert.equal((await post("/api/family/reward", { ...rewardBody, recipientId: "ghost" })).data.error, "unknown_recipient");
  assert.equal((await post("/api/family/reward", { ...rewardBody, recipientId: "ahmed" })).data.error, "self_reward");
  assert.equal((await post("/api/family/reward", { ...rewardBody, senderId: "rashid", recipientId: "sarah" })).data.error, "sender_not_parent");
  assert.equal((await post("/api/family/reward", { ...rewardBody, eventId: "reward_demo_002", amount: -5 })).data.error, "invalid_amount");
});

test("reset restores the exact deterministic initial state", async () => {
  await post("/api/reset");
  const fam = (await get("/api/family/state")).data;
  assert.equal(fam.family.savedAmount, 3600);
  assert.equal(fam.family.goalAmount, 12000);
  assert.equal(fam.family.members.rashid.contributed, 300);
  assert.equal(fam.family.members.rashid.name, "راشد");
  // Exactly this fictional family — no stale/duplicate member ids survive reset.
  assert.deepEqual(Object.keys(fam.family.members).sort(), ["ahmed", "rashid", "sarah"]);
  assert.equal(fam.loyalty.nxp, 60);
  assert.equal(fam.loyalty.akthrPoints, 120);
  assert.equal(fam.contributionPlan, null);
  const predicted = (await get("/api/offers/predicted")).data.predicted;
  for (const o of Object.values(predicted)) assert.equal(o.status, "pending");
  // Mascot name restored to صقر (Pixel Falcon identity).
  const state = (await get("/api/state")).data;
  assert.equal(state.user.petName, "صقر");
});
