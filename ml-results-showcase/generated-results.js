window.NAMO_RESULTS = {
  "metrics": {
    "label": "نتائج على بيانات تجريبية من السوق السعودي",
    "dataLabel": "MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET",
    "offerModel": {
      "precision": 0.3924,
      "recall": 0.5741,
      "f1": 0.4662,
      "rocAuc": 0.8971,
      "evaluatedThreshold": 0.46,
      "testRows": 570,
      "positiveRate": 0.0947,
      "calibrationSummary": [
        {
          "range": "0.0-0.2",
          "meanPrediction": 0.0448,
          "observedRate": 0.0104,
          "count": 385
        },
        {
          "range": "0.2-0.4",
          "meanPrediction": 0.3068,
          "observedRate": 0.186,
          "count": 86
        },
        {
          "range": "0.4-0.6",
          "meanPrediction": 0.4853,
          "observedRate": 0.2742,
          "count": 62
        },
        {
          "range": "0.6-0.8",
          "meanPrediction": 0.6682,
          "observedRate": 0.4595,
          "count": 37
        }
      ]
    },
    "purchaseModel": {
      "precision": 0.1612,
      "recall": 0.6705,
      "f1": 0.2599,
      "rocAuc": 0.9037,
      "evaluatedThreshold": 0.34,
      "testRows": 2625,
      "positiveRate": 0.0335,
      "precisionAt3": 0.1429,
      "hitRateAt3": 0.9706
    }
  },
  "featureImportance": {
    "label": "نتائج على بيانات تجريبية من السوق السعودي",
    "offerModel": [
      {
        "feature": "days_until_occasion",
        "importance": 0.4608
      },
      {
        "feature": "salary_day_proximity",
        "importance": 0.0862
      },
      {
        "feature": "month",
        "importance": 0.0791
      },
      {
        "feature": "avg_interval_days",
        "importance": 0.0347
      },
      {
        "feature": "previous_discount_pct",
        "importance": 0.0315
      },
      {
        "feature": "avg_duration_days",
        "importance": 0.0302
      },
      {
        "feature": "occasion_founding_day",
        "importance": 0.0287
      },
      {
        "feature": "campaigns_90d",
        "importance": 0.0242
      },
      {
        "feature": "campaigns_365d",
        "importance": 0.0222
      },
      {
        "feature": "eid_fitr",
        "importance": 0.0141
      },
      {
        "feature": "campaigns_30d",
        "importance": 0.0139
      },
      {
        "feature": "ramadan",
        "importance": 0.0112
      },
      {
        "feature": "occasion_ramadan",
        "importance": 0.0109
      },
      {
        "feature": "same_season_campaigns",
        "importance": 0.0103
      }
    ],
    "purchaseModel": [
      {
        "feature": "days_since_last_purchase",
        "importance": 0.1481
      },
      {
        "feature": "merchant_spending_share",
        "importance": 0.1302
      },
      {
        "feature": "recency_score",
        "importance": 0.1238
      },
      {
        "feature": "frequency_score",
        "importance": 0.1018
      },
      {
        "feature": "time_period_match_rate",
        "importance": 0.0685
      },
      {
        "feature": "interval_consistency",
        "importance": 0.0669
      },
      {
        "feature": "weekday_match_rate",
        "importance": 0.0567
      },
      {
        "feature": "category_spending_share",
        "importance": 0.0386
      },
      {
        "feature": "monetary_score",
        "importance": 0.0331
      },
      {
        "feature": "purchases_90d",
        "importance": 0.0322
      },
      {
        "feature": "salary_day_rate",
        "importance": 0.0309
      },
      {
        "feature": "average_transaction_sar",
        "importance": 0.0295
      },
      {
        "feature": "seasonal_purchase_rate",
        "importance": 0.028
      },
      {
        "feature": "preferred_time_period_evening",
        "importance": 0.0149
      }
    ]
  },
  "confusionMatrices": {
    "label": "نتائج على بيانات تجريبية من السوق السعودي",
    "offerModel": {
      "labels": [
        "no campaign",
        "campaign"
      ],
      "matrix": [
        [
          468,
          48
        ],
        [
          23,
          31
        ]
      ]
    },
    "purchaseModel": {
      "labels": [
        "no purchase",
        "purchase"
      ],
      "matrix": [
        [
          2230,
          307
        ],
        [
          29,
          59
        ]
      ]
    }
  },
  "recommendationExamples": {
    "label": "نتائج على بيانات تجريبية من السوق السعودي",
    "dataLabel": "MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET",
    "userId": "rashid",
    "recommendations": [
      {
        "userId": "rashid",
        "merchantId": "half_million",
        "merchant": "Half Million",
        "merchantNameAr": "هاف مليون",
        "category": "coffee",
        "offerProbability": 0.6319,
        "purchaseProbability": 0.4563,
        "personalizedScore": 0.0733,
        "windowDays": 7,
        "estimatedSavingSar": 15.25,
        "occasion": "اليوم الوطني السعودي",
        "eligible": true,
        "suppressionReason": null,
        "reasons": [
          "فواصل الشراء السابقة منتظمة نسبياً",
          "ظهرت 4 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 15.25 ر.س"
        ],
        "disclaimer": "توقع احتمالي مبني على بيانات تجريبية وأنماط سابقة، وليس عرضاً مضموناً",
        "dataLabel": "MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET"
      }
    ],
    "ranking": [
      {
        "userId": "rashid",
        "merchantId": "half_million",
        "merchant": "Half Million",
        "merchantNameAr": "هاف مليون",
        "category": "coffee",
        "offerProbability": 0.6319,
        "purchaseProbability": 0.4563,
        "personalizedScore": 0.0733,
        "windowDays": 7,
        "estimatedSavingSar": 15.25,
        "occasion": "اليوم الوطني السعودي",
        "eligible": true,
        "suppressionReason": null,
        "reasons": [
          "فواصل الشراء السابقة منتظمة نسبياً",
          "ظهرت 4 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 15.25 ر.س"
        ],
        "disclaimer": "توقع احتمالي مبني على بيانات تجريبية وأنماط سابقة، وليس عرضاً مضموناً",
        "dataLabel": "MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET"
      },
      {
        "userId": "rashid",
        "merchantId": "jarir",
        "merchant": "Jarir",
        "merchantNameAr": "جرير",
        "category": "retail",
        "offerProbability": 0.7261,
        "purchaseProbability": 0.1555,
        "personalizedScore": 0.0673,
        "windowDays": 7,
        "estimatedSavingSar": 35.77,
        "occasion": "اليوم الوطني السعودي",
        "eligible": false,
        "suppressionReason": "threshold_not_met",
        "reasons": [
          "فواصل الشراء السابقة منتظمة نسبياً",
          "ظهرت 4 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 35.77 ر.س"
        ],
        "disclaimer": "توقع احتمالي مبني على بيانات تجريبية وأنماط سابقة، وليس عرضاً مضموناً",
        "dataLabel": "MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET"
      },
      {
        "userId": "rashid",
        "merchantId": "albaik",
        "merchant": "AlBaik",
        "merchantNameAr": "البيك",
        "category": "restaurant",
        "offerProbability": 0.5504,
        "purchaseProbability": 0.449,
        "personalizedScore": 0.0363,
        "windowDays": 7,
        "estimatedSavingSar": 10.65,
        "occasion": "اليوم الوطني السعودي",
        "eligible": false,
        "suppressionReason": "threshold_not_met",
        "reasons": [
          "ظهرت 2 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 10.65 ر.س"
        ],
        "disclaimer": "توقع احتمالي مبني على بيانات تجريبية وأنماط سابقة، وليس عرضاً مضموناً",
        "dataLabel": "MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET"
      },
      {
        "userId": "rashid",
        "merchantId": "al_dawaa",
        "merchant": "Al-Dawaa",
        "merchantNameAr": "الدواء",
        "category": "pharmacy",
        "offerProbability": 0.7206,
        "purchaseProbability": 0.3221,
        "personalizedScore": 0.0244,
        "windowDays": 7,
        "estimatedSavingSar": 9.49,
        "occasion": "اليوم الوطني السعودي",
        "eligible": false,
        "suppressionReason": "essential_purchase",
        "reasons": [
          "فواصل الشراء السابقة منتظمة نسبياً",
          "ظهرت 1 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 9.49 ر.س"
        ],
        "disclaimer": "توقع احتمالي مبني على بيانات تجريبية وأنماط سابقة، وليس عرضاً مضموناً",
        "dataLabel": "MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET"
      },
      {
        "userId": "rashid",
        "merchantId": "panda",
        "merchant": "Panda",
        "merchantNameAr": "بنده",
        "category": "grocery",
        "offerProbability": 0.409,
        "purchaseProbability": 0.2153,
        "personalizedScore": 0.0181,
        "windowDays": 7,
        "estimatedSavingSar": 12.36,
        "occasion": "اليوم الوطني السعودي",
        "eligible": false,
        "suppressionReason": "essential_purchase",
        "reasons": [
          "فواصل الشراء السابقة منتظمة نسبياً",
          "سُجلت 1 حملات تجريبية خلال آخر 365 يوماً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 12.36 ر.س"
        ],
        "disclaimer": "توقع احتمالي مبني على بيانات تجريبية وأنماط سابقة، وليس عرضاً مضموناً",
        "dataLabel": "MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET"
      },
      {
        "userId": "rashid",
        "merchantId": "barns",
        "merchant": "Barn's",
        "merchantNameAr": "بارنز",
        "category": "coffee",
        "offerProbability": 0.1627,
        "purchaseProbability": 0.3461,
        "personalizedScore": 0.0096,
        "windowDays": 7,
        "estimatedSavingSar": 10.96,
        "occasion": "اليوم الوطني السعودي",
        "eligible": false,
        "suppressionReason": "threshold_not_met",
        "reasons": [
          "فواصل الشراء السابقة منتظمة نسبياً",
          "تفصل 3 أيام عن اليوم الوطني السعودي",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 10.96 ر.س"
        ],
        "disclaimer": "توقع احتمالي مبني على بيانات تجريبية وأنماط سابقة، وليس عرضاً مضموناً",
        "dataLabel": "MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET"
      },
      {
        "userId": "rashid",
        "merchantId": "camel_step",
        "merchant": "Camel Step",
        "merchantNameAr": "خطوة جمل",
        "category": "coffee",
        "offerProbability": 0.6738,
        "purchaseProbability": 0.0,
        "personalizedScore": 0.0,
        "windowDays": 7,
        "estimatedSavingSar": 18.0,
        "occasion": "اليوم الوطني السعودي",
        "eligible": false,
        "suppressionReason": "threshold_not_met",
        "reasons": [
          "ظهرت 4 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 18 ر.س"
        ],
        "disclaimer": "توقع احتمالي مبني على بيانات تجريبية وأنماط سابقة، وليس عرضاً مضموناً",
        "dataLabel": "MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET"
      },
      {
        "userId": "rashid",
        "merchantId": "dose",
        "merchant": "Dose",
        "merchantNameAr": "دوز",
        "category": "coffee",
        "offerProbability": 0.7017,
        "purchaseProbability": 0.0,
        "personalizedScore": 0.0,
        "windowDays": 7,
        "estimatedSavingSar": 15.16,
        "occasion": "اليوم الوطني السعودي",
        "eligible": false,
        "suppressionReason": "threshold_not_met",
        "reasons": [
          "ظهرت 2 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 15.16 ر.س"
        ],
        "disclaimer": "توقع احتمالي مبني على بيانات تجريبية وأنماط سابقة، وليس عرضاً مضموناً",
        "dataLabel": "MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET"
      },
      {
        "userId": "rashid",
        "merchantId": "extra",
        "merchant": "eXtra",
        "merchantNameAr": "إكسترا",
        "category": "retail",
        "offerProbability": 0.7379,
        "purchaseProbability": 0.0,
        "personalizedScore": 0.0,
        "windowDays": 7,
        "estimatedSavingSar": 86.91,
        "occasion": "اليوم الوطني السعودي",
        "eligible": false,
        "suppressionReason": "threshold_not_met",
        "reasons": [
          "ظهرت 3 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 86.91 ر.س"
        ],
        "disclaimer": "توقع احتمالي مبني على بيانات تجريبية وأنماط سابقة، وليس عرضاً مضموناً",
        "dataLabel": "MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET"
      },
      {
        "userId": "rashid",
        "merchantId": "flynas",
        "merchant": "flynas",
        "merchantNameAr": "طيران ناس",
        "category": "travel",
        "offerProbability": 0.7262,
        "purchaseProbability": 0.0,
        "personalizedScore": 0.0,
        "windowDays": 7,
        "estimatedSavingSar": 80.49,
        "occasion": "اليوم الوطني السعودي",
        "eligible": false,
        "suppressionReason": "threshold_not_met",
        "reasons": [
          "ظهرت 2 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 80.49 ر.س"
        ],
        "disclaimer": "توقع احتمالي مبني على بيانات تجريبية وأنماط سابقة، وليس عرضاً مضموناً",
        "dataLabel": "MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET"
      },
      {
        "userId": "rashid",
        "merchantId": "herfy",
        "merchant": "Herfy",
        "merchantNameAr": "هرفي",
        "category": "restaurant",
        "offerProbability": 0.6659,
        "purchaseProbability": 0.0,
        "personalizedScore": 0.0,
        "windowDays": 7,
        "estimatedSavingSar": 15.67,
        "occasion": "اليوم الوطني السعودي",
        "eligible": false,
        "suppressionReason": "threshold_not_met",
        "reasons": [
          "ظهرت 2 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 15.67 ر.س"
        ],
        "disclaimer": "توقع احتمالي مبني على بيانات تجريبية وأنماط سابقة، وليس عرضاً مضموناً",
        "dataLabel": "MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET"
      },
      {
        "userId": "rashid",
        "merchantId": "maestro",
        "merchant": "Maestro Pizza",
        "merchantNameAr": "مايسترو بيتزا",
        "category": "restaurant",
        "offerProbability": 0.6458,
        "purchaseProbability": 0.0,
        "personalizedScore": 0.0,
        "windowDays": 7,
        "estimatedSavingSar": 33.04,
        "occasion": "اليوم الوطني السعودي",
        "eligible": false,
        "suppressionReason": "threshold_not_met",
        "reasons": [
          "ظهرت 2 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 33.04 ر.س"
        ],
        "disclaimer": "توقع احتمالي مبني على بيانات تجريبية وأنماط سابقة، وليس عرضاً مضموناً",
        "dataLabel": "MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET"
      },
      {
        "userId": "rashid",
        "merchantId": "noon_saudi",
        "merchant": "Noon Saudi",
        "merchantNameAr": "نون السعودية",
        "category": "retail",
        "offerProbability": 0.7791,
        "purchaseProbability": 0.0,
        "personalizedScore": 0.0,
        "windowDays": 7,
        "estimatedSavingSar": 37.41,
        "occasion": "اليوم الوطني السعودي",
        "eligible": false,
        "suppressionReason": "threshold_not_met",
        "reasons": [
          "ظهرت 4 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 37.41 ر.س"
        ],
        "disclaimer": "توقع احتمالي مبني على بيانات تجريبية وأنماط سابقة، وليس عرضاً مضموناً",
        "dataLabel": "MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET"
      },
      {
        "userId": "rashid",
        "merchantId": "saudia",
        "merchant": "SAUDIA",
        "merchantNameAr": "الخطوط السعودية",
        "category": "travel",
        "offerProbability": 0.5542,
        "purchaseProbability": 0.0,
        "personalizedScore": 0.0,
        "windowDays": 7,
        "estimatedSavingSar": 81.04,
        "occasion": "اليوم الوطني السعودي",
        "eligible": false,
        "suppressionReason": "threshold_not_met",
        "reasons": [
          "ظهرت 4 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 81.04 ر.س"
        ],
        "disclaimer": "توقع احتمالي مبني على بيانات تجريبية وأنماط سابقة، وليس عرضاً مضموناً",
        "dataLabel": "MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET"
      },
      {
        "userId": "rashid",
        "merchantId": "shawarmer",
        "merchant": "Shawarmer",
        "merchantNameAr": "شاورمر",
        "category": "restaurant",
        "offerProbability": 0.7254,
        "purchaseProbability": 0.0,
        "personalizedScore": 0.0,
        "windowDays": 7,
        "estimatedSavingSar": 15.83,
        "occasion": "اليوم الوطني السعودي",
        "eligible": false,
        "suppressionReason": "threshold_not_met",
        "reasons": [
          "ظهرت 2 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 15.83 ر.س"
        ],
        "disclaimer": "توقع احتمالي مبني على بيانات تجريبية وأنماط سابقة، وليس عرضاً مضموناً",
        "dataLabel": "MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET"
      }
    ],
    "purchasePatterns": [
      {
        "merchantId": "half_million",
        "merchantNameAr": "هاف مليون",
        "merchantNameEn": "Half Million",
        "category": "coffee",
        "purchaseProbability7d": 0.4563,
        "frequency30d": 0,
        "usualDay": "الجمعة",
        "usualTimePeriod": "morning",
        "averageSpendSar": 22.95,
        "isEssential": false,
        "reasons": [
          "فواصل الشراء السابقة منتظمة نسبياً"
        ]
      },
      {
        "merchantId": "albaik",
        "merchantNameAr": "البيك",
        "merchantNameEn": "AlBaik",
        "category": "restaurant",
        "purchaseProbability7d": 0.449,
        "frequency30d": 0,
        "usualDay": "الجمعة",
        "usualTimePeriod": "evening",
        "averageSpendSar": 30.48,
        "isEssential": false,
        "reasons": []
      },
      {
        "merchantId": "barns",
        "merchantNameAr": "بارنز",
        "merchantNameEn": "Barn's",
        "category": "coffee",
        "purchaseProbability7d": 0.3461,
        "frequency30d": 0,
        "usualDay": "الجمعة",
        "usualTimePeriod": "morning",
        "averageSpendSar": 20.38,
        "isEssential": false,
        "reasons": [
          "فواصل الشراء السابقة منتظمة نسبياً"
        ]
      },
      {
        "merchantId": "al_dawaa",
        "merchantNameAr": "الدواء",
        "merchantNameEn": "Al-Dawaa",
        "category": "pharmacy",
        "purchaseProbability7d": 0.3221,
        "frequency30d": 0,
        "usualDay": "الجمعة",
        "usualTimePeriod": "evening",
        "averageSpendSar": 85.74,
        "isEssential": true,
        "reasons": [
          "فواصل الشراء السابقة منتظمة نسبياً"
        ]
      },
      {
        "merchantId": "panda",
        "merchantNameAr": "بنده",
        "merchantNameEn": "Panda",
        "category": "grocery",
        "purchaseProbability7d": 0.2153,
        "frequency30d": 0,
        "usualDay": "السبت",
        "usualTimePeriod": "afternoon",
        "averageSpendSar": 147.09,
        "isEssential": true,
        "reasons": [
          "فواصل الشراء السابقة منتظمة نسبياً"
        ]
      },
      {
        "merchantId": "jarir",
        "merchantNameAr": "جرير",
        "merchantNameEn": "Jarir",
        "category": "retail",
        "purchaseProbability7d": 0.1555,
        "frequency30d": 0,
        "usualDay": "الاثنين",
        "usualTimePeriod": "afternoon",
        "averageSpendSar": 361.57,
        "isEssential": false,
        "reasons": [
          "فواصل الشراء السابقة منتظمة نسبياً"
        ]
      },
      {
        "merchantId": "camel_step",
        "merchantNameAr": "خطوة جمل",
        "merchantNameEn": "Camel Step",
        "category": "coffee",
        "purchaseProbability7d": 0.0,
        "frequency30d": 0,
        "usualDay": "الجمعة",
        "usualTimePeriod": "evening",
        "averageSpendSar": 28.0,
        "isEssential": false,
        "reasons": []
      },
      {
        "merchantId": "dose",
        "merchantNameAr": "دوز",
        "merchantNameEn": "Dose",
        "category": "coffee",
        "purchaseProbability7d": 0.0,
        "frequency30d": 0,
        "usualDay": "الجمعة",
        "usualTimePeriod": "evening",
        "averageSpendSar": 26.0,
        "isEssential": false,
        "reasons": []
      }
    ]
  }
};
