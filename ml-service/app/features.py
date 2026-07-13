from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import math
import numpy as np
import pandas as pd

from .settings import DATA_DIR, DATA_START, DEMO_AS_OF


OFFER_NUMERIC = [
    "month", "weekday", "days_until_occasion", "campaigns_30d", "campaigns_90d",
    "campaigns_365d", "recent_campaign_rate", "avg_interval_days", "days_since_last_campaign",
    "same_season_campaigns", "previous_discount_pct", "discount_trend", "avg_duration_days",
    "salary_day_proximity", "merchant_campaign_propensity", "near_occasion", "seasonal_focus_match",
    "historical_campaign_rate", "occasion_campaign_share", "campaign_due_ratio", "ramadan", "eid_fitr", "eid_adha",
    "national_day", "founding_day", "back_to_school", "riyadh_season",
]
OFFER_CATEGORICAL = ["merchant_id", "category", "city", "occasion", "category_season", "merchant_occasion"]
PURCHASE_NUMERIC = [
    "days_since_last_purchase", "purchases_7d", "purchases_30d", "purchases_90d",
    "average_transaction_sar", "merchant_spending_share", "category_spending_share",
    "weekday_match_rate", "time_period_match_rate", "avg_interval_days", "interval_std_days",
    "interval_consistency", "recency_score", "frequency_score", "monetary_score",
    "merchant_loyalty_score", "category_affinity_score", "weekend_preference",
    "seasonal_purchase_rate", "salary_day_rate", "recency_frequency_interaction",
    "user_baseline_activity_30d", "merchant_baseline_popularity_30d", "purchase_due_ratio",
    "overdue_days", "expected_purchase_proximity", "recent_frequency_trend", "weekday_preference_strength",
]
PURCHASE_CATEGORICAL = ["merchant_id", "category", "city", "preferred_weekday", "preferred_time_period", "city_merchant"]

DAY_NAMES_AR = {0: "الاثنين", 1: "الثلاثاء", 2: "الأربعاء", 3: "الخميس", 4: "الجمعة", 5: "السبت", 6: "الأحد"}
TIME_PERIODS = ["morning", "afternoon", "evening", "night"]
NS_DAY = 86_400_000_000_000


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


def occasions_for_year(year: int):
    movable = {
        2022: ("2022-04-02", "2022-05-02", "2022-07-09"), 2023: ("2023-03-23", "2023-04-21", "2023-06-28"),
        2024: ("2024-03-11", "2024-04-10", "2024-06-16"), 2025: ("2025-03-01", "2025-03-30", "2025-06-06"),
        2026: ("2026-02-18", "2026-03-20", "2026-05-27"),
    }
    ramadan, fitr, adha = movable.get(year, (f"{year}-02-18", f"{year}-03-20", f"{year}-05-27"))
    values = [
        ("founding_day", "يوم التأسيس السعودي", f"{year}-02-22"), ("ramadan", "رمضان", ramadan),
        ("eid_fitr", "عيد الفطر", fitr), ("eid_adha", "عيد الأضحى", adha),
        ("back_to_school", "العودة إلى المدارس", f"{year}-08-23"),
        ("national_day", "اليوم الوطني السعودي", f"{year}-09-23"),
        ("riyadh_season", "موسم الرياض", f"{year}-10-15"),
    ]
    return [Occasion(key, name, pd.Timestamp(date)) for key, name, date in values]


def nearest_occasion(as_of):
    date = pd.Timestamp(as_of).normalize()
    candidates = occasions_for_year(date.year) + occasions_for_year(date.year + 1)
    future = [item for item in candidates if item.date >= date - pd.Timedelta(days=5)]
    return min(future, key=lambda item: abs((item.date - date).days))


def _safe_mean(values, default=0.0):
    return float(values.mean()) if len(values) else float(default)


