from __future__ import annotations

import json
import math
import numpy as np
import pandas as pd

from app.features import nearest_occasion
from app.settings import DATA_DIR, DATA_LABEL, DATA_START, DATASET_VERSION, DEMO_AS_OF, RANDOM_SEED


CATALOG = [
    ("half_million", "هاف مليون", "Half Million", "coffee", "Riyadh", False, 24, 20, .58, "national_day"),
    ("barns", "بارنز", "Barn's", "coffee", "Jeddah", False, 22, 18, .48, "founding_day"),
    ("camel_step", "خطوة جمل", "Camel Step", "coffee", "Riyadh", False, 28, 20, .52, "riyadh_season"),
    ("dose", "دوز", "Dose", "coffee", "Khobar", False, 26, 18, .46, "national_day"),
    ("albaik", "البيك", "AlBaik", "restaurant", "Jeddah", False, 32, 15, .44, "ramadan"),
    ("herfy", "هرفي", "Herfy", "restaurant", "Riyadh", False, 38, 18, .50, "national_day"),
    ("shawarmer", "شاورمر", "Shawarmer", "restaurant", "Riyadh", False, 34, 20, .54, "riyadh_season"),
    ("maestro", "مايسترو بيتزا", "Maestro Pizza", "restaurant", "Riyadh", False, 58, 25, .62, "national_day"),
    ("kudu", "كودو", "Kudu", "restaurant", "Riyadh", False, 36, 18, .48, "founding_day"),
    ("al_romansiah", "الرومانسية", "Al Romansiah", "restaurant", "Riyadh", False, 72, 16, .42, "ramadan"),
    ("jarir", "جرير", "Jarir", "retail", "Riyadh", False, 320, 12, .56, "back_to_school"),
    ("extra", "إكسترا", "eXtra", "retail", "Khobar", False, 620, 15, .60, "national_day"),
    ("noon_saudi", "نون السعودية", "Noon Saudi", "retail", "Riyadh", False, 180, 22, .68, "national_day"),
    ("flynas", "طيران ناس", "flynas", "travel", "Riyadh", False, 480, 18, .48, "eid_fitr"),
    ("saudia", "الخطوط السعودية", "SAUDIA", "travel", "Jeddah", False, 760, 12, .44, "eid_adha"),
    ("hungerstation", "هنقرستيشن", "HungerStation", "delivery", "Riyadh", False, 48, 18, .58, "riyadh_season"),
    ("panda", "بنده", "Panda", "grocery", "Jeddah", True, 145, 10, .46, "ramadan"),
    ("danube", "الدانوب", "Danube", "grocery", "Jeddah", True, 175, 12, .50, "ramadan"),
    ("al_dawaa", "الدواء", "Al-Dawaa", "pharmacy", "Dammam", True, 85, 12, .44, "founding_day"),
    ("nahdi", "النهدي", "Nahdi", "pharmacy", "Jeddah", True, 92, 12, .48, "ramadan"),
]

CITIES = ["Riyadh", "Jeddah", "Makkah", "Madinah", "Dammam", "Khobar", "Abha"]
TIME_PERIODS = ["morning", "afternoon", "evening", "night"]
CATEGORY_INTERVAL = {"coffee": 11, "restaurant": 17, "retail": 40, "travel": 80, "delivery": 16, "grocery": 19, "pharmacy": 42}


def sigmoid(value):
    return 1 / (1 + math.exp(-value))


def generate_catalog():
    columns = ["merchant_id", "name_ar", "name_en", "category", "city", "is_essential", "average_ticket_sar", "base_discount_pct", "campaign_propensity", "seasonal_focus"]
    frame = pd.DataFrame(CATALOG, columns=columns)
    frame["source_label"] = DATA_LABEL
    return frame


