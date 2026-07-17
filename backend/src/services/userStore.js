import { adminDb, runWithUserScope } from "../firebase.js";
import { initialState } from "../logic/petEngine.js";
import { initialFamilyState } from "../logic/familyEngine.js";
import { initialOffersState, initialLoyaltyState } from "../logic/offerEngine.js";

export const USER_ID_HEADER = "x-nadeem-user-id";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function normalizeUserId(value) {
  const userId = String(value || "").trim().toLowerCase();
  return UUID_PATTERN.test(userId) ? userId : null;
}

export function userIdFromRequest(req) {
  return normalizeUserId(req.get(USER_ID_HEADER));
}

function seedTransactions() {
  // SYNTHETIC demo history only; it contains no real customer records.
  const now = Date.now();
  const hour = 3600_000;
  return {
    seed_salary: { type: "salary", amount: 8000, category: "income", label: "إيداع راتب", timestamp: now - 120 * hour },
    seed_coffee_1: { type: "purchase", amount: 45, category: "coffee", label: "قهوة الصباح", timestamp: now - 90 * hour },
    seed_groceries: { type: "purchase", amount: 320, category: "groceries", label: "بقالة", timestamp: now - 72 * hour },
    seed_transport: { type: "purchase", amount: 55, category: "transport", label: "بنزين", timestamp: now - 48 * hour },
    seed_dining: { type: "purchase", amount: 210, category: "dining", label: "مطعم", timestamp: now - 30 * hour },
    seed_coffee_2: { type: "purchase", amount: 50, category: "coffee", label: "قهوة", timestamp: now - 6 * hour },
  };
}

export function freshUserRecord(userId, { includeTransactions = true } = {}) {
  const fresh = initialState();
  return {
    user: {
      ...fresh.user,
      id: userId,
      username: userId,
    },
    pet: fresh.pet,
    emergencyShield: fresh.emergencyShield,
    game: fresh.game,
    family: initialFamilyState(),
    offers: initialOffersState(),
    loyalty: initialLoyaltyState(),
    contributionPlan: null,
    notifications: null,
    userNotifications: null,
    meta: {
      ...fresh.meta,
      userId,
      createdAt: Date.now(),
    },
    transactions: includeTransactions ? seedTransactions() : null,
  };
}

export async function ensureUser(userId) {
  const userRef = adminDb.ref(`/users/${userId}`);
  const snapshot = await userRef.get();
  if (!snapshot.exists()) {
    const record = freshUserRecord(userId);
    await userRef.set(record);
    return { created: true, record };
  }

  const value = snapshot.val() || {};
  if (value.user?.id !== userId || value.user?.username !== userId) {
    await userRef.update({
      "user/id": userId,
      "user/username": userId,
      "meta/userId": userId,
    });
  }
  return { created: false, record: value };
}

export async function listUserIds() {
  const snapshot = await adminDb.ref("/users").get();
  return Object.keys(snapshot.val() || {}).filter(normalizeUserId).sort();
}

export async function removeAllUsers() {
  // `/users` is authoritative. The remaining keys remove the retired shared
  // layout as well, so a between-judges wipe leaves no orphaned demo identity.
  await adminDb.ref("/").update({
    users: null,
    user: null,
    pet: null,
    emergencyShield: null,
    game: null,
    family: null,
    offers: null,
    loyalty: null,
    contributionPlan: null,
    notifications: null,
    userNotifications: null,
    meta: null,
    transactions: null,
  });
}

export async function requireUserScope(req, res, next) {
  const userId = userIdFromRequest(req);
  if (!userId) {
    return res.status(400).json({
      ok: false,
      error: "invalid_user_id",
      message: "A valid UUID is required in X-Nadeem-User-Id.",
    });
  }

  try {
    await ensureUser(userId);
    req.nadeemUserId = userId;
    return runWithUserScope(userId, next);
  } catch (error) {
    return next(error);
  }
}