def offer_feature_row(campaigns, merchant, as_of, window_days=7):
    date = pd.Timestamp(as_of).normalize()
    history = campaigns[(campaigns.merchant_id == merchant.merchant_id) & (campaigns.start_date < date)].sort_values("start_date")
    occasion = nearest_occasion(date)
    intervals = history.start_date.diff().dt.days.dropna()
    recent_discounts = history.discount_pct.tail(4)
    previous_discount = _safe_mean(recent_discounts, merchant.base_discount_pct)
    discount_trend = float(recent_discounts.iloc[-1] - recent_discounts.iloc[:-1].mean()) if len(recent_discounts) > 1 else 0.0
    days_since = int((date - history.start_date.max()).days) if len(history) else 365
    campaigns_90 = int((history.start_date >= date - pd.Timedelta(days=90)).sum())
    avg_campaign_interval = _safe_mean(intervals.tail(12), 90)
    history_weeks = max(1, (date - pd.Timestamp(DATA_START)).days / 7)
    row = {
        "as_of_date": date, "merchant_id": merchant.merchant_id, "category": merchant.category,
        "city": merchant.city, "occasion": occasion.key, "occasion_name_ar": occasion.name_ar,
        "category_season": f"{merchant.category}|{occasion.key}", "merchant_occasion": f"{merchant.merchant_id}|{occasion.key}",
        "month": date.month, "weekday": date.weekday(), "days_until_occasion": max(-5, min(180, (occasion.date - date).days)),
        "campaigns_30d": int((history.start_date >= date - pd.Timedelta(days=30)).sum()),
        "campaigns_90d": campaigns_90, "campaigns_365d": int((history.start_date >= date - pd.Timedelta(days=365)).sum()),
        "recent_campaign_rate": campaigns_90 / 3.0, "avg_interval_days": avg_campaign_interval,
        "days_since_last_campaign": min(days_since, 365), "same_season_campaigns": int((history.occasion == occasion.key).sum()),
        "previous_discount_pct": previous_discount, "discount_trend": discount_trend,
        "avg_duration_days": _safe_mean(history.duration_days.tail(8), 4),
        "salary_day_proximity": min(abs(date.day - 25), abs(date.day - 27)),
        "merchant_campaign_propensity": float(merchant.campaign_propensity),
        "near_occasion": int(abs((occasion.date - date).days) <= 24),
        "seasonal_focus_match": int(str(merchant.seasonal_focus) == occasion.key),
        "historical_campaign_rate": float(len(history) / history_weeks),
        "occasion_campaign_share": float((history.occasion == occasion.key).sum() / max(1, len(history))),
        "campaign_due_ratio": float(min(5, days_since / max(avg_campaign_interval, 1))),
        "ramadan": int(occasion.key == "ramadan" and abs((occasion.date - date).days) <= 30),
        "eid_fitr": int(occasion.key == "eid_fitr" and abs((occasion.date - date).days) <= 21),
        "eid_adha": int(occasion.key == "eid_adha" and abs((occasion.date - date).days) <= 21),
        "national_day": int(occasion.key == "national_day" and abs((occasion.date - date).days) <= 30),
        "founding_day": int(occasion.key == "founding_day" and abs((occasion.date - date).days) <= 30),
        "back_to_school": int(occasion.key == "back_to_school" and abs((occasion.date - date).days) <= 30),
        "riyadh_season": int(occasion.key == "riyadh_season" and abs((occasion.date - date).days) <= 30),
    }
    future = campaigns[(campaigns.merchant_id == merchant.merchant_id) & (campaigns.start_date >= date) & (campaigns.start_date < date + pd.Timedelta(days=window_days))]
    row["target"] = int(not future.empty)
    return row


def build_offer_examples(campaigns, catalog, window_days=7):
    end = pd.Timestamp(DEMO_AS_OF) - pd.Timedelta(days=6)
    snapshots = pd.date_range(DATA_START, end, freq="W-MON")
    return pd.DataFrame([offer_feature_row(campaigns, merchant, date, window_days) for date in snapshots for _, merchant in catalog.iterrows()])


def _mode_or(series, fallback):
    modes = series.mode()
    return str(modes.iloc[0]) if not modes.empty else fallback