def generate_campaigns(catalog, rng):
    rows, last_campaign, campaign_id = [], {}, 0
    weeks = pd.date_range(DATA_START, pd.Timestamp(DEMO_AS_OF) - pd.Timedelta(days=6), freq="W-MON")
    category_bias = {"coffee": .18, "restaurant": .08, "retail": .16, "travel": -.08, "delivery": .12, "grocery": -.04, "pharmacy": -.10}
    for week in weeks:
        occasion = nearest_occasion(week)
        days_until = (occasion.date - week).days
        near_occasion = abs(days_until) <= 24
        salary_period = min(abs(week.day - 25), abs(week.day - 27)) <= 4
        for _, merchant in catalog.iterrows():
            previous = last_campaign.get(merchant.merchant_id)
            days_since = (week - previous).days if previous is not None else 120
            cooldown = -1.35 if days_since < 14 else (-.45 if days_since < 28 else .25)
            focus = 2.10 if near_occasion and merchant.seasonal_focus == occasion.key else (.72 if near_occasion else -.28)
            salary = .62 if salary_period and merchant.category in {"retail", "travel", "delivery"} else .08
            merchant_strength = 3.2 * (float(merchant.campaign_propensity) - .50)
            year_effect = ((week.year + sum(map(ord, merchant.merchant_id))) % 5 - 2) * .10
            score = -.05 + merchant_strength + focus + salary + cooldown + category_bias[merchant.category] + year_effect + rng.normal(0, .48)
            probability = np.clip(sigmoid(score), .035, .94)
            if rng.random() >= probability:
                continue
            campaign_id += 1
            start = week + pd.Timedelta(days=int(rng.integers(0, 6)))
            duration = int(rng.integers(2, 9))
            discount = int(np.clip(rng.normal(merchant.base_discount_pct + (4 if near_occasion else 0), 4.5), 5, 38))
            rows.append({
                "campaign_id": f"syn_campaign_{campaign_id:05d}", "merchant_id": merchant.merchant_id,
                "occasion": occasion.key, "start_date": start.date().isoformat(),
                "end_date": (start + pd.Timedelta(days=duration)).date().isoformat(), "duration_days": duration,
                "discount_pct": discount, "city": merchant.city, "source_label": DATA_LABEL,
            })
            last_campaign[merchant.merchant_id] = start
    return pd.DataFrame(rows).sort_values(["start_date", "merchant_id"])


def choose_active_merchants(catalog, user_city, preferred_categories, rng, count=5):
    weights = np.ones(len(catalog), dtype=float)
    weights *= np.where(catalog.category.isin(preferred_categories), 4.0, .65)
    weights *= np.where(catalog.city == user_city, 1.55, 1.0)
    weights *= np.where(catalog.category == "travel", .42, 1.0)
    weights /= weights.sum()
    return catalog.iloc[rng.choice(len(catalog), size=count, replace=False, p=weights)]


def generate_pair_events(user_id, merchant, user, start, end, rng):
    category = merchant.category
    base_interval = CATEGORY_INTERVAL[category]
    loyalty = user["loyalty"] * rng.uniform(.78, 1.18)
    interval = np.clip(base_interval / max(.65, loyalty), 5, 85)
    preferred_weekday = int(user["weekday"] if rng.random() < .72 else rng.integers(0, 7))
    preferred_period = user["period"] if rng.random() < .72 else rng.choice(TIME_PERIODS)
    current = start + pd.Timedelta(days=float(rng.uniform(0, interval)))
    rows = []
    while current < end:
        missed = rng.random() < .11
        unexpected_early = rng.random() < .08
        step = interval * (2.0 if missed else (.55 if unexpected_early else 1.0))
        step += rng.normal(0, max(1.2, interval * .18))
        current += pd.Timedelta(days=max(2.0, step))
        if current >= end:
            break
        weekday_shift = (preferred_weekday - current.weekday()) % 7
        if weekday_shift > 3:
            weekday_shift -= 7
        event_date = current + pd.Timedelta(days=weekday_shift * rng.uniform(.35, .78))
        if rng.random() < .16:
            event_date += pd.Timedelta(days=int(rng.integers(-3, 4)))
        hour_ranges = {"morning": (7, 11), "afternoon": (12, 16), "evening": (17, 21), "night": (21, 24)}
        low, high = hour_ranges[preferred_period]
        timestamp = event_date.normalize() + pd.Timedelta(hours=int(rng.integers(low, high)))
        if timestamp >= end:
            continue
        capacity_scale = user["capacity"] / 9000
        amount = round(max(3, rng.normal(merchant.average_ticket_sar * np.clip(capacity_scale, .65, 1.55), merchant.average_ticket_sar * .18)), 2)
        rows.append((timestamp, preferred_period, amount))
        if rng.random() < .12 and category in {"coffee", "restaurant", "delivery"}:
            repeat_timestamp = timestamp + pd.Timedelta(days=int(rng.integers(1, 4)))
            if repeat_timestamp < end:
                rows.append((repeat_timestamp, preferred_period, round(amount * rng.uniform(.7, 1.2), 2)))
    return rows


