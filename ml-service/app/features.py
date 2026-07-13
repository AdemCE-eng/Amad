from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import math
import pandas as pd

from .settings import DATA_DIR


OFFER_NUMERIC = [
    "month", "weekday", "days_until_occasion", "campaigns_30d",
    "campaigns_90d", "campaigns_365d", "avg_interval_days",
    "same_season_campaigns", "previous_discount_pct", "avg_duration_days",
    "salary_day_proximity", "ramadan", "eid_fitr", "eid_adha",
    "national_day", "founding_day", "back_to_school", "riyadh_season",
]
OFFER_CATEGORICAL = ["merchant_id", "category", "city", "occasion"]
PURCHASE_NUMERIC = [
    "days_since_last_purchase", "purchases_7d", "purchases_30d",
    "purchases_90d", "average_transaction_sar", "merchant_spending_share",
    "category_spending_share", "weekday_match_rate", "time_period_match_rate",
    "interval_consistency", "recency_score", "frequency_score", "monetary_score",
    "seasonal_purchase_rate", "salary_day_rate",
]
PURCHASE_CATEGORICAL = ["user_id", "merchant_id", "category", "city", "preferred_weekday", "preferred_time_period"]

DAY_NAMES_AR = {
    0: "الاثنين", 1: "الثلاثاء", 2: "الأربعاء", 3: "الخميس",
    4: "الجمعة", 5: "السبت", 6: "الأحد",
}


@dataclass(frozen=True)
class Occasion:
    key: str
    name_ar: str
    date: pd.Timestamp


def load_data(data_dir: Path = DATA_DIR):
    catalog = pd.read_csv(data_dir / "merchant_catalog.csv")
    campaigns = pd.read_csv(data_dir / "merchant_campaigns.csv", parse_dates=["start_date", "end_date"])
    transactions = pd.read_csv(data_dir / "user_transactions.csv", parse_dates=["timestamp"])
    return catalog, campaigns, transactions


def occasions_for_year(year: int) -> list[Occasion]:
    # Dates are synthetic demo anchors and make no factual merchant-campaign claim.
    movable = {
        2022: ("2022-04-02", "2022-05-02", "2022-07-09"),
        2023: ("2023-03-23", "2023-04-21", "2023-06-28"),
        2024: ("2024-03-11", "2024-04-10", "2024-06-16"),
        2025: ("2025-03-01", "2025-03-30", "2025-06-06"),
        2026: ("2026-02-18", "2026-03-20", "2026-05-27"),
    }
    ramadan, fitr, adha = movable.get(year, (f"{year}-02-18", f"{year}-03-20", f"{year}-05-27"))
    values = [
        ("founding_day", "يوم التأسيس السعودي", f"{year}-02-22"),
        ("ramadan", "رمضان", ramadan),
        ("eid_fitr", "عيد الفطر", fitr),
        ("eid_adha", "عيد الأضحى", adha),
        ("back_to_school", "العودة إلى المدارس", f"{year}-08-23"),
        ("national_day", "اليوم الوطني السعودي", f"{year}-09-23"),
        ("riyadh_season", "موسم الرياض", f"{year}-10-15"),
    ]
    return [Occasion(k, ar, pd.Timestamp(d)) for k, ar, d in values]


def nearest_occasion(as_of) -> Occasion:
    date = pd.Timestamp(as_of).normalize()
    candidates = occasions_for_year(date.year) + occasions_for_year(date.year + 1)
    future = [item for item in candidates if item.date >= date - pd.Timedelta(days=5)]
    return min(future, key=lambda item: abs((item.date - date).days))


def _safe_mean(values, default=0.0):
    return float(values.mean()) if len(values) else float(default)


