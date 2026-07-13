import { Router } from "express";
import { db } from "../firebase.js";
import { offersFromRecommendations, recommendationOfferId } from "../logic/offerEngine.js";
import {
  getPersonalizedRecommendations,
  recommendationEngineStatus,
} from "../services/personalizedOfferService.js";

const router = Router();

// Read-only operator check. Unlike /ml/recommendations, this does not
// materialize offers in Firebase, so opening the Cheat Controller cannot
// advance or alter the customer demo journey.
router.get("/ml/status", async (req, res, next) => {
  try {
    const result = await getPersonalizedRecommendations(String(req.query.userId || "rashid"));
    res.json(recommendationEngineStatus(result));
  } catch (error) {
    next(error);
  }
});

// Non-breaking, opt-in ML endpoint. Existing /api/offers routes are untouched.
router.get("/ml/recommendations", async (req, res, next) => {
  try {
    const result = await getPersonalizedRecommendations(String(req.query.userId || "rashid"));
    const offers = offersFromRecommendations(result.recommendations, result.source);
    await db.ref("/offers").set(offers);
    res.json({
      ...result,
      recommendations: result.recommendations.map((item) => ({
        ...item,
        offerId: recommendationOfferId(item.merchantId),
      })),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
