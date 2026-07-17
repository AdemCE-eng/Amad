// budget.js — savings-plan + savings-account endpoints.
// Same pipeline discipline as the other routes: read state → pure engine →
// single Firebase write. These are settings changes (no health/AI reaction),
// so they write /user fields directly rather than going through commit().
import { Router } from "express";
import { db } from "../firebase.js";
import { readState } from "./simulate.js";
import { suggestSavingsPlan, applyPlanToUser } from "../logic/budgetEngine.js";

const router = Router();

// POST /api/plan/suggest  { monthlyIncome } — pure preview, no write.
// Returns the algorithm's proposed save-rate, monthly target, and per-category
// budgets so the UI can show (and let the user edit) the plan before applying.
router.post("/plan/suggest", (req, res, next) => {
  try {
    const monthlyIncome = Number(req.body.monthlyIncome);
    if (!Number.isFinite(monthlyIncome) || monthlyIncome <= 0) {
      return res.status(400).json({ ok: false, error: "invalid_income", message: "أدخل دخلاً شهرياً صحيحاً." });
    }
    res.json({ ok: true, plan: suggestSavingsPlan(monthlyIncome) });
  } catch (e) {
    next(e);
  }
});

// POST /api/plan/apply  { monthlyIncome, budgets?, monthlyTarget?, goalAmount? }
// Commit the (possibly edited) plan: opens the savings account, stores income +
// plan, installs the category budgets, resets period counters, and sets the
// savings goal the companion is bound to.
router.post("/plan/apply", async (req, res, next) => {
  try {
    const monthlyIncome = Number(req.body.monthlyIncome);
    const monthlyTarget = Number(req.body.monthlyTarget);
    if (!Number.isFinite(monthlyIncome) || monthlyIncome <= 0) {
      return res.status(400).json({ ok: false, error: "invalid_income", message: "أدخل دخلاً شهرياً صحيحاً." });
    }
    if (Number.isFinite(monthlyTarget) && monthlyTarget > monthlyIncome) {
      return res.status(400).json({
        ok: false,
        error: "savings_exceeds_income",
        message: "الادخار الشهري لا يمكن أن يتجاوز الدخل الشهري.",
      });
    }
    const state = await readState();
    const nextUser = applyPlanToUser(state.user, {
      monthlyIncome,
      budgets: req.body.budgets,
      monthlyTarget,
      goalAmount: Number(req.body.goalAmount),
    });
    await db.ref("/user").update({
      income: nextUser.income,
      monthlyIncome: nextUser.monthlyIncome,
      balance: nextUser.balance,
      goalAmount: nextUser.goalAmount,
      savingsAccountOpened: nextUser.savingsAccountOpened,
      savingsPlan: nextUser.savingsPlan,
      budgets: nextUser.budgets,
      budgetPeriod: nextUser.budgetPeriod,
    });
    res.json({ ok: true, user: nextUser });
  } catch (e) {
    next(e);
  }
});

// POST /api/savings/open — open the savings account without a full plan.
router.post("/savings/open", async (_req, res, next) => {
  try {
    await db.ref("/user/savingsAccountOpened").set(true);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