def generate_transactions(catalog, rng):
    start, end = pd.Timestamp("2023-01-01"), pd.Timestamp(DEMO_AS_OF)
    users = ["rashid"] + [f"user_{index:03d}" for index in range(1, 220)]
    rows, transaction_id = [], 0
    for index, user_id in enumerate(users):
        user = {
            "city": "Riyadh" if user_id == "rashid" else rng.choice(CITIES),
            "capacity": 8000 if user_id == "rashid" else float(rng.lognormal(math.log(8500), .38)),
            "weekday": 4 if user_id == "rashid" else int(rng.integers(0, 7)),
            "period": "evening" if user_id == "rashid" else str(rng.choice(TIME_PERIODS)),
            "loyalty": 1.22 if user_id == "rashid" else float(rng.beta(5, 3) * .8 + .65),
        }
        preferred_categories = ["coffee", "restaurant"] if user_id == "rashid" else list(rng.choice(["coffee", "restaurant", "retail", "delivery", "grocery", "pharmacy"], size=2, replace=False))
        if user_id == "rashid":
            active = catalog[catalog.merchant_id.isin(["half_million", "barns", "albaik", "panda", "al_dawaa"])]
        else:
            active = choose_active_merchants(catalog, user["city"], preferred_categories, rng)
        for _, merchant in active.iterrows():
            pair_events = generate_pair_events(user_id, merchant, user, start, end, rng)
            for timestamp, period, amount in pair_events:
                transaction_id += 1
                rows.append({
                    "transaction_id": f"syn_txn_{transaction_id:07d}", "user_id": user_id,
                    "merchant_id": merchant.merchant_id, "category": merchant.category, "amount_sar": amount,
                    "timestamp": timestamp.isoformat(), "time_period": period, "city": user["city"],
                    "is_essential": bool(merchant.is_essential), "source_label": DATA_LABEL,
                })
        # Occasional switching/noise: real behavior includes merchants outside the habitual set.
        active_ids = set(active.merchant_id)
        alternatives = catalog[~catalog.merchant_id.isin(active_ids)]
        for _ in range(int(rng.integers(8, 19))):
            merchant = alternatives.iloc[int(rng.integers(0, len(alternatives)))]
            timestamp = start + pd.Timedelta(days=int(rng.integers(0, (end - start).days)), hours=int(rng.integers(8, 22)))
            transaction_id += 1
            rows.append({
                "transaction_id": f"syn_txn_{transaction_id:07d}", "user_id": user_id,
                "merchant_id": merchant.merchant_id, "category": merchant.category,
                "amount_sar": round(max(3, rng.normal(merchant.average_ticket_sar, merchant.average_ticket_sar * .25)), 2),
                "timestamp": timestamp.isoformat(), "time_period": str(rng.choice(TIME_PERIODS)), "city": user["city"],
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
    summary = {
        "datasetVersion": DATASET_VERSION, "label": DATA_LABEL, "merchants": len(catalog),
        "campaigns": len(campaigns), "transactions": len(transactions),
        "users": int(transactions.user_id.nunique()), "seed": RANDOM_SEED,
        "dateRange": {"start": str(min(campaigns.start_date.min(), transactions.timestamp.min())), "end": str(max(campaigns.start_date.max(), transactions.timestamp.max()))},
    }
    (DATA_DIR / "generation_summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    generate()