def offer_feature_row(campaigns: pd.DataFrame, merchant: pd.Series, as_of, window_days: int = 7) -> dict:
    date = pd.Timestamp(as_of).normalize()
    history = campaigns[(campaigns.merchant_id == merchant.merchant_id) & (campaigns.start_date < date)].sort_values("start_date")
    occasion = nearest_occasion(date)
    intervals = history.start_date.diff().dt.days.dropna()
    row = {
        "as_of_date": date,
        "merchant_id": merchant.merchant_id,
        "category": merchant.category,
        "city": merchant.city,
        "occasion": occasion.key,
        "occasion_name_ar": occasion.name_ar,
        "month": date.month,
        "weekday": date.weekday(),
        "days_until_occasion": max(-5, min(180, (occasion.date - date).days)),
        "campaigns_30d": int((history.start_date >= date - pd.Timedelta(days=30)).sum()),
        "campaigns_90d": int((history.start_date >= date - pd.Timedelta(days=90)).sum()),
        "campaigns_365d": int((history.start_date >= date - pd.Timedelta(days=365)).sum()),
        "avg_interval_days": _safe_mean(intervals, 180),
        "same_season_campaigns": int((history.occasion == occasion.key).sum()),
        "previous_discount_pct": _safe_mean(history.discount_pct.tail(3), merchant.base_discount_pct),
        "avg_duration_days": _safe_mean(history.duration_days.tail(5), 4),
        "salary_day_proximity": min(abs(date.day - 25), abs(date.day - 27)),
        "ramadan": int(occasion.key == "ramadan" and abs((occasion.date - date).days) <= 30),
        "eid_fitr": int(occasion.key == "eid_fitr" and abs((occasion.date - date).days) <= 21),
        "eid_adha": int(occasion.key == "eid_adha" and abs((occasion.date - date).days) <= 21),
        "national_day": int(occasion.key == "national_day" and abs((occasion.date - date).days) <= 30),
        "founding_day": int(occasion.key == "founding_day" and abs((occasion.date - date).days) <= 30),
        "back_to_school": int(occasion.key == "back_to_school" and abs((occasion.date - date).days) <= 30),
        "riyadh_season": int(occasion.key == "riyadh_season" and abs((occasion.date - date).days) <= 30),
    }
    future = campaigns[
        (campaigns.merchant_id == merchant.merchant_id)
        & (campaigns.start_date >= date)
        & (campaigns.start_date <= date + pd.Timedelta(days=window_days))
    ]
    row["target"] = int(not future.empty)
    return row


def build_offer_examples(campaigns: pd.DataFrame, catalog: pd.DataFrame, window_days: int = 7) -> pd.DataFrame:
    snapshots = pd.date_range(campaigns.start_date.min().normalize(), campaigns.start_date.max().normalize(), freq="7D")
    return pd.DataFrame([offer_feature_row(campaigns, merchant, date, window_days) for date in snapshots for _, merchant in catalog.iterrows()])


def _mode_or(series, fallback: str) -> str:
    modes = series.mode()
    return str(modes.iloc[0]) if not modes.empty else fallback