def purchase_feature_row(transactions, catalog_row, user_id, as_of):
    date = pd.Timestamp(as_of)
    prior = transactions[(transactions.user_id == user_id) & (transactions.timestamp < date)].copy()
    merchant_history = prior[prior.merchant_id == catalog_row.merchant_id].sort_values("timestamp")
    category_history = prior[prior.category == catalog_row.category]
    global_merchant = transactions[(transactions.merchant_id == catalog_row.merchant_id) & (transactions.timestamp < date)]
    total_spend = float(prior.amount_sar.sum())
    intervals = merchant_history.timestamp.diff().dt.total_seconds().div(86400).dropna()
    preferred_weekday = _mode_or(merchant_history.timestamp.dt.weekday, "4")
    preferred_period = _mode_or(merchant_history.time_period, "evening")
    days_since = int((date - merchant_history.timestamp.max()).days) if len(merchant_history) else 999
    avg_interval, interval_std = _safe_mean(intervals, 90), float(intervals.std(ddof=0)) if len(intervals) > 1 else 45.0
    consistency = 1 / (1 + interval_std / max(avg_interval, 1))
    amount_avg = _safe_mean(merchant_history.amount_sar, catalog_row.average_ticket_sar)
    purchases_30 = int((merchant_history.timestamp >= date - pd.Timedelta(days=30)).sum())
    merchant_share = float(merchant_history.amount_sar.sum() / total_spend) if total_spend else 0
    category_share = float(category_history.amount_sar.sum() / total_spend) if total_spend else 0
    purchases_90 = int((merchant_history.timestamp >= date - pd.Timedelta(days=90)).sum())
    due_ratio = days_since / max(avg_interval, 1)
    return {
        "as_of_date": date.normalize(), "user_id": user_id, "merchant_id": catalog_row.merchant_id,
        "category": catalog_row.category, "city": catalog_row.city, "preferred_weekday": preferred_weekday,
        "preferred_time_period": preferred_period, "city_merchant": f"{catalog_row.city}|{catalog_row.merchant_id}",
        "days_since_last_purchase": min(days_since, 999),
        "purchases_7d": int((merchant_history.timestamp >= date - pd.Timedelta(days=7)).sum()),
        "purchases_30d": purchases_30, "purchases_90d": purchases_90,
        "average_transaction_sar": amount_avg, "merchant_spending_share": merchant_share,
        "category_spending_share": category_share,
        "weekday_match_rate": float((merchant_history.timestamp.dt.weekday == date.weekday()).mean()) if len(merchant_history) else 0,
        "time_period_match_rate": float((merchant_history.time_period == preferred_period).mean()) if len(merchant_history) else 0,
        "avg_interval_days": avg_interval, "interval_std_days": interval_std, "interval_consistency": consistency,
        "recency_score": math.exp(-days_since / 30) if days_since < 999 else 0,
        "frequency_score": min(1.0, len(merchant_history) / 40),
        "monetary_score": min(1.0, amount_avg / max(float(catalog_row.average_ticket_sar) * 1.5, 1)),
        "merchant_loyalty_score": merchant_share, "category_affinity_score": category_share,
        "weekend_preference": float(merchant_history.timestamp.dt.weekday.isin([4, 5]).mean()) if len(merchant_history) else 0,
        "seasonal_purchase_rate": float((merchant_history.timestamp.dt.month == date.month).mean()) if len(merchant_history) else 0,
        "salary_day_rate": float(merchant_history.timestamp.dt.day.between(24, 28).mean()) if len(merchant_history) else 0,
        "recency_frequency_interaction": math.exp(-days_since / 30) * min(1, purchases_30 / 4) if days_since < 999 else 0,
        "user_baseline_activity_30d": int((prior.timestamp >= date - pd.Timedelta(days=30)).sum()),
        "merchant_baseline_popularity_30d": int((global_merchant.timestamp >= date - pd.Timedelta(days=30)).sum()) / max(1, transactions.user_id.nunique()),
        "purchase_due_ratio": min(5, due_ratio), "overdue_days": max(0, days_since - avg_interval),
        "expected_purchase_proximity": math.exp(-abs(days_since - avg_interval) / max(2, interval_std + 2)),
        "recent_frequency_trend": purchases_30 - purchases_90 / 3,
        "weekday_preference_strength": float(merchant_history.timestamp.dt.weekday.value_counts(normalize=True).max()) if len(merchant_history) else 0,
    }


def _cumulative_one_hot(values, size):
    matrix = np.zeros((len(values), size), dtype=np.int32)
    matrix[np.arange(len(values)), values] = 1
    return np.vstack([np.zeros((1, size), dtype=np.int32), np.cumsum(matrix, axis=0)])


def _prefix_amounts(frame):
    return np.concatenate([[0.0], np.cumsum(frame.amount_sar.to_numpy(float))])


