from .features import public_pattern
from .offer_model import predict_offer
from .purchase_model import predict_purchase
from .settings import DATA_LABEL, DISCLAIMER_AR, MIN_SAVING_SAR, OFFER_THRESHOLD, RECOMMENDATION_THRESHOLD


def confidence(probability):
    return "high" if probability >= 0.75 else "medium" if probability >= 0.5 else "low"


def estimated_saving(merchant, offer_probability):
    # Delay value is based on a small, documented category basket rather than one receipt.
    # This remains an estimate, never a guarantee or a campaign fact.
    basket_multiplier = {"coffee": 3.5, "restaurant": 2.5}.get(merchant.category, 1.0)
    raw = float(merchant.average_ticket_sar) * basket_multiplier * float(merchant.base_discount_pct) / 100 * (0.75 + 0.25 * offer_probability)
    # Presentation values are basket estimates, so use stable 5-SAR bands
    # rather than implying receipt-level precision.
    return float(max(5, round(raw / 5) * 5))


def offer_payload(bundle, campaigns, merchant, as_of, window_days=7):
    row, probability = predict_offer(bundle, campaigns, merchant, as_of, window_days)
    reasons = []
    if row["same_season_campaigns"]:
        reasons.append(f"ظهرت {row['same_season_campaigns']} حملات تجريبية في الموسم نفسه سابقاً")
    if row["campaigns_365d"]:
        reasons.append(f"سُجلت {row['campaigns_365d']} حملات تجريبية خلال آخر 365 يوماً")
    if row["days_until_occasion"] <= 14:
        reasons.append(f"تفصل {max(0, row['days_until_occasion'])} أيام عن {row['occasion_name_ar']}")
    reasons.append("الاحتمال محسوب بنموذج تعلم آلي على بيانات اصطناعية")
    return {
        "merchantId": merchant.merchant_id, "merchantNameAr": merchant.name_ar, "merchantNameEn": merchant.name_en,
        "offerProbability": round(probability, 4), "windowDays": int(window_days),
        "estimatedSavingSar": estimated_saving(merchant, probability), "occasion": row["occasion_name_ar"],
        "confidence": confidence(probability), "reasons": reasons[:3], "dataLabel": DATA_LABEL,
    }, row


def purchase_patterns(purchase_bundle, transactions, catalog, user_id, as_of):
    patterns = []
    for _, merchant in catalog.iterrows():
        row, probability = predict_purchase(purchase_bundle, transactions, merchant, user_id, as_of)
        patterns.append(public_pattern(row, merchant, probability))
    return sorted(patterns, key=lambda item: (-item["purchaseProbability7d"], item["merchantId"]))


def recommendations(offer_bundle, purchase_bundle, campaigns, transactions, catalog, user_id, as_of, decisions=None, window_days=7):
    decisions, ranked = decisions or set(), []
    for _, merchant in catalog.iterrows():
        offer, _ = offer_payload(offer_bundle, campaigns, merchant, as_of, window_days)
        purchase_row, purchase_probability = predict_purchase(purchase_bundle, transactions, merchant, user_id, as_of)
        saving = offer["estimatedSavingSar"]
        budget_relevance = min(1.0, float(purchase_row["merchant_spending_share"]) * 8 + float(purchase_row["category_spending_share"]) * 1.5)
        normalized_saving = min(1.0, saving / 60)
        score = float(offer["offerProbability"]) * purchase_probability * budget_relevance * normalized_saving
        eligible = not bool(merchant.is_essential) and merchant.merchant_id not in decisions and offer["offerProbability"] >= float(offer_bundle["threshold"]) and purchase_probability >= float(purchase_bundle["threshold"]) and saving >= MIN_SAVING_SAR and score >= RECOMMENDATION_THRESHOLD
        sar_saving = f"\u2066⃁ {saving:g}\u2069"
        explanation = f"احتمال العرض {offer['offerProbability']:.0%} وملاءمة الشراء {purchase_probability:.0%}، مع توفير تقديري {sar_saving}"
        ranked.append({
            "userId": user_id, "merchantId": merchant.merchant_id, "merchant": merchant.name_en,
            "merchantNameAr": merchant.name_ar, "category": merchant.category,
            "offerProbability": offer["offerProbability"], "purchaseProbability": round(purchase_probability, 4),
            "personalizedScore": round(score, 4), "windowDays": int(window_days), "estimatedSavingSar": saving,
            "occasion": offer["occasion"], "eligible": eligible,
            "isEssential": bool(merchant.is_essential),
            "action": "wait_for_offer" if eligible else "not_relevant",
            "explanation": explanation,
            "suppressionReason": "essential_purchase" if bool(merchant.is_essential) else ("prior_decision" if merchant.merchant_id in decisions else (None if eligible else "threshold_not_met")),
            "reasons": [*(public_pattern(purchase_row, merchant, purchase_probability)["reasons"][:1]), *(offer["reasons"][:1]), f"تأجيل عملية غير أساسية حتى {offer['windowDays']} أيام قد يوفر نحو {sar_saving}"],
            "disclaimer": DISCLAIMER_AR, "dataLabel": DATA_LABEL,
        })
    return sorted(ranked, key=lambda item: (-item["personalizedScore"], item["merchantId"]))
