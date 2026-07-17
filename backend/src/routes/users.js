import { Router } from "express";
import {
  ensureUser,
  listUserIds,
  removeAllUsers,
  userIdFromRequest,
} from "../services/userStore.js";

const router = Router();

// Called once when the frontend opens. The UUID is created and persisted by
// the browser; the server owns all database writes and provisions its state.
router.post("/session", async (req, res, next) => {
  try {
    const userId = userIdFromRequest(req);
    if (!userId) return res.status(400).json({ ok: false, error: "invalid_user_id" });
    const { created } = await ensureUser(userId);
    res.json({ ok: true, userId, username: userId, created });
  } catch (error) {
    next(error);
  }
});

// Controller-only inventory. The local presentation controller uses this to
// fan each cheat action out to every active judge UUID.
router.get("/controller/users", async (_req, res, next) => {
  try {
    const users = await listUserIds();
    res.json({ ok: true, users, count: users.length });
  } catch (error) {
    next(error);
  }
});

router.delete("/controller/users", async (_req, res, next) => {
  try {
    const users = await listUserIds();
    await removeAllUsers();
    res.json({ ok: true, removedUsers: users.length, message: "All users removed." });
  } catch (error) {
    next(error);
  }
});

export default router;
