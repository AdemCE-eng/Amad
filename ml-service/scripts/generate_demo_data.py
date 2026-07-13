from __future__ import annotations

import json
from pathlib import Path
import numpy as np
import pandas as pd

from app.features import occasions_for_year
from app.settings import DATA_DIR, DATA_LABEL, RANDOM_SEED


CATALOG = [
    ("half_million", "هاف مليون", "Half Million", "coffee", "Riyadh", False, 24, 20, 0.84),
    ("barns", "بارنز", "Barn's", "coffee", "Jeddah", False, 22, 18, 0.34),
    ("camel_step", "خطوة جمل", "Camel Step", "coffee", "Riyadh", False, 28, 20, 0.62),
    ("dose", "دوز", "Dose", "coffee", "Khobar", False, 26, 18, 0.56),
    ("albaik", "البيك", "AlBaik", "restaurant", "Jeddah", False, 32, 15, 0.46),
    ("herfy", "هرفي", "Herfy", "restaurant", "Riyadh", False, 38, 18, 0.54),
    ("shawarmer", "شاورمر", "Shawarmer", "restaurant", "Riyadh", False, 34, 20, 0.58),
    ("maestro", "مايسترو بيتزا", "Maestro Pizza", "restaurant", "Riyadh", False, 58, 25, 0.70),
    ("jarir", "جرير", "Jarir", "retail", "Riyadh", False, 320, 12, 0.64),
    ("extra", "إكسترا", "eXtra", "retail", "Khobar", False, 620, 15, 0.68),
    ("noon_saudi", "نون السعودية", "Noon Saudi", "retail", "Riyadh", False, 180, 22, 0.90),
    ("flynas", "طيران ناس", "flynas", "travel", "Riyadh", False, 480, 18, 0.56),
    ("saudia", "الخطوط السعودية", "SAUDIA", "travel", "Jeddah", False, 760, 12, 0.48),
    ("panda", "بنده", "Panda", "grocery", "Jeddah", True, 145, 10, 0.52),
    ("al_dawaa", "الدواء", "Al-Dawaa", "pharmacy", "Dammam", True, 85, 12, 0.62),
]


def generate_catalog() -> pd.DataFrame:
    columns = ["merchant_id", "name_ar", "name_en", "category", "city", "is_essential", "average_ticket_sar", "base_discount_pct", "campaign_propensity"]
    frame = pd.DataFrame(CATALOG, columns=columns)
    frame["source_label"] = DATA_LABEL
    return frame


def campaign_probability(merchant, occasion):
    fit = {
        "coffee": {"national_day": .38, "founding_day": .20, "ramadan": .18},
        "restaurant": {"ramadan": .34, "national_day": .22, "eid_fitr": .24},
        "retail": {"national_day": .40, "back_to_school": .42, "founding_day": .28},
        "travel": {"eid_fitr": .34, "eid_adha": .38, "national_day": .18},
        "grocery": {"ramadan": .42, "eid_fitr": .28},
        "pharmacy": {"ramadan": .18, "national_day": .10},
    }
    return min(.96, .06 + merchant.campaign_propensity * .35 + fit.get(merchant.category, {}).get(occasion, .04))


def generate_campaigns(catalog, rng) -> pd.DataFrame:
    rows = []
    for year in range(2022, 2026):
        for _, merchant in catalog.iterrows():
            for occasion in occasions_for_year(year):
                probability = campaign_probability(merchant, occasion.key)
                # Counterexamples are intentional synthetic scenarios for ranking evaluation.
                if merchant.merchant_id == "half_million" and occasion.key == "national_day":
                    active = True
                elif merchant.merchant_id == "barns" and occasion.key == "national_day":
                    active = False
                elif merchant.merchant_id == "noon_saudi" and occasion.key == "national_day":
                    active = True
                else:
                    active = rng.random() < probability
                if not active:
                    continue
                start = occasion.date + pd.Timedelta(days=int(rng.integers(-5, 3)))
                duration = int(rng.integers(2, 8))
                rows.append({
                    "campaign_id": f"syn_{merchant.merchant_id}_{occasion.key}_{year}",
                    "merchant_id": merchant.merchant_id, "occasion": occasion.key,
                    "start_date": start.date().isoformat(), "end_date": (start + pd.Timedelta(days=duration)).date().isoformat(),
                    "duration_days": duration, "discount_pct": int(np.clip(rng.normal(merchant.base_discount_pct, 4), 5, 35)),
                    "city": merchant.city, "source_label": DATA_LABEL,
                })
    return pd.DataFrame(rows).sort_values(["start_date", "merchant_id"])


def generate_transactions(catalog, rng) -> pd.DataFrame:
    users = ["rashid", "user_delta", "user_falcon", "user_najd", "user_redsea"]
    affinities = {
        "rashid": {"half_million": .36, "barns": .18, "albaik": .15, "jarir": .035, "panda": .12, "al_dawaa": .05},
        "user_delta": {"camel_step": .25, "herfy": .18, "noon_saudi": .12, "panda": .16},
        "user_falcon": {"dose": .22, "shawarmer": .20, "extra": .07, "al_dawaa": .08},
        "user_najd": {"half_million": .10, "maestro": .22, "jarir": .08, "flynas": .025},
        "user_redsea": {"barns": .20, "albaik": .24, "saudia": .025, "panda": .18},
    }
    periods = {"coffee": "morning", "restaurant": "evening", "retail": "afternoon", "travel": "evening", "grocery": "afternoon", "pharmacy": "evening"}
    rows, transaction_id = [], 0
    for date in pd.date_range("2023-01-01", "2026-09-19", freq="D"):
        for user in users:
            for merchant_id, weekly_probability in affinities[user].items():
                merchant = catalog[catalog.merchant_id == merchant_id].iloc[0]
                preferred = 4 if merchant.category in {"coffee", "restaurant"} else 5
                multiplier = 2.0 if date.weekday() == preferred else .55
                salary_multiplier = 1.45 if 24 <= date.day <= 28 and merchant.category in {"retail", "travel"} else 1
                if rng.random() >= min(.92, weekly_probability / 7 * multiplier * salary_multiplier):
                    continue
                transaction_id += 1
                amount = round(max(3, rng.normal(merchant.average_ticket_sar, merchant.average_ticket_sar * .18)), 2)
                rows.append({
                    "transaction_id": f"syn_txn_{transaction_id:06d}", "user_id": user,
                    "merchant_id": merchant_id, "category": merchant.category,
                    "amount_sar": amount, "timestamp": (date + pd.Timedelta(hours=int(rng.integers(8, 22)))).isoformat(),
                    "time_period": periods[merchant.category], "city": merchant.city,
                    "is_essential": bool(merchant.is_essential), "source_label": DATA_LABEL,
                })
    return pd.DataFrame(rows).sort_values("timestamp")


def generate():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    rng = np.random.default_rng(RANDOM_SEED)
    catalog = generate_catalog()
    campaigns = generate_campaigns(catalog, rng)
    transactions = generate_transactions(catalog, rng)
    catalog.to_csv(DATA_DIR / "merchant_catalog.csv", index=False, encoding="utf-8")
    campaigns.to_csv(DATA_DIR / "merchant_campaigns.csv", index=False, encoding="utf-8")
    transactions.to_csv(DATA_DIR / "user_transactions.csv", index=False, encoding="utf-8")
    summary = {"label": DATA_LABEL, "merchants": len(catalog), "campaigns": len(campaigns), "transactions": len(transactions), "users": int(transactions.user_id.nunique()), "seed": RANDOM_SEED}
    (DATA_DIR / "generation_summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    generate()