def purchase_feature_row(transactions: pd.DataFrame, catalog_row: pd.Series, user_id: str, as_of) -> dict:
    date = pd.Timestamp(as_of)
    prior = transactions[(transactions.user_id == user_id) & (transactions.timestamp < date)].copy()
    merchant_history = prior[prior.merchant_id == catalog_row.merchant_id].sort_values("timestamp")
    category_history = prior[prior.category == catalog_row.category]
    total_spend = float(prior.amount_sar.sum())
    intervals = merchant_history.timestamp.diff().dt.total_seconds().div(86400).dropna()
    preferred_weekday = _mode_or(merchant_history.timestamp.dt.weekday, "4")
    preferred_period = _mode_or(merchant_history.time_period, "evening")
    days_since = int((date - merchant_history.timestamp.max()).days) if len(merchant_history) else 999
    avg_interval = _safe_mean(intervals, 90)
    consistency = 1 / (1 + (_safe_mean((intervals - avg_interval).abs(), 90) / max(avg_interval, 1)))
    seasonal = merchant_history[merchant_history.timestamp.dt.month == date.month]
    salary_hits = merchant_history[merchant_history.timestamp.dt.day.between(24, 28)]
    amount_avg = _safe_mean(merchant_history.amount_sar, catalog_row.average_ticket_sar)
    return {
        "as_of_date": date.normalize(), "user_id": user_id,
        "merchant_id": catalog_row.merchant_id, "category": catalog_row.category, "city": catalog_row.city,
        "preferred_weekday": preferred_weekday, "preferred_time_period": preferred_period,
        "days_since_last_purchase": min(days_since, 999),
        "purchases_7d": int((merchant_history.timestamp >= date - pd.Timedelta(days=7)).sum()),
        "purchases_30d": int((merchant_history.timestamp >= date - pd.Timedelta(days=30)).sum()),
        "purchases_90d": int((merchant_history.timestamp >= date - pd.Timedelta(days=90)).sum()),
        "average_transaction_sar": amount_avg,
        "merchant_spending_share": float(merchant_history.amount_sar.sum() / total_spend) if total_spend else 0,
        "category_spending_share": float(category_history.amount_sar.sum() / total_spend) if total_spend else 0,
        "weekday_match_rate": float((merchant_history.timestamp.dt.weekday == date.weekday()).mean()) if len(merchant_history) else 0,
        "time_period_match_rate": float((merchant_history.time_period == preferred_period).mean()) if len(merchant_history) else 0,
        "interval_consistency": float(consistency),
        "recency_score": float(math.exp(-days_since / 30)) if days_since < 999 else 0,
        "frequency_score": min(1.0, len(merchant_history) / 30),
        "monetary_score": min(1.0, amount_avg / max(float(catalog_row.average_ticket_sar) * 1.5, 1)),
        "seasonal_purchase_rate": float(len(seasonal) / max(len(merchant_history), 1)),
        "salary_day_rate": float(len(salary_hits) / max(len(merchant_history), 1)),
    }


def build_purchase_examples(transactions: pd.DataFrame, catalog: pd.DataFrame) -> pd.DataFrame:
    start = transactions.timestamp.min().normalize() + pd.Timedelta(days=90)
    end = transactions.timestamp.max().normalize() - pd.Timedelta(days=7)
    rows = []
    for date in pd.date_range(start, end, freq="7D"):
        for user_id in sorted(transactions.user_id.unique()):
            for _, merchant in catalog.iterrows():
                row = purchase_feature_row(transactions, merchant, user_id, date)
                future = transactions[(transactions.user_id == user_id) & (transactions.merchant_id == merchant.merchant_id) & (transactions.timestamp >= date) & (transactions.timestamp < date + pd.Timedelta(days=7))]
                row["target"] = int(not future.empty)
                rows.append(row)
    return pd.DataFrame(rows)


def public_pattern(row: dict, merchant: pd.Series, probability: float) -> dict:
    weekday = int(row["preferred_weekday"]) if str(row["preferred_weekday"]).isdigit() else 4
    reasons = []
    if row["purchases_30d"]:
        reasons.append(f"تكرر الشراء {int(row['purchases_30d'])} مرة خلال آخر 30 يوماً")
    if row["days_since_last_purchase"] < 14:
        reasons.append("يوجد شراء حديث من هذا التاجر ضمن البيانات التجريبية")
    if row["interval_consistency"] >= 0.55:
        reasons.append("فواصل الشراء السابقة منتظمة نسبياً")
    return {
        "merchantId": merchant.merchant_id, "merchantNameAr": merchant.name_ar,
        "merchantNameEn": merchant.name_en, "category": merchant.category,
        "purchaseProbability7d": round(float(probability), 4), "frequency30d": int(row["purchases_30d"]),
        "usualDay": DAY_NAMES_AR.get(weekday, "الجمعة"), "usualTimePeriod": str(row["preferred_time_period"]),
        "averageSpendSar": round(float(row["average_transaction_sar"]), 2),
        "isEssential": bool(merchant.is_essential), "reasons": reasons[:3],
    }

