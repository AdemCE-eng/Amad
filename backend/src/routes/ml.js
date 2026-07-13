import { Router } from "express";
import { getPersonalizedRecommendations } from "../services/personalizedOfferService.js";

const router = Router();

// Non-breaking, opt-in ML endpoint. Existing /api/offers routes are untouched.
router.get("/ml/recommendations", async (req, res, next) => {
  try {
    res.json(await getPersonalizedRecommendations(String(req.query.userId || "rashid")));
  } catch (error) {
    next(error);
  }
});

export default router;