def build_purchase_examples(transactions, catalog):
    transactions = transactions.sort_values("timestamp").copy()
    transactions["weekday"] = transactions.timestamp.dt.weekday
    transactions["month"] = transactions.timestamp.dt.month - 1
    transactions["salary_period"] = transactions.timestamp.dt.day.between(24, 28).astype(int)
    transactions["weekend"] = transactions.weekday.isin([4, 5]).astype(int)
    period_map = {value: index for index, value in enumerate(TIME_PERIODS)}
    catalog_by_id = catalog.set_index("merchant_id")
    start = transactions.timestamp.min().normalize() + pd.Timedelta(days=120)
    end = transactions.timestamp.max().normalize() - pd.Timedelta(days=7)
    snapshots = pd.date_range(start, end, freq="7D")
    snapshot_ns = snapshots.to_numpy(dtype="datetime64[ns]").astype(np.int64)

    user_cache, category_cache, merchant_cache = {}, {}, {}
    for user_id, frame in transactions.groupby("user_id", sort=False):
        frame = frame.sort_values("timestamp")
        user_cache[user_id] = (frame.timestamp.to_numpy(dtype="datetime64[ns]").astype(np.int64), _prefix_amounts(frame))
    for key, frame in transactions.groupby(["user_id", "category"], sort=False):
        frame = frame.sort_values("timestamp")
        category_cache[key] = (frame.timestamp.to_numpy(dtype="datetime64[ns]").astype(np.int64), _prefix_amounts(frame))
    for merchant_id, frame in transactions.groupby("merchant_id", sort=False):
        merchant_cache[merchant_id] = np.sort(frame.timestamp.to_numpy(dtype="datetime64[ns]").astype(np.int64))

    rows = []
    user_count = max(1, transactions.user_id.nunique())
    for (user_id, merchant_id), frame in transactions.groupby(["user_id", "merchant_id"], sort=False):
        if len(frame) < 8 or merchant_id not in catalog_by_id.index:
            continue
        frame = frame.sort_values("timestamp")
        merchant = catalog_by_id.loc[merchant_id]
        times = frame.timestamp.to_numpy(dtype="datetime64[ns]").astype(np.int64)
        amounts = frame.amount_sar.to_numpy(float)
        history_index = np.searchsorted(times, snapshot_ns, side="left")
        future_index = np.searchsorted(times, snapshot_ns + 7 * NS_DAY, side="left")
        valid = history_index >= 3
        if not valid.any():
            continue
        dates = snapshots[valid]
        snap = snapshot_ns[valid]
        idx = history_index[valid]
        future = future_index[valid]
        prefix_amount = np.concatenate([[0.0], np.cumsum(amounts)])
        intervals = np.diff(times) / NS_DAY
        interval_prefix = np.concatenate([[0.0], np.cumsum(intervals)])
        interval_sq_prefix = np.concatenate([[0.0], np.cumsum(intervals ** 2)])
        interval_count = np.maximum(idx - 1, 1)
        interval_sum = interval_prefix[idx - 1]
        interval_sq_sum = interval_sq_prefix[idx - 1]
        avg_interval = interval_sum / interval_count
        interval_variance = np.maximum(0, interval_sq_sum / interval_count - avg_interval ** 2)
        interval_std = np.sqrt(interval_variance)
        weekday_cum = _cumulative_one_hot(frame.weekday.to_numpy(int), 7)[idx]
        period_values = frame.time_period.map(period_map).fillna(2).to_numpy(int)
        period_cum = _cumulative_one_hot(period_values, len(TIME_PERIODS))[idx]
        month_cum = _cumulative_one_hot(frame.month.to_numpy(int), 12)[idx]
        salary_prefix = np.concatenate([[0], np.cumsum(frame.salary_period.to_numpy(int))])
        weekend_prefix = np.concatenate([[0], np.cumsum(frame.weekend.to_numpy(int))])
        user_times, user_amount_prefix = user_cache[user_id]
        user_idx = np.searchsorted(user_times, snap, side="left")
        user_total = user_amount_prefix[user_idx]
        user_30 = user_idx - np.searchsorted(user_times, snap - 30 * NS_DAY, side="left")
        category_times, category_amount_prefix = category_cache[(user_id, merchant.category)]
        category_idx = np.searchsorted(category_times, snap, side="left")
        category_total = category_amount_prefix[category_idx]
        global_times = merchant_cache[merchant_id]
        global_idx = np.searchsorted(global_times, snap, side="left")
        global_30 = global_idx - np.searchsorted(global_times, snap - 30 * NS_DAY, side="left")
        last_time = times[idx - 1]
        days_since = (snap - last_time) / NS_DAY
        count_7 = idx - np.searchsorted(times, snap - 7 * NS_DAY, side="left")
        count_30 = idx - np.searchsorted(times, snap - 30 * NS_DAY, side="left")
        count_90 = idx - np.searchsorted(times, snap - 90 * NS_DAY, side="left")
        current_weekday = dates.weekday.to_numpy()
        current_month = dates.month.to_numpy() - 1
        preferred_weekday = weekday_cum.argmax(axis=1)
        preferred_period_index = period_cum.argmax(axis=1)
        merchant_share = np.divide(prefix_amount[idx], user_total, out=np.zeros_like(user_total), where=user_total > 0)
        category_share = np.divide(category_total, user_total, out=np.zeros_like(user_total), where=user_total > 0)
        recency = np.exp(-days_since / 30)
        for pos in range(len(dates)):
            hist_count = int(idx[pos])
            rows.append({
                "as_of_date": dates[pos].normalize(), "user_id": user_id, "merchant_id": merchant_id,
                "category": merchant.category, "city": merchant.city,
                "preferred_weekday": str(int(preferred_weekday[pos])),
                "preferred_time_period": TIME_PERIODS[int(preferred_period_index[pos])],
                "city_merchant": f"{merchant.city}|{merchant_id}",
                "days_since_last_purchase": float(min(days_since[pos], 999)), "purchases_7d": int(count_7[pos]),
                "purchases_30d": int(count_30[pos]), "purchases_90d": int(count_90[pos]),
                "average_transaction_sar": float(prefix_amount[idx[pos]] / hist_count),
                "merchant_spending_share": float(merchant_share[pos]), "category_spending_share": float(category_share[pos]),
                "weekday_match_rate": float(weekday_cum[pos, current_weekday[pos]] / hist_count),
                "time_period_match_rate": float(period_cum[pos, preferred_period_index[pos]] / hist_count),
                "avg_interval_days": float(avg_interval[pos]), "interval_std_days": float(interval_std[pos]),
                "interval_consistency": float(1 / (1 + interval_std[pos] / max(avg_interval[pos], 1))),
                "recency_score": float(recency[pos]), "frequency_score": float(min(1, count_90[pos] / 12)),
                "monetary_score": float(min(1, (prefix_amount[idx[pos]] / hist_count) / max(float(merchant.average_ticket_sar) * 1.5, 1))),
                "merchant_loyalty_score": float(merchant_share[pos]), "category_affinity_score": float(category_share[pos]),
                "weekend_preference": float(weekend_prefix[idx[pos]] / hist_count),
                "seasonal_purchase_rate": float(month_cum[pos, current_month[pos]] / hist_count),
                "salary_day_rate": float(salary_prefix[idx[pos]] / hist_count),
                "recency_frequency_interaction": float(recency[pos] * min(1, count_30[pos] / 4)),
                "user_baseline_activity_30d": int(user_30[pos]),
                "merchant_baseline_popularity_30d": float(global_30[pos] / user_count),
                "purchase_due_ratio": float(min(5, days_since[pos] / max(avg_interval[pos], 1))),
                "overdue_days": float(max(0, days_since[pos] - avg_interval[pos])),
                "expected_purchase_proximity": float(np.exp(-abs(days_since[pos] - avg_interval[pos]) / max(2, interval_std[pos] + 2))),
                "recent_frequency_trend": float(count_30[pos] - count_90[pos] / 3),
                "weekday_preference_strength": float(weekday_cum[pos].max() / hist_count),
                "target": int(future[pos] > idx[pos]),
            })
    return pd.DataFrame(rows)


def public_pattern(row, merchant, probability):
    weekday = int(row["preferred_weekday"]) if str(row["preferred_weekday"]).isdigit() else 4
    reasons = []
    if row["purchases_30d"]:
        reasons.append(f"تكرر الشراء {int(row['purchases_30d'])} مرة خلال آخر 30 يوماً")
    if row["days_since_last_purchase"] < 14:
        reasons.append("يوجد شراء حديث من هذا التاجر ضمن البيانات التجريبية")
    if row["interval_consistency"] >= .55:
        reasons.append("فواصل الشراء السابقة منتظمة نسبياً")
    return {
        "merchantId": merchant.merchant_id, "merchantNameAr": merchant.name_ar, "merchantNameEn": merchant.name_en,
        "category": merchant.category, "purchaseProbability7d": round(float(probability), 4),
        "frequency30d": int(row["purchases_30d"]), "usualDay": DAY_NAMES_AR.get(weekday, "الجمعة"),
        "usualTimePeriod": str(row["preferred_time_period"]), "averageSpendSar": round(float(row["average_transaction_sar"]), 2),
        "isEssential": bool(merchant.is_essential), "reasons": reasons[:3],
    }
