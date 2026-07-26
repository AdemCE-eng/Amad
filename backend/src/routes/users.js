import { Router } from "express";
import {
  ensureUser,
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

export default router;
