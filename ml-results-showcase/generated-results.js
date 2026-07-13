window.NAMO_RESULTS = {
  "metrics": {
    "label": "نتائج على بيانات تجريبية من السوق السعودي",
    "dataLabel": "MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET",
    "dataset": {
      "datasetVersion": "synthetic-saudi-v2",
      "label": "MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET",
      "merchants": 20,
      "campaigns": 2047,
      "transactions": 95063,
      "users": 220,
      "seed": 20260923,
      "dateRange": {
        "start": "2022-01-03",
        "end": "2026-09-19T23:00:00"
      }
    },
    "offerModel": {
      "accuracy": 0.5446,
      "balancedAccuracy": 0.5876,
      "precision": 0.4778,
      "recall": 0.8622,
      "f1": 0.6149,
      "rocAuc": 0.6643,
      "brierScore": 0.224972,
      "evaluatedThreshold": 0.3,
      "positiveRate": 0.4216,
      "predictedPositiveRate": 0.7608,
      "testRows": 740,
      "confusionMatrix": [
        [
          134,
          294
        ],
        [
          43,
          269
        ]
      ],
      "modelName": "RandomForestClassifier",
      "trainingDurationSeconds": 0.73,
      "datasetVersion": "synthetic-saudi-v2",
      "randomSeed": 20260923,
      "calibrationMethod": "isotonic",
      "temporalSplit": {
        "train": {
          "start": "2022-01-03",
          "end": "2025-04-14",
          "rows": 3440,
          "positiveRate": 0.4192
        },
        "validation": {
          "start": "2025-04-21",
          "end": "2025-12-29",
          "rows": 740,
          "positiveRate": 0.3959
        },
        "test": {
          "start": "2026-01-05",
          "end": "2026-09-14",
          "rows": 740,
          "positiveRate": 0.4216
        }
      },
      "reliabilityBins": [
        {
          "lower": 0,
          "upper": 0.1,
          "meanPrediction": 0,
          "observedRate": 0.5,
          "count": 2
        },
        {
          "lower": 0.1,
          "upper": 0.2,
          "meanPrediction": 0.1835,
          "observedRate": 0.2024,
          "count": 84
        },
        {
          "lower": 0.2,
          "upper": 0.3,
          "meanPrediction": 0.2607,
          "observedRate": 0.2747,
          "count": 91
        },
        {
          "lower": 0.3,
          "upper": 0.4,
          "meanPrediction": 0.3161,
          "observedRate": 0.3469,
          "count": 147
        },
        {
          "lower": 0.4,
          "upper": 0.5,
          "meanPrediction": 0.4161,
          "observedRate": 0.4359,
          "count": 234
        },
        {
          "lower": 0.5,
          "upper": 0.6,
          "meanPrediction": 0.5456,
          "observedRate": 0.6078,
          "count": 102
        },
        {
          "lower": 0.7,
          "upper": 0.8,
          "meanPrediction": 0.7112,
          "observedRate": 0.6835,
          "count": 79
        },
        {
          "lower": 0.8,
          "upper": 0.9,
          "meanPrediction": 0.8384,
          "observedRate": 0,
          "count": 1
        }
      ]
    },
    "purchaseModel": {
      "accuracy": 0.7474,
      "balancedAccuracy": 0.7641,
      "precision": 0.6394,
      "recall": 0.848,
      "f1": 0.7291,
      "rocAuc": 0.8418,
      "brierScore": 0.158431,
      "evaluatedThreshold": 0.34,
      "positiveRate": 0.4007,
      "predictedPositiveRate": 0.5314,
      "testRows": 29700,
      "confusionMatrix": [
        [
          12107,
          5692
        ],
        [
          1809,
          10092
        ]
      ],
      "modelName": "HistGradientBoostingClassifier",
      "trainingDurationSeconds": 1.961,
      "datasetVersion": "synthetic-saudi-v2",
      "randomSeed": 20260923,
      "calibrationMethod": "isotonic",
      "temporalSplit": {
        "train": {
          "start": "2023-05-02",
          "end": "2025-09-02",
          "rows": 133530,
          "positiveRate": 0.4032
        },
        "validation": {
          "start": "2025-09-09",
          "end": "2026-03-03",
          "rows": 28600,
          "positiveRate": 0.4026
        },
        "test": {
          "start": "2026-03-10",
          "end": "2026-09-08",
          "rows": 29700,
          "positiveRate": 0.4007
        }
      },
      "reliabilityBins": [
        {
          "lower": 0,
          "upper": 0.1,
          "meanPrediction": 0.0393,
          "observedRate": 0.0388,
          "count": 6281
        },
        {
          "lower": 0.1,
          "upper": 0.2,
          "meanPrediction": 0.1425,
          "observedRate": 0.1369,
          "count": 3250
        },
        {
          "lower": 0.2,
          "upper": 0.3,
          "meanPrediction": 0.2455,
          "observedRate": 0.2459,
          "count": 3867
        },
        {
          "lower": 0.3,
          "upper": 0.4,
          "meanPrediction": 0.363,
          "observedRate": 0.3631,
          "count": 1096
        },
        {
          "lower": 0.4,
          "upper": 0.5,
          "meanPrediction": 0.4339,
          "observedRate": 0.433,
          "count": 2871
        },
        {
          "lower": 0.5,
          "upper": 0.6,
          "meanPrediction": 0.5361,
          "observedRate": 0.5281,
          "count": 2513
        },
        {
          "lower": 0.6,
          "upper": 0.7,
          "meanPrediction": 0.6289,
          "observedRate": 0.6274,
          "count": 2587
        },
        {
          "lower": 0.7,
          "upper": 0.8,
          "meanPrediction": 0.7513,
          "observedRate": 0.7493,
          "count": 4603
        },
        {
          "lower": 0.8,
          "upper": 0.9,
          "meanPrediction": 0.8347,
          "observedRate": 0.8159,
          "count": 1972
        },
        {
          "lower": 0.9,
          "upper": 1,
          "meanPrediction": 0.9422,
          "observedRate": 0.9273,
          "count": 660
        }
      ],
      "precisionAt3": 0.5597,
      "hitRateAt3": 0.9804
    }
  },
  "featureImportance": {
    "label": "نتائج على بيانات تجريبية من السوق السعودي",
    "offerModel": [
      {
        "feature": "days_until_occasion",
        "importance": 0.3514
      },
      {
        "feature": "seasonal_focus_match",
        "importance": 0.2063
      },
      {
        "feature": "campaign_due_ratio",
        "importance": 0.1539
      },
      {
        "feature": "days_since_last_campaign",
        "importance": 0.1118
      },
      {
        "feature": "historical_campaign_rate",
        "importance": 0.0388
      },
      {
        "feature": "near_occasion",
        "importance": 0.0317
      },
      {
        "feature": "avg_duration_days",
        "importance": 0.0313
      },
      {
        "feature": "category",
        "importance": 0.0198
      },
      {
        "feature": "salary_day_proximity",
        "importance": 0.0161
      },
      {
        "feature": "campaigns_30d",
        "importance": 0.0128
      },
      {
        "feature": "category_season",
        "importance": 0.0082
      },
      {
        "feature": "discount_trend",
        "importance": 0.0067
      },
      {
        "feature": "recent_campaign_rate",
        "importance": 0.0061
      },
      {
        "feature": "campaigns_90d",
        "importance": 0.0049
      }
    ],
    "purchaseModel": [
      {
        "feature": "expected_purchase_proximity",
        "importance": 0.3921
      },
      {
        "feature": "purchase_due_ratio",
        "importance": 0.3256
      },
      {
        "feature": "interval_std_days",
        "importance": 0.1035
      },
      {
        "feature": "merchant_baseline_popularity_30d",
        "importance": 0.0944
      },
      {
        "feature": "avg_interval_days",
        "importance": 0.0435
      },
      {
        "feature": "preferred_weekday",
        "importance": 0.0142
      },
      {
        "feature": "weekend_preference",
        "importance": 0.0093
      },
      {
        "feature": "days_since_last_purchase",
        "importance": 0.0034
      },
      {
        "feature": "merchant_id",
        "importance": 0.0029
      },
      {
        "feature": "weekday_match_rate",
        "importance": 0.0024
      },
      {
        "feature": "recency_frequency_interaction",
        "importance": 0.0024
      },
      {
        "feature": "merchant_spending_share",
        "importance": 0.0022
      },
      {
        "feature": "weekday_preference_strength",
        "importance": 0.0021
      },
      {
        "feature": "purchases_7d",
        "importance": 0.0019
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
          134,
          294
        ],
        [
          43,
          269
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
          12107,
          5692
        ],
        [
          1809,
          10092
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
        "offerProbability": 0.5352,
        "purchaseProbability": 0.827,
        "personalizedScore": 0.1095,
        "windowDays": 7,
        "estimatedSavingSar": 14.85,
        "occasion": "اليوم الوطني السعودي",
        "eligible": true,
        "suppressionReason": null,
        "reasons": [
          "تكرر الشراء 3 مرة خلال آخر 30 يوماً",
          "ظهرت 11 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 14.85 ر.س"
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
        "offerProbability": 0.7069,
        "purchaseProbability": 0.9101,
        "personalizedScore": 0.07,
        "windowDays": 7,
        "estimatedSavingSar": 33.59,
        "occasion": "اليوم الوطني السعودي",
        "eligible": true,
        "suppressionReason": null,
        "reasons": [
          "فواصل الشراء السابقة منتظمة نسبياً",
          "ظهرت 16 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 33.59 ر.س"
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
        "offerProbability": 0.7222,
        "purchaseProbability": 0.5,
        "personalizedScore": 0.0646,
        "windowDays": 7,
        "estimatedSavingSar": 11.17,
        "occasion": "اليوم الوطني السعودي",
        "eligible": true,
        "suppressionReason": null,
        "reasons": [
          "تكرر الشراء 3 مرة خلال آخر 30 يوماً",
          "ظهرت 5 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 11.17 ر.س"
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
        "offerProbability": 0.7069,
        "purchaseProbability": 0.9101,
        "personalizedScore": 0.0594,
        "windowDays": 7,
        "estimatedSavingSar": 15.18,
        "occasion": "اليوم الوطني السعودي",
        "eligible": true,
        "suppressionReason": null,
        "reasons": [
          "فواصل الشراء السابقة منتظمة نسبياً",
          "ظهرت 13 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 15.18 ر.س"
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
        "offerProbability": 0.4159,
        "purchaseProbability": 0.5588,
        "personalizedScore": 0.0459,
        "windowDays": 7,
        "estimatedSavingSar": 11.84,
        "occasion": "اليوم الوطني السعودي",
        "eligible": true,
        "suppressionReason": null,
        "reasons": [
          "تكرر الشراء 3 مرة خلال آخر 30 يوماً",
          "ظهرت 11 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 11.84 ر.س"
        ],
        "disclaimer": "توقع احتمالي مبني على بيانات تجريبية وأنماط سابقة، وليس عرضاً مضموناً",
        "dataLabel": "MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET"
      }
    ],
    "ranking": [
      {
        "userId": "rashid",
        "merchantId": "flynas",
        "merchant": "flynas",
        "merchantNameAr": "طيران ناس",
        "category": "travel",
        "offerProbability": 0.2952,
        "purchaseProbability": 0.6082,
        "personalizedScore": 0.1123,
        "windowDays": 7,
        "estimatedSavingSar": 71.18,
        "occasion": "اليوم الوطني السعودي",
        "eligible": false,
        "suppressionReason": "threshold_not_met",
        "reasons": [
          "فواصل الشراء السابقة منتظمة نسبياً",
          "ظهرت 12 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 71.18 ر.س"
        ],
        "disclaimer": "توقع احتمالي مبني على بيانات تجريبية وأنماط سابقة، وليس عرضاً مضموناً",
        "dataLabel": "MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET"
      },
      {
        "userId": "rashid",
        "merchantId": "half_million",
        "merchant": "Half Million",
        "merchantNameAr": "هاف مليون",
        "category": "coffee",
        "offerProbability": 0.5352,
        "purchaseProbability": 0.827,
        "personalizedScore": 0.1095,
        "windowDays": 7,
        "estimatedSavingSar": 14.85,
        "occasion": "اليوم الوطني السعودي",
        "eligible": true,
        "suppressionReason": null,
        "reasons": [
          "تكرر الشراء 3 مرة خلال آخر 30 يوماً",
          "ظهرت 11 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 14.85 ر.س"
        ],
        "disclaimer": "توقع احتمالي مبني على بيانات تجريبية وأنماط سابقة، وليس عرضاً مضموناً",
        "dataLabel": "MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET"
      },
      {
        "userId": "rashid",
        "merchantId": "danube",
        "merchant": "Danube",
        "merchantNameAr": "الدانوب",
        "category": "grocery",
        "offerProbability": 0.5352,
        "purchaseProbability": 0.9583,
        "personalizedScore": 0.1025,
        "windowDays": 7,
        "estimatedSavingSar": 18.56,
        "occasion": "اليوم الوطني السعودي",
        "eligible": false,
        "suppressionReason": "essential_purchase",
        "reasons": [
          "فواصل الشراء السابقة منتظمة نسبياً",
          "ظهرت 6 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 18.56 ر.س"
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
        "offerProbability": 0.7069,
        "purchaseProbability": 0.9101,
        "personalizedScore": 0.07,
        "windowDays": 7,
        "estimatedSavingSar": 33.59,
        "occasion": "اليوم الوطني السعودي",
        "eligible": true,
        "suppressionReason": null,
        "reasons": [
          "فواصل الشراء السابقة منتظمة نسبياً",
          "ظهرت 16 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 33.59 ر.س"
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
        "offerProbability": 0.7222,
        "purchaseProbability": 0.5,
        "personalizedScore": 0.0646,
        "windowDays": 7,
        "estimatedSavingSar": 11.17,
        "occasion": "اليوم الوطني السعودي",
        "eligible": true,
        "suppressionReason": null,
        "reasons": [
          "تكرر الشراء 3 مرة خلال آخر 30 يوماً",
          "ظهرت 5 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 11.17 ر.س"
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
        "offerProbability": 0.7069,
        "purchaseProbability": 0.9101,
        "personalizedScore": 0.0594,
        "windowDays": 7,
        "estimatedSavingSar": 15.18,
        "occasion": "اليوم الوطني السعودي",
        "eligible": true,
        "suppressionReason": null,
        "reasons": [
          "فواصل الشراء السابقة منتظمة نسبياً",
          "ظهرت 13 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 15.18 ر.س"
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
        "offerProbability": 0.4159,
        "purchaseProbability": 0.5588,
        "personalizedScore": 0.0459,
        "windowDays": 7,
        "estimatedSavingSar": 11.84,
        "occasion": "اليوم الوطني السعودي",
        "eligible": true,
        "suppressionReason": null,
        "reasons": [
          "تكرر الشراء 3 مرة خلال آخر 30 يوماً",
          "ظهرت 11 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 11.84 ر.س"
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
        "offerProbability": 0.4159,
        "purchaseProbability": 0.9101,
        "personalizedScore": 0.0396,
        "windowDays": 7,
        "estimatedSavingSar": 16.74,
        "occasion": "اليوم الوطني السعودي",
        "eligible": false,
        "suppressionReason": "threshold_not_met",
        "reasons": [
          "فواصل الشراء السابقة منتظمة نسبياً",
          "ظهرت 11 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 16.74 ر.س"
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
        "offerProbability": 0.3154,
        "purchaseProbability": 0.5837,
        "personalizedScore": 0.0369,
        "windowDays": 7,
        "estimatedSavingSar": 12.02,
        "occasion": "اليوم الوطني السعودي",
        "eligible": false,
        "suppressionReason": "essential_purchase",
        "reasons": [
          "تكرر الشراء 1 مرة خلال آخر 30 يوماً",
          "ظهرت 5 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 12.02 ر.س"
        ],
        "disclaimer": "توقع احتمالي مبني على بيانات تجريبية وأنماط سابقة، وليس عرضاً مضموناً",
        "dataLabel": "MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET"
      },
      {
        "userId": "rashid",
        "merchantId": "al_romansiah",
        "merchant": "Al Romansiah",
        "merchantNameAr": "الرومانسية",
        "category": "restaurant",
        "offerProbability": 0.3154,
        "purchaseProbability": 0.9101,
        "personalizedScore": 0.0293,
        "windowDays": 7,
        "estimatedSavingSar": 23.87,
        "occasion": "اليوم الوطني السعودي",
        "eligible": false,
        "suppressionReason": "threshold_not_met",
        "reasons": [
          "ظهرت 9 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 23.87 ر.س"
        ],
        "disclaimer": "توقع احتمالي مبني على بيانات تجريبية وأنماط سابقة، وليس عرضاً مضموناً",
        "dataLabel": "MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET"
      },
      {
        "userId": "rashid",
        "merchantId": "kudu",
        "merchant": "Kudu",
        "merchantNameAr": "كودو",
        "category": "restaurant",
        "offerProbability": 0.5217,
        "purchaseProbability": 0.9101,
        "personalizedScore": 0.0256,
        "windowDays": 7,
        "estimatedSavingSar": 14.26,
        "occasion": "اليوم الوطني السعودي",
        "eligible": false,
        "suppressionReason": "threshold_not_met",
        "reasons": [
          "فواصل الشراء السابقة منتظمة نسبياً",
          "ظهرت 9 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 14.26 ر.س"
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
        "offerProbability": 0.4159,
        "purchaseProbability": 0.2009,
        "personalizedScore": 0.0116,
        "windowDays": 7,
        "estimatedSavingSar": 8.71,
        "occasion": "اليوم الوطني السعودي",
        "eligible": false,
        "suppressionReason": "essential_purchase",
        "reasons": [
          "تكرر الشراء 1 مرة خلال آخر 30 يوماً",
          "ظهرت 9 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 8.71 ر.س"
        ],
        "disclaimer": "توقع احتمالي مبني على بيانات تجريبية وأنماط سابقة، وليس عرضاً مضموناً",
        "dataLabel": "MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET"
      },
      {
        "userId": "rashid",
        "merchantId": "nahdi",
        "merchant": "Nahdi",
        "merchantNameAr": "النهدي",
        "category": "pharmacy",
        "offerProbability": 0.5352,
        "purchaseProbability": 0.6538,
        "personalizedScore": 0.0086,
        "windowDays": 7,
        "estimatedSavingSar": 9.76,
        "occasion": "اليوم الوطني السعودي",
        "eligible": false,
        "suppressionReason": "essential_purchase",
        "reasons": [
          "فواصل الشراء السابقة منتظمة نسبياً",
          "ظهرت 7 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 9.76 ر.س"
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
        "offerProbability": 0.7222,
        "purchaseProbability": 0.1222,
        "personalizedScore": 0.005,
        "windowDays": 7,
        "estimatedSavingSar": 15.91,
        "occasion": "اليوم الوطني السعودي",
        "eligible": false,
        "suppressionReason": "threshold_not_met",
        "reasons": [
          "فواصل الشراء السابقة منتظمة نسبياً",
          "ظهرت 14 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 15.91 ر.س"
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
        "offerProbability": 0.5352,
        "purchaseProbability": 0.0814,
        "personalizedScore": 0.0023,
        "windowDays": 7,
        "estimatedSavingSar": 15.02,
        "occasion": "اليوم الوطني السعودي",
        "eligible": false,
        "suppressionReason": "threshold_not_met",
        "reasons": [
          "تكرر الشراء 1 مرة خلال آخر 30 يوماً",
          "ظهرت 11 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 15.02 ر.س"
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
        "offerProbability": 0.4159,
        "purchaseProbability": 0.0085,
        "personalizedScore": 0.0018,
        "windowDays": 7,
        "estimatedSavingSar": 77.88,
        "occasion": "اليوم الوطني السعودي",
        "eligible": false,
        "suppressionReason": "threshold_not_met",
        "reasons": [
          "تكرر الشراء 1 مرة خلال آخر 30 يوماً",
          "ظهرت 7 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 77.88 ر.س"
        ],
        "disclaimer": "توقع احتمالي مبني على بيانات تجريبية وأنماط سابقة، وليس عرضاً مضموناً",
        "dataLabel": "MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET"
      },
      {
        "userId": "rashid",
        "merchantId": "hungerstation",
        "merchant": "HungerStation",
        "merchantNameAr": "هنقرستيشن",
        "category": "delivery",
        "offerProbability": 0.4159,
        "purchaseProbability": 0.9101,
        "personalizedScore": 0.0008,
        "windowDays": 7,
        "estimatedSavingSar": 7.38,
        "occasion": "اليوم الوطني السعودي",
        "eligible": false,
        "suppressionReason": "threshold_not_met",
        "reasons": [
          "فواصل الشراء السابقة منتظمة نسبياً",
          "ظهرت 12 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 7.38 ر.س"
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
        "offerProbability": 0.7222,
        "purchaseProbability": 0.6538,
        "personalizedScore": 0,
        "windowDays": 7,
        "estimatedSavingSar": 86.54,
        "occasion": "اليوم الوطني السعودي",
        "eligible": false,
        "suppressionReason": "threshold_not_met",
        "reasons": [
          "فواصل الشراء السابقة منتظمة نسبياً",
          "ظهرت 15 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 86.54 ر.س"
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
        "offerProbability": 0.7222,
        "purchaseProbability": 0.6538,
        "personalizedScore": 0,
        "windowDays": 7,
        "estimatedSavingSar": 35.73,
        "occasion": "اليوم الوطني السعودي",
        "eligible": false,
        "suppressionReason": "threshold_not_met",
        "reasons": [
          "فواصل الشراء السابقة منتظمة نسبياً",
          "ظهرت 9 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 35.73 ر.س"
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
        "offerProbability": 1,
        "purchaseProbability": 0.6538,
        "personalizedScore": 0,
        "windowDays": 7,
        "estimatedSavingSar": 39.6,
        "occasion": "اليوم الوطني السعودي",
        "eligible": false,
        "suppressionReason": "threshold_not_met",
        "reasons": [
          "فواصل الشراء السابقة منتظمة نسبياً",
          "ظهرت 17 حملات تجريبية في الموسم نفسه سابقاً",
          "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 39.6 ر.س"
        ],
        "disclaimer": "توقع احتمالي مبني على بيانات تجريبية وأنماط سابقة، وليس عرضاً مضموناً",
        "dataLabel": "MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET"
      }
    ],
    "purchasePatterns": [
      {
        "merchantId": "danube",
        "merchantNameAr": "الدانوب",
        "merchantNameEn": "Danube",
        "category": "grocery",
        "purchaseProbability7d": 0.9583,
        "frequency30d": 0,
        "usualDay": "الجمعة",
        "usualTimePeriod": "evening",
        "averageSpendSar": 175,
        "isEssential": true,
        "reasons": [
          "فواصل الشراء السابقة منتظمة نسبياً"
        ]
      },
      {
        "merchantId": "al_romansiah",
        "merchantNameAr": "الرومانسية",
        "merchantNameEn": "Al Romansiah",
        "category": "restaurant",
        "purchaseProbability7d": 0.9101,
        "frequency30d": 0,
        "usualDay": "الثلاثاء",
        "usualTimePeriod": "evening",
        "averageSpendSar": 81.13,
        "isEssential": false,
        "reasons": []
      },
      {
        "merchantId": "camel_step",
        "merchantNameAr": "خطوة جمل",
        "merchantNameEn": "Camel Step",
        "category": "coffee",
        "purchaseProbability7d": 0.9101,
        "frequency30d": 0,
        "usualDay": "الاثنين",
        "usualTimePeriod": "afternoon",
        "averageSpendSar": 31.77,
        "isEssential": false,
        "reasons": [
          "فواصل الشراء السابقة منتظمة نسبياً"
        ]
      },
      {
        "merchantId": "dose",
        "merchantNameAr": "دوز",
        "merchantNameEn": "Dose",
        "category": "coffee",
        "purchaseProbability7d": 0.9101,
        "frequency30d": 0,
        "usualDay": "الجمعة",
        "usualTimePeriod": "evening",
        "averageSpendSar": 26,
        "isEssential": false,
        "reasons": [
          "فواصل الشراء السابقة منتظمة نسبياً"
        ]
      },
      {
        "merchantId": "hungerstation",
        "merchantNameAr": "هنقرستيشن",
        "merchantNameEn": "HungerStation",
        "category": "delivery",
        "purchaseProbability7d": 0.9101,
        "frequency30d": 0,
        "usualDay": "الأربعاء",
        "usualTimePeriod": "evening",
        "averageSpendSar": 49.63,
        "isEssential": false,
        "reasons": [
          "فواصل الشراء السابقة منتظمة نسبياً"
        ]
      },
      {
        "merchantId": "kudu",
        "merchantNameAr": "كودو",
        "merchantNameEn": "Kudu",
        "category": "restaurant",
        "purchaseProbability7d": 0.9101,
        "frequency30d": 0,
        "usualDay": "الأربعاء",
        "usualTimePeriod": "afternoon",
        "averageSpendSar": 48.49,
        "isEssential": false,
        "reasons": [
          "فواصل الشراء السابقة منتظمة نسبياً"
        ]
      },
      {
        "merchantId": "maestro",
        "merchantNameAr": "مايسترو بيتزا",
        "merchantNameEn": "Maestro Pizza",
        "category": "restaurant",
        "purchaseProbability7d": 0.9101,
        "frequency30d": 0,
        "usualDay": "الجمعة",
        "usualTimePeriod": "evening",
        "averageSpendSar": 41.39,
        "isEssential": false,
        "reasons": [
          "فواصل الشراء السابقة منتظمة نسبياً"
        ]
      },
      {
        "merchantId": "half_million",
        "merchantNameAr": "هاف مليون",
        "merchantNameEn": "Half Million",
        "category": "coffee",
        "purchaseProbability7d": 0.827,
        "frequency30d": 3,
        "usualDay": "السبت",
        "usualTimePeriod": "evening",
        "averageSpendSar": 21.41,
        "isEssential": false,
        "reasons": [
          "تكرر الشراء 3 مرة خلال آخر 30 يوماً",
          "يوجد شراء حديث من هذا التاجر ضمن البيانات التجريبية",
          "فواصل الشراء السابقة منتظمة نسبياً"
        ]
      }
    ]
  },
  "thresholdAnalysis": {
    "label": "نتائج على بيانات تجريبية من السوق السعودي",
    "source": "validation only",
    "offerModel": {
      "selected": {
        "threshold": 0.3,
        "precision": 0.4562,
        "recall": 0.8532,
        "f1": 0.5945,
        "balancedAccuracy": 0.5933,
        "predictedPositiveRate": 0.7405,
        "constraintsSatisfied": false
      },
      "rows": [
        {
          "threshold": 0.1,
          "precision": 0.3976,
          "recall": 1,
          "f1": 0.5689,
          "balancedAccuracy": 0.5034,
          "predictedPositiveRate": 0.9959
        },
        {
          "threshold": 0.12,
          "precision": 0.3976,
          "recall": 1,
          "f1": 0.5689,
          "balancedAccuracy": 0.5034,
          "predictedPositiveRate": 0.9959
        },
        {
          "threshold": 0.14,
          "precision": 0.3976,
          "recall": 1,
          "f1": 0.5689,
          "balancedAccuracy": 0.5034,
          "predictedPositiveRate": 0.9959
        },
        {
          "threshold": 0.16,
          "precision": 0.3976,
          "recall": 1,
          "f1": 0.5689,
          "balancedAccuracy": 0.5034,
          "predictedPositiveRate": 0.9959
        },
        {
          "threshold": 0.18,
          "precision": 0.3976,
          "recall": 1,
          "f1": 0.5689,
          "balancedAccuracy": 0.5034,
          "predictedPositiveRate": 0.9959
        },
        {
          "threshold": 0.2,
          "precision": 0.4255,
          "recall": 0.9454,
          "f1": 0.5869,
          "balancedAccuracy": 0.5544,
          "predictedPositiveRate": 0.8797
        },
        {
          "threshold": 0.22,
          "precision": 0.4255,
          "recall": 0.9454,
          "f1": 0.5869,
          "balancedAccuracy": 0.5544,
          "predictedPositiveRate": 0.8797
        },
        {
          "threshold": 0.24,
          "precision": 0.443,
          "recall": 0.901,
          "f1": 0.5939,
          "balancedAccuracy": 0.5791,
          "predictedPositiveRate": 0.8054
        },
        {
          "threshold": 0.26,
          "precision": 0.443,
          "recall": 0.901,
          "f1": 0.5939,
          "balancedAccuracy": 0.5791,
          "predictedPositiveRate": 0.8054
        },
        {
          "threshold": 0.28,
          "precision": 0.443,
          "recall": 0.901,
          "f1": 0.5939,
          "balancedAccuracy": 0.5791,
          "predictedPositiveRate": 0.8054
        },
        {
          "threshold": 0.3,
          "precision": 0.4562,
          "recall": 0.8532,
          "f1": 0.5945,
          "balancedAccuracy": 0.5933,
          "predictedPositiveRate": 0.7405
        },
        {
          "threshold": 0.32,
          "precision": 0.5088,
          "recall": 0.6928,
          "f1": 0.5867,
          "balancedAccuracy": 0.6272,
          "predictedPositiveRate": 0.5392
        },
        {
          "threshold": 0.34,
          "precision": 0.5088,
          "recall": 0.6928,
          "f1": 0.5867,
          "balancedAccuracy": 0.6272,
          "predictedPositiveRate": 0.5392
        },
        {
          "threshold": 0.36,
          "precision": 0.5088,
          "recall": 0.6928,
          "f1": 0.5867,
          "balancedAccuracy": 0.6272,
          "predictedPositiveRate": 0.5392
        },
        {
          "threshold": 0.38,
          "precision": 0.5088,
          "recall": 0.6928,
          "f1": 0.5867,
          "balancedAccuracy": 0.6272,
          "predictedPositiveRate": 0.5392
        },
        {
          "threshold": 0.4,
          "precision": 0.5088,
          "recall": 0.6928,
          "f1": 0.5867,
          "balancedAccuracy": 0.6272,
          "predictedPositiveRate": 0.5392
        },
        {
          "threshold": 0.42,
          "precision": 0.6162,
          "recall": 0.3891,
          "f1": 0.477,
          "balancedAccuracy": 0.6151,
          "predictedPositiveRate": 0.25
        },
        {
          "threshold": 0.44,
          "precision": 0.6162,
          "recall": 0.3891,
          "f1": 0.477,
          "balancedAccuracy": 0.6151,
          "predictedPositiveRate": 0.25
        },
        {
          "threshold": 0.46,
          "precision": 0.6162,
          "recall": 0.3891,
          "f1": 0.477,
          "balancedAccuracy": 0.6151,
          "predictedPositiveRate": 0.25
        },
        {
          "threshold": 0.48,
          "precision": 0.6162,
          "recall": 0.3891,
          "f1": 0.477,
          "balancedAccuracy": 0.6151,
          "predictedPositiveRate": 0.25
        },
        {
          "threshold": 0.5,
          "precision": 0.6162,
          "recall": 0.3891,
          "f1": 0.477,
          "balancedAccuracy": 0.6151,
          "predictedPositiveRate": 0.25
        },
        {
          "threshold": 0.52,
          "precision": 0.6162,
          "recall": 0.3891,
          "f1": 0.477,
          "balancedAccuracy": 0.6151,
          "predictedPositiveRate": 0.25
        },
        {
          "threshold": 0.54,
          "precision": 0.7033,
          "recall": 0.2184,
          "f1": 0.3333,
          "balancedAccuracy": 0.579,
          "predictedPositiveRate": 0.123
        },
        {
          "threshold": 0.56,
          "precision": 0.7033,
          "recall": 0.2184,
          "f1": 0.3333,
          "balancedAccuracy": 0.579,
          "predictedPositiveRate": 0.123
        },
        {
          "threshold": 0.58,
          "precision": 0.7033,
          "recall": 0.2184,
          "f1": 0.3333,
          "balancedAccuracy": 0.579,
          "predictedPositiveRate": 0.123
        },
        {
          "threshold": 0.6,
          "precision": 0.7033,
          "recall": 0.2184,
          "f1": 0.3333,
          "balancedAccuracy": 0.579,
          "predictedPositiveRate": 0.123
        },
        {
          "threshold": 0.62,
          "precision": 0.716,
          "recall": 0.198,
          "f1": 0.3102,
          "balancedAccuracy": 0.5732,
          "predictedPositiveRate": 0.1095
        },
        {
          "threshold": 0.64,
          "precision": 0.716,
          "recall": 0.198,
          "f1": 0.3102,
          "balancedAccuracy": 0.5732,
          "predictedPositiveRate": 0.1095
        },
        {
          "threshold": 0.66,
          "precision": 0.716,
          "recall": 0.198,
          "f1": 0.3102,
          "balancedAccuracy": 0.5732,
          "predictedPositiveRate": 0.1095
        },
        {
          "threshold": 0.68,
          "precision": 0.716,
          "recall": 0.198,
          "f1": 0.3102,
          "balancedAccuracy": 0.5732,
          "predictedPositiveRate": 0.1095
        },
        {
          "threshold": 0.7,
          "precision": 0.716,
          "recall": 0.198,
          "f1": 0.3102,
          "balancedAccuracy": 0.5732,
          "predictedPositiveRate": 0.1095
        },
        {
          "threshold": 0.72,
          "precision": 0.7391,
          "recall": 0.058,
          "f1": 0.1076,
          "balancedAccuracy": 0.5223,
          "predictedPositiveRate": 0.0311
        },
        {
          "threshold": 0.74,
          "precision": 0.8,
          "recall": 0.0137,
          "f1": 0.0268,
          "balancedAccuracy": 0.5057,
          "predictedPositiveRate": 0.0068
        },
        {
          "threshold": 0.76,
          "precision": 1,
          "recall": 0.0034,
          "f1": 0.0068,
          "balancedAccuracy": 0.5017,
          "predictedPositiveRate": 0.0014
        },
        {
          "threshold": 0.78,
          "precision": 1,
          "recall": 0.0034,
          "f1": 0.0068,
          "balancedAccuracy": 0.5017,
          "predictedPositiveRate": 0.0014
        },
        {
          "threshold": 0.8,
          "precision": 1,
          "recall": 0.0034,
          "f1": 0.0068,
          "balancedAccuracy": 0.5017,
          "predictedPositiveRate": 0.0014
        },
        {
          "threshold": 0.82,
          "precision": 1,
          "recall": 0.0034,
          "f1": 0.0068,
          "balancedAccuracy": 0.5017,
          "predictedPositiveRate": 0.0014
        },
        {
          "threshold": 0.84,
          "precision": 1,
          "recall": 0.0034,
          "f1": 0.0068,
          "balancedAccuracy": 0.5017,
          "predictedPositiveRate": 0.0014
        },
        {
          "threshold": 0.86,
          "precision": 1,
          "recall": 0.0034,
          "f1": 0.0068,
          "balancedAccuracy": 0.5017,
          "predictedPositiveRate": 0.0014
        },
        {
          "threshold": 0.88,
          "precision": 1,
          "recall": 0.0034,
          "f1": 0.0068,
          "balancedAccuracy": 0.5017,
          "predictedPositiveRate": 0.0014
        },
        {
          "threshold": 0.9,
          "precision": 1,
          "recall": 0.0034,
          "f1": 0.0068,
          "balancedAccuracy": 0.5017,
          "predictedPositiveRate": 0.0014
        }
      ]
    },
    "purchaseModel": {
      "selected": {
        "threshold": 0.34,
        "precision": 0.6421,
        "recall": 0.8474,
        "f1": 0.7306,
        "balancedAccuracy": 0.7646,
        "predictedPositiveRate": 0.5313,
        "constraintsSatisfied": false
      },
      "rows": [
        {
          "threshold": 0.1,
          "precision": 0.5009,
          "recall": 0.9794,
          "f1": 0.6628,
          "balancedAccuracy": 0.6609,
          "predictedPositiveRate": 0.7872
        },
        {
          "threshold": 0.12,
          "precision": 0.5011,
          "recall": 0.9793,
          "f1": 0.663,
          "balancedAccuracy": 0.6611,
          "predictedPositiveRate": 0.7868
        },
        {
          "threshold": 0.14,
          "precision": 0.5292,
          "recall": 0.9627,
          "f1": 0.683,
          "balancedAccuracy": 0.6927,
          "predictedPositiveRate": 0.7324
        },
        {
          "threshold": 0.16,
          "precision": 0.5292,
          "recall": 0.9627,
          "f1": 0.683,
          "balancedAccuracy": 0.6927,
          "predictedPositiveRate": 0.7324
        },
        {
          "threshold": 0.18,
          "precision": 0.5588,
          "recall": 0.9407,
          "f1": 0.7011,
          "balancedAccuracy": 0.7201,
          "predictedPositiveRate": 0.6777
        },
        {
          "threshold": 0.2,
          "precision": 0.5588,
          "recall": 0.9407,
          "f1": 0.7011,
          "balancedAccuracy": 0.7201,
          "predictedPositiveRate": 0.6777
        },
        {
          "threshold": 0.22,
          "precision": 0.5869,
          "recall": 0.914,
          "f1": 0.7148,
          "balancedAccuracy": 0.7403,
          "predictedPositiveRate": 0.627
        },
        {
          "threshold": 0.24,
          "precision": 0.5976,
          "recall": 0.9031,
          "f1": 0.7192,
          "balancedAccuracy": 0.7466,
          "predictedPositiveRate": 0.6084
        },
        {
          "threshold": 0.26,
          "precision": 0.5976,
          "recall": 0.9031,
          "f1": 0.7192,
          "balancedAccuracy": 0.7466,
          "predictedPositiveRate": 0.6084
        },
        {
          "threshold": 0.28,
          "precision": 0.6116,
          "recall": 0.8872,
          "f1": 0.7241,
          "balancedAccuracy": 0.7538,
          "predictedPositiveRate": 0.584
        },
        {
          "threshold": 0.3,
          "precision": 0.6314,
          "recall": 0.8629,
          "f1": 0.7292,
          "balancedAccuracy": 0.7617,
          "predictedPositiveRate": 0.5502
        },
        {
          "threshold": 0.32,
          "precision": 0.6314,
          "recall": 0.8629,
          "f1": 0.7292,
          "balancedAccuracy": 0.7617,
          "predictedPositiveRate": 0.5502
        },
        {
          "threshold": 0.34,
          "precision": 0.6421,
          "recall": 0.8474,
          "f1": 0.7306,
          "balancedAccuracy": 0.7646,
          "predictedPositiveRate": 0.5313
        },
        {
          "threshold": 0.36,
          "precision": 0.6421,
          "recall": 0.8474,
          "f1": 0.7306,
          "balancedAccuracy": 0.7646,
          "predictedPositiveRate": 0.5313
        },
        {
          "threshold": 0.38,
          "precision": 0.6421,
          "recall": 0.8474,
          "f1": 0.7306,
          "balancedAccuracy": 0.7646,
          "predictedPositiveRate": 0.5313
        },
        {
          "threshold": 0.4,
          "precision": 0.6509,
          "recall": 0.8299,
          "f1": 0.7296,
          "balancedAccuracy": 0.765,
          "predictedPositiveRate": 0.5134
        },
        {
          "threshold": 0.42,
          "precision": 0.6672,
          "recall": 0.7981,
          "f1": 0.7268,
          "balancedAccuracy": 0.7649,
          "predictedPositiveRate": 0.4816
        },
        {
          "threshold": 0.44,
          "precision": 0.6917,
          "recall": 0.7486,
          "f1": 0.719,
          "balancedAccuracy": 0.7619,
          "predictedPositiveRate": 0.4357
        },
        {
          "threshold": 0.46,
          "precision": 0.6917,
          "recall": 0.7486,
          "f1": 0.719,
          "balancedAccuracy": 0.7619,
          "predictedPositiveRate": 0.4357
        },
        {
          "threshold": 0.48,
          "precision": 0.7045,
          "recall": 0.7205,
          "f1": 0.7124,
          "balancedAccuracy": 0.7584,
          "predictedPositiveRate": 0.4117
        },
        {
          "threshold": 0.5,
          "precision": 0.7045,
          "recall": 0.7205,
          "f1": 0.7124,
          "balancedAccuracy": 0.7584,
          "predictedPositiveRate": 0.4117
        },
        {
          "threshold": 0.52,
          "precision": 0.7273,
          "recall": 0.6681,
          "f1": 0.6965,
          "balancedAccuracy": 0.7497,
          "predictedPositiveRate": 0.3698
        },
        {
          "threshold": 0.54,
          "precision": 0.7273,
          "recall": 0.6681,
          "f1": 0.6965,
          "balancedAccuracy": 0.7497,
          "predictedPositiveRate": 0.3698
        },
        {
          "threshold": 0.56,
          "precision": 0.7418,
          "recall": 0.6277,
          "f1": 0.68,
          "balancedAccuracy": 0.7402,
          "predictedPositiveRate": 0.3407
        },
        {
          "threshold": 0.58,
          "precision": 0.7418,
          "recall": 0.6277,
          "f1": 0.68,
          "balancedAccuracy": 0.7402,
          "predictedPositiveRate": 0.3407
        },
        {
          "threshold": 0.6,
          "precision": 0.7493,
          "recall": 0.6053,
          "f1": 0.6696,
          "balancedAccuracy": 0.7344,
          "predictedPositiveRate": 0.3252
        },
        {
          "threshold": 0.62,
          "precision": 0.7717,
          "recall": 0.5379,
          "f1": 0.6339,
          "balancedAccuracy": 0.7153,
          "predictedPositiveRate": 0.2806
        },
        {
          "threshold": 0.64,
          "precision": 0.7717,
          "recall": 0.5379,
          "f1": 0.6339,
          "balancedAccuracy": 0.7153,
          "predictedPositiveRate": 0.2806
        },
        {
          "threshold": 0.66,
          "precision": 0.7907,
          "recall": 0.4746,
          "f1": 0.5931,
          "balancedAccuracy": 0.695,
          "predictedPositiveRate": 0.2416
        },
        {
          "threshold": 0.68,
          "precision": 0.7908,
          "recall": 0.4744,
          "f1": 0.593,
          "balancedAccuracy": 0.6949,
          "predictedPositiveRate": 0.2415
        },
        {
          "threshold": 0.7,
          "precision": 0.7908,
          "recall": 0.4744,
          "f1": 0.593,
          "balancedAccuracy": 0.6949,
          "predictedPositiveRate": 0.2415
        },
        {
          "threshold": 0.72,
          "precision": 0.7991,
          "recall": 0.4349,
          "f1": 0.5632,
          "balancedAccuracy": 0.6806,
          "predictedPositiveRate": 0.2191
        },
        {
          "threshold": 0.74,
          "precision": 0.8047,
          "recall": 0.4072,
          "f1": 0.5407,
          "balancedAccuracy": 0.6703,
          "predictedPositiveRate": 0.2037
        },
        {
          "threshold": 0.76,
          "precision": 0.8194,
          "recall": 0.325,
          "f1": 0.4654,
          "balancedAccuracy": 0.6384,
          "predictedPositiveRate": 0.1597
        },
        {
          "threshold": 0.78,
          "precision": 0.8584,
          "recall": 0.1906,
          "f1": 0.312,
          "balancedAccuracy": 0.5847,
          "predictedPositiveRate": 0.0894
        },
        {
          "threshold": 0.8,
          "precision": 0.8598,
          "recall": 0.1869,
          "f1": 0.3071,
          "balancedAccuracy": 0.5832,
          "predictedPositiveRate": 0.0875
        },
        {
          "threshold": 0.82,
          "precision": 0.8598,
          "recall": 0.1869,
          "f1": 0.3071,
          "balancedAccuracy": 0.5832,
          "predictedPositiveRate": 0.0875
        },
        {
          "threshold": 0.84,
          "precision": 0.925,
          "recall": 0.0653,
          "f1": 0.122,
          "balancedAccuracy": 0.5309,
          "predictedPositiveRate": 0.0284
        },
        {
          "threshold": 0.86,
          "precision": 0.925,
          "recall": 0.0653,
          "f1": 0.122,
          "balancedAccuracy": 0.5309,
          "predictedPositiveRate": 0.0284
        },
        {
          "threshold": 0.88,
          "precision": 0.925,
          "recall": 0.0653,
          "f1": 0.122,
          "balancedAccuracy": 0.5309,
          "predictedPositiveRate": 0.0284
        },
        {
          "threshold": 0.9,
          "precision": 0.9379,
          "recall": 0.0485,
          "f1": 0.0923,
          "balancedAccuracy": 0.5232,
          "predictedPositiveRate": 0.0208
        }
      ]
    }
  },
  "calibration": {
    "label": "نتائج على بيانات تجريبية من السوق السعودي",
    "offerModel": {
      "selected": "isotonic",
      "validation": [
        {
          "method": "uncalibrated",
          "validationBrierScore": 0.222213,
          "reliabilityBins": [
            {
              "lower": 0,
              "upper": 0.1,
              "meanPrediction": 0.0814,
              "observedRate": 0.2,
              "count": 15
            },
            {
              "lower": 0.1,
              "upper": 0.2,
              "meanPrediction": 0.1547,
              "observedRate": 0.1948,
              "count": 77
            },
            {
              "lower": 0.2,
              "upper": 0.3,
              "meanPrediction": 0.2531,
              "observedRate": 0.2937,
              "count": 143
            },
            {
              "lower": 0.3,
              "upper": 0.4,
              "meanPrediction": 0.3495,
              "observedRate": 0.3519,
              "count": 162
            },
            {
              "lower": 0.4,
              "upper": 0.5,
              "meanPrediction": 0.4514,
              "observedRate": 0.4044,
              "count": 136
            },
            {
              "lower": 0.5,
              "upper": 0.6,
              "meanPrediction": 0.5482,
              "observedRate": 0.5155,
              "count": 97
            },
            {
              "lower": 0.6,
              "upper": 0.7,
              "meanPrediction": 0.6417,
              "observedRate": 0.617,
              "count": 47
            },
            {
              "lower": 0.7,
              "upper": 0.8,
              "meanPrediction": 0.7488,
              "observedRate": 0.6591,
              "count": 44
            },
            {
              "lower": 0.8,
              "upper": 0.9,
              "meanPrediction": 0.8345,
              "observedRate": 0.6842,
              "count": 19
            }
          ]
        },
        {
          "method": "sigmoid",
          "validationBrierScore": 0.220371,
          "reliabilityBins": [
            {
              "lower": 0.1,
              "upper": 0.2,
              "meanPrediction": 0.1654,
              "observedRate": 0.2174,
              "count": 46
            },
            {
              "lower": 0.2,
              "upper": 0.3,
              "meanPrediction": 0.2582,
              "observedRate": 0.2353,
              "count": 136
            },
            {
              "lower": 0.3,
              "upper": 0.4,
              "meanPrediction": 0.3489,
              "observedRate": 0.3632,
              "count": 223
            },
            {
              "lower": 0.4,
              "upper": 0.5,
              "meanPrediction": 0.4459,
              "observedRate": 0.4,
              "count": 180
            },
            {
              "lower": 0.5,
              "upper": 0.6,
              "meanPrediction": 0.5389,
              "observedRate": 0.6067,
              "count": 89
            },
            {
              "lower": 0.6,
              "upper": 0.7,
              "meanPrediction": 0.6508,
              "observedRate": 0.6667,
              "count": 51
            },
            {
              "lower": 0.7,
              "upper": 0.8,
              "meanPrediction": 0.7371,
              "observedRate": 0.6667,
              "count": 15
            }
          ]
        },
        {
          "method": "isotonic",
          "validationBrierScore": 0.215145,
          "reliabilityBins": [
            {
              "lower": 0,
              "upper": 0.1,
              "meanPrediction": 0,
              "observedRate": 0,
              "count": 3
            },
            {
              "lower": 0.1,
              "upper": 0.2,
              "meanPrediction": 0.186,
              "observedRate": 0.186,
              "count": 86
            },
            {
              "lower": 0.2,
              "upper": 0.3,
              "meanPrediction": 0.2621,
              "observedRate": 0.2621,
              "count": 103
            },
            {
              "lower": 0.3,
              "upper": 0.4,
              "meanPrediction": 0.3154,
              "observedRate": 0.3154,
              "count": 149
            },
            {
              "lower": 0.4,
              "upper": 0.5,
              "meanPrediction": 0.4159,
              "observedRate": 0.4159,
              "count": 214
            },
            {
              "lower": 0.5,
              "upper": 0.6,
              "meanPrediction": 0.5385,
              "observedRate": 0.5385,
              "count": 104
            },
            {
              "lower": 0.7,
              "upper": 0.8,
              "meanPrediction": 0.7125,
              "observedRate": 0.7125,
              "count": 80
            },
            {
              "lower": 0.9,
              "upper": 1,
              "meanPrediction": 1,
              "observedRate": 1,
              "count": 1
            }
          ]
        }
      ],
      "finalTestBrier": 0.224972,
      "finalTestReliabilityBins": [
        {
          "lower": 0,
          "upper": 0.1,
          "meanPrediction": 0,
          "observedRate": 0.5,
          "count": 2
        },
        {
          "lower": 0.1,
          "upper": 0.2,
          "meanPrediction": 0.1835,
          "observedRate": 0.2024,
          "count": 84
        },
        {
          "lower": 0.2,
          "upper": 0.3,
          "meanPrediction": 0.2607,
          "observedRate": 0.2747,
          "count": 91
        },
        {
          "lower": 0.3,
          "upper": 0.4,
          "meanPrediction": 0.3161,
          "observedRate": 0.3469,
          "count": 147
        },
        {
          "lower": 0.4,
          "upper": 0.5,
          "meanPrediction": 0.4161,
          "observedRate": 0.4359,
          "count": 234
        },
        {
          "lower": 0.5,
          "upper": 0.6,
          "meanPrediction": 0.5456,
          "observedRate": 0.6078,
          "count": 102
        },
        {
          "lower": 0.7,
          "upper": 0.8,
          "meanPrediction": 0.7112,
          "observedRate": 0.6835,
          "count": 79
        },
        {
          "lower": 0.8,
          "upper": 0.9,
          "meanPrediction": 0.8384,
          "observedRate": 0,
          "count": 1
        }
      ]
    },
    "purchaseModel": {
      "selected": "isotonic",
      "validation": [
        {
          "method": "uncalibrated",
          "validationBrierScore": 0.162841,
          "reliabilityBins": [
            {
              "lower": 0,
              "upper": 0.1,
              "meanPrediction": 0.0404,
              "observedRate": 0.0277,
              "count": 4622
            },
            {
              "lower": 0.1,
              "upper": 0.2,
              "meanPrediction": 0.1515,
              "observedRate": 0.1025,
              "count": 3121
            },
            {
              "lower": 0.2,
              "upper": 0.3,
              "meanPrediction": 0.2468,
              "observedRate": 0.1811,
              "count": 2501
            },
            {
              "lower": 0.3,
              "upper": 0.4,
              "meanPrediction": 0.3497,
              "observedRate": 0.2554,
              "count": 2169
            },
            {
              "lower": 0.4,
              "upper": 0.5,
              "meanPrediction": 0.4514,
              "observedRate": 0.3596,
              "count": 2230
            },
            {
              "lower": 0.5,
              "upper": 0.6,
              "meanPrediction": 0.5496,
              "observedRate": 0.4557,
              "count": 2710
            },
            {
              "lower": 0.6,
              "upper": 0.7,
              "meanPrediction": 0.6498,
              "observedRate": 0.5659,
              "count": 2730
            },
            {
              "lower": 0.7,
              "upper": 0.8,
              "meanPrediction": 0.7573,
              "observedRate": 0.6953,
              "count": 4007
            },
            {
              "lower": 0.8,
              "upper": 0.9,
              "meanPrediction": 0.8455,
              "observedRate": 0.802,
              "count": 3955
            },
            {
              "lower": 0.9,
              "upper": 1,
              "meanPrediction": 0.9346,
              "observedRate": 0.9351,
              "count": 555
            }
          ]
        },
        {
          "method": "sigmoid",
          "validationBrierScore": 0.158479,
          "reliabilityBins": [
            {
              "lower": 0,
              "upper": 0.1,
              "meanPrediction": 0.0387,
              "observedRate": 0.0391,
              "count": 6056
            },
            {
              "lower": 0.1,
              "upper": 0.2,
              "meanPrediction": 0.1454,
              "observedRate": 0.1507,
              "count": 3644
            },
            {
              "lower": 0.2,
              "upper": 0.3,
              "meanPrediction": 0.2492,
              "observedRate": 0.2437,
              "count": 2478
            },
            {
              "lower": 0.3,
              "upper": 0.4,
              "meanPrediction": 0.3508,
              "observedRate": 0.3497,
              "count": 2285
            },
            {
              "lower": 0.4,
              "upper": 0.5,
              "meanPrediction": 0.4494,
              "observedRate": 0.4444,
              "count": 2579
            },
            {
              "lower": 0.5,
              "upper": 0.6,
              "meanPrediction": 0.5497,
              "observedRate": 0.5433,
              "count": 2470
            },
            {
              "lower": 0.6,
              "upper": 0.7,
              "meanPrediction": 0.6545,
              "observedRate": 0.647,
              "count": 2657
            },
            {
              "lower": 0.7,
              "upper": 0.8,
              "meanPrediction": 0.7466,
              "observedRate": 0.7549,
              "count": 3839
            },
            {
              "lower": 0.8,
              "upper": 0.9,
              "meanPrediction": 0.8377,
              "observedRate": 0.8417,
              "count": 2230
            },
            {
              "lower": 0.9,
              "upper": 1,
              "meanPrediction": 0.9362,
              "observedRate": 0.9475,
              "count": 362
            }
          ]
        },
        {
          "method": "isotonic",
          "validationBrierScore": 0.157874,
          "reliabilityBins": [
            {
              "lower": 0,
              "upper": 0.1,
              "meanPrediction": 0.0389,
              "observedRate": 0.0389,
              "count": 6087
            },
            {
              "lower": 0.1,
              "upper": 0.2,
              "meanPrediction": 0.1424,
              "observedRate": 0.1424,
              "count": 3132
            },
            {
              "lower": 0.2,
              "upper": 0.3,
              "meanPrediction": 0.2455,
              "observedRate": 0.2455,
              "count": 3645
            },
            {
              "lower": 0.3,
              "upper": 0.4,
              "meanPrediction": 0.3605,
              "observedRate": 0.3605,
              "count": 1054
            },
            {
              "lower": 0.4,
              "upper": 0.5,
              "meanPrediction": 0.4336,
              "observedRate": 0.4336,
              "count": 2906
            },
            {
              "lower": 0.5,
              "upper": 0.6,
              "meanPrediction": 0.5362,
              "observedRate": 0.5362,
              "count": 2475
            },
            {
              "lower": 0.6,
              "upper": 0.7,
              "meanPrediction": 0.6295,
              "observedRate": 0.6295,
              "count": 2394
            },
            {
              "lower": 0.7,
              "upper": 0.8,
              "meanPrediction": 0.7516,
              "observedRate": 0.7516,
              "count": 4404
            },
            {
              "lower": 0.8,
              "upper": 0.9,
              "meanPrediction": 0.8353,
              "observedRate": 0.8353,
              "count": 1907
            },
            {
              "lower": 0.9,
              "upper": 1,
              "meanPrediction": 0.9379,
              "observedRate": 0.9379,
              "count": 596
            }
          ]
        }
      ],
      "finalTestBrier": 0.158431,
      "finalTestReliabilityBins": [
        {
          "lower": 0,
          "upper": 0.1,
          "meanPrediction": 0.0393,
          "observedRate": 0.0388,
          "count": 6281
        },
        {
          "lower": 0.1,
          "upper": 0.2,
          "meanPrediction": 0.1425,
          "observedRate": 0.1369,
          "count": 3250
        },
        {
          "lower": 0.2,
          "upper": 0.3,
          "meanPrediction": 0.2455,
          "observedRate": 0.2459,
          "count": 3867
        },
        {
          "lower": 0.3,
          "upper": 0.4,
          "meanPrediction": 0.363,
          "observedRate": 0.3631,
          "count": 1096
        },
        {
          "lower": 0.4,
          "upper": 0.5,
          "meanPrediction": 0.4339,
          "observedRate": 0.433,
          "count": 2871
        },
        {
          "lower": 0.5,
          "upper": 0.6,
          "meanPrediction": 0.5361,
          "observedRate": 0.5281,
          "count": 2513
        },
        {
          "lower": 0.6,
          "upper": 0.7,
          "meanPrediction": 0.6289,
          "observedRate": 0.6274,
          "count": 2587
        },
        {
          "lower": 0.7,
          "upper": 0.8,
          "meanPrediction": 0.7513,
          "observedRate": 0.7493,
          "count": 4603
        },
        {
          "lower": 0.8,
          "upper": 0.9,
          "meanPrediction": 0.8347,
          "observedRate": 0.8159,
          "count": 1972
        },
        {
          "lower": 0.9,
          "upper": 1,
          "meanPrediction": 0.9422,
          "observedRate": 0.9273,
          "count": 660
        }
      ]
    }
  },
  "modelComparison": {
    "label": "نتائج على بيانات تجريبية من السوق السعودي",
    "selectionPeriod": "validation only",
    "offerModel": [
      {
        "modelName": "LogisticRegression",
        "validation": {
          "threshold": 0.14,
          "precision": 0.4011,
          "recall": 0.9966,
          "f1": 0.572,
          "balancedAccuracy": 0.5106,
          "predictedPositiveRate": 0.9838,
          "constraintsSatisfied": false
        },
        "validationRocInputRows": 740,
        "trainingDurationSeconds": 0.117,
        "hyperparameters": {
          "C": 1,
          "class_weight": "balanced",
          "dual": false,
          "fit_intercept": true,
          "intercept_scaling": 1,
          "l1_ratio": null,
          "max_iter": 800,
          "multi_class": "deprecated",
          "n_jobs": null,
          "penalty": "l2",
          "random_state": 20260923,
          "solver": "lbfgs",
          "tol": 0.0001,
          "verbose": 0,
          "warm_start": false
        }
      },
      {
        "modelName": "RandomForestClassifier",
        "validation": {
          "threshold": 0.24,
          "precision": 0.4428,
          "recall": 0.8976,
          "f1": 0.593,
          "balancedAccuracy": 0.5786,
          "predictedPositiveRate": 0.8027,
          "constraintsSatisfied": false
        },
        "validationRocInputRows": 740,
        "trainingDurationSeconds": 0.73,
        "hyperparameters": {
          "bootstrap": true,
          "ccp_alpha": 0,
          "class_weight": "balanced_subsample",
          "criterion": "gini",
          "max_depth": 20,
          "max_features": 0.65,
          "max_leaf_nodes": null,
          "max_samples": null,
          "min_impurity_decrease": 0,
          "min_samples_leaf": 2,
          "min_samples_split": 2,
          "min_weight_fraction_leaf": 0,
          "monotonic_cst": null,
          "n_estimators": 260,
          "n_jobs": -1,
          "oob_score": false,
          "random_state": 20260923,
          "verbose": 0,
          "warm_start": false
        }
      },
      {
        "modelName": "ExtraTreesClassifier",
        "validation": {
          "threshold": 0.4,
          "precision": 0.5051,
          "recall": 0.6758,
          "f1": 0.5781,
          "balancedAccuracy": 0.6209,
          "predictedPositiveRate": 0.5297,
          "constraintsSatisfied": false
        },
        "validationRocInputRows": 740,
        "trainingDurationSeconds": 0.811,
        "hyperparameters": {
          "bootstrap": false,
          "ccp_alpha": 0,
          "class_weight": "balanced",
          "criterion": "gini",
          "max_depth": 22,
          "max_features": 0.85,
          "max_leaf_nodes": null,
          "max_samples": null,
          "min_impurity_decrease": 0,
          "min_samples_leaf": 2,
          "min_samples_split": 2,
          "min_weight_fraction_leaf": 0,
          "monotonic_cst": null,
          "n_estimators": 280,
          "n_jobs": -1,
          "oob_score": false,
          "random_state": 20260923,
          "verbose": 0,
          "warm_start": false
        }
      },
      {
        "modelName": "HistGradientBoostingClassifier",
        "validation": {
          "threshold": 0.12,
          "precision": 0.4393,
          "recall": 0.901,
          "f1": 0.5906,
          "balancedAccuracy": 0.5736,
          "predictedPositiveRate": 0.8122,
          "constraintsSatisfied": false
        },
        "validationRocInputRows": 740,
        "trainingDurationSeconds": 9.521,
        "hyperparameters": {
          "categorical_features": "from_dtype",
          "class_weight": "balanced",
          "early_stopping": "auto",
          "interaction_cst": null,
          "l2_regularization": 0.15,
          "learning_rate": 0.07,
          "loss": "log_loss",
          "max_bins": 255,
          "max_depth": null,
          "max_features": 1,
          "max_iter": 220,
          "max_leaf_nodes": 63,
          "min_samples_leaf": 15,
          "monotonic_cst": null,
          "n_iter_no_change": 10,
          "random_state": 20260923,
          "scoring": "loss",
          "tol": 1e-7,
          "validation_fraction": 0.1,
          "verbose": 0,
          "warm_start": false
        }
      },
      {
        "modelName": "GradientBoostingClassifier",
        "validation": {
          "threshold": 0.38,
          "precision": 0.4785,
          "recall": 0.7611,
          "f1": 0.5876,
          "balancedAccuracy": 0.6087,
          "predictedPositiveRate": 0.6297,
          "constraintsSatisfied": false
        },
        "validationRocInputRows": 740,
        "trainingDurationSeconds": 3.235,
        "hyperparameters": {
          "ccp_alpha": 0,
          "criterion": "friedman_mse",
          "init": null,
          "learning_rate": 0.05,
          "loss": "log_loss",
          "max_depth": 4,
          "max_features": null,
          "max_leaf_nodes": null,
          "min_impurity_decrease": 0,
          "min_samples_leaf": 15,
          "min_samples_split": 2,
          "min_weight_fraction_leaf": 0,
          "n_estimators": 170,
          "n_iter_no_change": null,
          "random_state": 20260923,
          "subsample": 0.85,
          "tol": 0.0001,
          "validation_fraction": 0.1,
          "verbose": 0,
          "warm_start": false
        }
      }
    ],
    "purchaseModel": [
      {
        "modelName": "LogisticRegression",
        "validation": {
          "threshold": 0.42,
          "precision": 0.6189,
          "recall": 0.8517,
          "f1": 0.7169,
          "balancedAccuracy": 0.7491,
          "predictedPositiveRate": 0.554,
          "constraintsSatisfied": false
        },
        "validationRocInputRows": 28600,
        "trainingDurationSeconds": 1.812,
        "hyperparameters": {
          "C": 1,
          "class_weight": "balanced",
          "dual": false,
          "fit_intercept": true,
          "intercept_scaling": 1,
          "l1_ratio": null,
          "max_iter": 800,
          "multi_class": "deprecated",
          "n_jobs": null,
          "penalty": "l2",
          "random_state": 20260923,
          "solver": "lbfgs",
          "tol": 0.0001,
          "verbose": 0,
          "warm_start": false
        }
      },
      {
        "modelName": "RandomForestClassifier",
        "validation": {
          "threshold": 0.42,
          "precision": 0.6556,
          "recall": 0.807,
          "f1": 0.7235,
          "balancedAccuracy": 0.7606,
          "predictedPositiveRate": 0.4956,
          "constraintsSatisfied": false
        },
        "validationRocInputRows": 28600,
        "trainingDurationSeconds": 38.095,
        "hyperparameters": {
          "bootstrap": true,
          "ccp_alpha": 0,
          "class_weight": "balanced_subsample",
          "criterion": "gini",
          "max_depth": 20,
          "max_features": 0.65,
          "max_leaf_nodes": null,
          "max_samples": null,
          "min_impurity_decrease": 0,
          "min_samples_leaf": 2,
          "min_samples_split": 2,
          "min_weight_fraction_leaf": 0,
          "monotonic_cst": null,
          "n_estimators": 260,
          "n_jobs": -1,
          "oob_score": false,
          "random_state": 20260923,
          "verbose": 0,
          "warm_start": false
        }
      },
      {
        "modelName": "ExtraTreesClassifier",
        "validation": {
          "threshold": 0.36,
          "precision": 0.6283,
          "recall": 0.8456,
          "f1": 0.7209,
          "balancedAccuracy": 0.7543,
          "predictedPositiveRate": 0.5418,
          "constraintsSatisfied": false
        },
        "validationRocInputRows": 28600,
        "trainingDurationSeconds": 12.486,
        "hyperparameters": {
          "bootstrap": false,
          "ccp_alpha": 0,
          "class_weight": "balanced",
          "criterion": "gini",
          "max_depth": 22,
          "max_features": 0.85,
          "max_leaf_nodes": null,
          "max_samples": null,
          "min_impurity_decrease": 0,
          "min_samples_leaf": 2,
          "min_samples_split": 2,
          "min_weight_fraction_leaf": 0,
          "monotonic_cst": null,
          "n_estimators": 280,
          "n_jobs": -1,
          "oob_score": false,
          "random_state": 20260923,
          "verbose": 0,
          "warm_start": false
        }
      },
      {
        "modelName": "HistGradientBoostingClassifier",
        "validation": {
          "threshold": 0.44,
          "precision": 0.639,
          "recall": 0.851,
          "f1": 0.7299,
          "balancedAccuracy": 0.7635,
          "predictedPositiveRate": 0.5361,
          "constraintsSatisfied": false
        },
        "validationRocInputRows": 28600,
        "trainingDurationSeconds": 1.961,
        "hyperparameters": {
          "categorical_features": "from_dtype",
          "class_weight": "balanced",
          "early_stopping": "auto",
          "interaction_cst": null,
          "l2_regularization": 0.15,
          "learning_rate": 0.07,
          "loss": "log_loss",
          "max_bins": 255,
          "max_depth": null,
          "max_features": 1,
          "max_iter": 220,
          "max_leaf_nodes": 63,
          "min_samples_leaf": 15,
          "monotonic_cst": null,
          "n_iter_no_change": 10,
          "random_state": 20260923,
          "scoring": "loss",
          "tol": 1e-7,
          "validation_fraction": 0.1,
          "verbose": 0,
          "warm_start": false
        }
      },
      {
        "modelName": "GradientBoostingClassifier",
        "validation": {
          "threshold": 0.44,
          "precision": 0.6358,
          "recall": 0.8518,
          "f1": 0.7281,
          "balancedAccuracy": 0.7615,
          "predictedPositiveRate": 0.5394,
          "constraintsSatisfied": false
        },
        "validationRocInputRows": 28600,
        "trainingDurationSeconds": 262.85,
        "hyperparameters": {
          "ccp_alpha": 0,
          "criterion": "friedman_mse",
          "init": null,
          "learning_rate": 0.05,
          "loss": "log_loss",
          "max_depth": 4,
          "max_features": null,
          "max_leaf_nodes": null,
          "min_impurity_decrease": 0,
          "min_samples_leaf": 15,
          "min_samples_split": 2,
          "min_weight_fraction_leaf": 0,
          "n_estimators": 170,
          "n_iter_no_change": null,
          "random_state": 20260923,
          "subsample": 0.85,
          "tol": 0.0001,
          "validation_fraction": 0.1,
          "verbose": 0,
          "warm_start": false
        }
      }
    ]
  }
};
