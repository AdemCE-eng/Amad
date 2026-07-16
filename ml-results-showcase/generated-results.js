window.NADEEM_RESULTS = {
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
  },
  "dlBenchmark": {
    "datasetManifest": {
      "label": "MOCK / SYNTHETIC DEEP-LEARNING BENCHMARK — SAUDI MARKET",
      "dataLabel": "MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET",
      "datasetVersion": "synthetic-saudi-v2",
      "randomSeed": 20260923,
      "counts": {
        "merchants": 20,
        "fictionalUsers": 220,
        "campaigns": 2047,
        "transactions": 95063
      },
      "inputCsv": {
        "merchant_catalog.csv": {
          "sha256": "f7a6c87ac5a7506cdadac1b721433540644a05b81a1211d278db91928a96b738",
          "bytes": 2562
        },
        "merchant_campaigns.csv": {
          "sha256": "312cc8ca7234c8a144f9156de6689804b925863e3d4d9a298f819e69d484975f",
          "bytes": 241275
        },
        "user_transactions.csv": {
          "sha256": "e78e31a9ffb253896c57faa4cd787c99635ab2615bb8d840a5304770657f61cc",
          "bytes": 12729885
        }
      },
      "candidateHashAlgorithm": "SHA-256 of pandas hash_pandas_object uint64 bytes in stable row order",
      "engines": {
        "offer": {
          "candidateRows": 4920,
          "positiveRate": 0.416057,
          "sha256": "3361d1319d054669718c70b6008d43f79497989e6b34efadf21f4400307a1064",
          "split": {
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
          "testSha256": "cbbcacf6424ec88dce036116b1fc66082eddad202bc544bb1396179934fdd4be"
        },
        "purchase": {
          "candidateRows": 191830,
          "positiveRate": 0.402742,
          "sha256": "b90475337e38f11b5e09dead5ead1796675123ce5c5eb11488290e7bc7f74d9c",
          "split": {
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
          "testSha256": "3569b55d17d4db5eb07e3ec82fae523dc63de4521253abf898c056c81365c30f"
        }
      },
      "frozenAcrossFamilies": true,
      "containsRealPersonalData": false
    },
    "experimentHistory": {
      "label": "MOCK / SYNTHETIC DEEP-LEARNING BENCHMARK — SAUDI MARKET",
      "runs": [
        {
          "engine": "offer",
          "modelName": "LogisticRegression",
          "configuration": {
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
          },
          "randomSeed": 20260923,
          "epochsOrTrees": 800,
          "bestValidationEpoch": null,
          "trainingDurationSeconds": 0.117,
          "validation": {
            "threshold": 0.14,
            "precision": 0.4011,
            "recall": 0.9966,
            "f1": 0.572,
            "balancedAccuracy": 0.5106,
            "predictedPositiveRate": 0.9838,
            "constraintsSatisfied": false
          },
          "source": "existing frozen baseline search"
        },
        {
          "engine": "offer",
          "modelName": "RandomForestClassifier",
          "configuration": {
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
          },
          "randomSeed": 20260923,
          "epochsOrTrees": 260,
          "bestValidationEpoch": null,
          "trainingDurationSeconds": 0.73,
          "validation": {
            "threshold": 0.24,
            "precision": 0.4428,
            "recall": 0.8976,
            "f1": 0.593,
            "balancedAccuracy": 0.5786,
            "predictedPositiveRate": 0.8027,
            "constraintsSatisfied": false
          },
          "source": "existing frozen baseline search"
        },
        {
          "engine": "offer",
          "modelName": "ExtraTreesClassifier",
          "configuration": {
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
          },
          "randomSeed": 20260923,
          "epochsOrTrees": 280,
          "bestValidationEpoch": null,
          "trainingDurationSeconds": 0.811,
          "validation": {
            "threshold": 0.4,
            "precision": 0.5051,
            "recall": 0.6758,
            "f1": 0.5781,
            "balancedAccuracy": 0.6209,
            "predictedPositiveRate": 0.5297,
            "constraintsSatisfied": false
          },
          "source": "existing frozen baseline search"
        },
        {
          "engine": "offer",
          "modelName": "HistGradientBoostingClassifier",
          "configuration": {
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
          },
          "randomSeed": 20260923,
          "epochsOrTrees": 220,
          "bestValidationEpoch": null,
          "trainingDurationSeconds": 9.521,
          "validation": {
            "threshold": 0.12,
            "precision": 0.4393,
            "recall": 0.901,
            "f1": 0.5906,
            "balancedAccuracy": 0.5736,
            "predictedPositiveRate": 0.8122,
            "constraintsSatisfied": false
          },
          "source": "existing frozen baseline search"
        },
        {
          "engine": "offer",
          "modelName": "GradientBoostingClassifier",
          "configuration": {
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
          },
          "randomSeed": 20260923,
          "epochsOrTrees": 170,
          "bestValidationEpoch": null,
          "trainingDurationSeconds": 3.235,
          "validation": {
            "threshold": 0.38,
            "precision": 0.4785,
            "recall": 0.7611,
            "f1": 0.5876,
            "balancedAccuracy": 0.6087,
            "predictedPositiveRate": 0.6297,
            "constraintsSatisfied": false
          },
          "source": "existing frozen baseline search"
        },
        {
          "engine": "purchase",
          "modelName": "LogisticRegression",
          "configuration": {
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
          },
          "randomSeed": 20260923,
          "epochsOrTrees": 800,
          "bestValidationEpoch": null,
          "trainingDurationSeconds": 1.812,
          "validation": {
            "threshold": 0.42,
            "precision": 0.6189,
            "recall": 0.8517,
            "f1": 0.7169,
            "balancedAccuracy": 0.7491,
            "predictedPositiveRate": 0.554,
            "constraintsSatisfied": false
          },
          "source": "existing frozen baseline search"
        },
        {
          "engine": "purchase",
          "modelName": "RandomForestClassifier",
          "configuration": {
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
          },
          "randomSeed": 20260923,
          "epochsOrTrees": 260,
          "bestValidationEpoch": null,
          "trainingDurationSeconds": 38.095,
          "validation": {
            "threshold": 0.42,
            "precision": 0.6556,
            "recall": 0.807,
            "f1": 0.7235,
            "balancedAccuracy": 0.7606,
            "predictedPositiveRate": 0.4956,
            "constraintsSatisfied": false
          },
          "source": "existing frozen baseline search"
        },
        {
          "engine": "purchase",
          "modelName": "ExtraTreesClassifier",
          "configuration": {
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
          },
          "randomSeed": 20260923,
          "epochsOrTrees": 280,
          "bestValidationEpoch": null,
          "trainingDurationSeconds": 12.486,
          "validation": {
            "threshold": 0.36,
            "precision": 0.6283,
            "recall": 0.8456,
            "f1": 0.7209,
            "balancedAccuracy": 0.7543,
            "predictedPositiveRate": 0.5418,
            "constraintsSatisfied": false
          },
          "source": "existing frozen baseline search"
        },
        {
          "engine": "purchase",
          "modelName": "HistGradientBoostingClassifier",
          "configuration": {
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
          },
          "randomSeed": 20260923,
          "epochsOrTrees": 220,
          "bestValidationEpoch": null,
          "trainingDurationSeconds": 1.961,
          "validation": {
            "threshold": 0.44,
            "precision": 0.639,
            "recall": 0.851,
            "f1": 0.7299,
            "balancedAccuracy": 0.7635,
            "predictedPositiveRate": 0.5361,
            "constraintsSatisfied": false
          },
          "source": "existing frozen baseline search"
        },
        {
          "engine": "purchase",
          "modelName": "GradientBoostingClassifier",
          "configuration": {
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
          },
          "randomSeed": 20260923,
          "epochsOrTrees": 170,
          "bestValidationEpoch": null,
          "trainingDurationSeconds": 262.85,
          "validation": {
            "threshold": 0.44,
            "precision": 0.6358,
            "recall": 0.8518,
            "f1": 0.7281,
            "balancedAccuracy": 0.7615,
            "predictedPositiveRate": 0.5394,
            "constraintsSatisfied": false
          },
          "source": "existing frozen baseline search"
        },
        {
          "engine": "offer",
          "modelName": "CatBoostClassifier",
          "configurationId": 1,
          "configuration": {
            "iterations": 320,
            "depth": 6,
            "learning_rate": 0.05,
            "l2_leaf_reg": 4,
            "auto_class_weights": "Balanced"
          },
          "randomSeed": 20260923,
          "epochsOrTrees": 28,
          "bestValidationEpoch": 27,
          "trainingDurationSeconds": 3.107,
          "validation": {
            "threshold": 0.38,
            "precision": 0.4491,
            "recall": 0.8874,
            "f1": 0.5963,
            "balancedAccuracy": 0.5869,
            "predictedPositiveRate": 0.7824,
            "constraintsSatisfied": false,
            "rocAuc": 0.6775,
            "brierScore": 0.225484
          }
        },
        {
          "engine": "offer",
          "modelName": "CatBoostClassifier",
          "configurationId": 2,
          "configuration": {
            "iterations": 420,
            "depth": 8,
            "learning_rate": 0.035,
            "l2_leaf_reg": 7,
            "auto_class_weights": "Balanced"
          },
          "randomSeed": 20260923,
          "epochsOrTrees": 17,
          "bestValidationEpoch": 16,
          "trainingDurationSeconds": 2.782,
          "validation": {
            "threshold": 0.4,
            "precision": 0.4346,
            "recall": 0.9078,
            "f1": 0.5878,
            "balancedAccuracy": 0.5669,
            "predictedPositiveRate": 0.827,
            "constraintsSatisfied": false,
            "rocAuc": 0.6627,
            "brierScore": 0.232213
          }
        },
        {
          "engine": "purchase",
          "modelName": "CatBoostClassifier",
          "configurationId": 1,
          "configuration": {
            "iterations": 320,
            "depth": 6,
            "learning_rate": 0.05,
            "l2_leaf_reg": 4,
            "auto_class_weights": "Balanced"
          },
          "randomSeed": 20260923,
          "epochsOrTrees": 96,
          "bestValidationEpoch": 95,
          "trainingDurationSeconds": 12.873,
          "validation": {
            "threshold": 0.46,
            "precision": 0.6392,
            "recall": 0.8447,
            "f1": 0.7277,
            "balancedAccuracy": 0.7617,
            "predictedPositiveRate": 0.532,
            "constraintsSatisfied": false,
            "rocAuc": 0.8389,
            "brierScore": 0.164847
          }
        },
        {
          "engine": "purchase",
          "modelName": "CatBoostClassifier",
          "configurationId": 2,
          "configuration": {
            "iterations": 420,
            "depth": 8,
            "learning_rate": 0.035,
            "l2_leaf_reg": 7,
            "auto_class_weights": "Balanced"
          },
          "randomSeed": 20260923,
          "epochsOrTrees": 3,
          "bestValidationEpoch": 2,
          "trainingDurationSeconds": 4.501,
          "validation": {
            "threshold": 0.5,
            "precision": 0.6339,
            "recall": 0.8236,
            "f1": 0.7164,
            "balancedAccuracy": 0.7516,
            "predictedPositiveRate": 0.523,
            "constraintsSatisfied": false,
            "rocAuc": 0.8276,
            "brierScore": 0.228906
          }
        },
        {
          "engine": "offer",
          "modelName": "EmbeddingMLP",
          "configurationId": 1,
          "configuration": {
            "hidden": [
              128,
              64,
              32
            ],
            "dropout": 0.15,
            "embeddingDim": 12,
            "epochs": 14,
            "batchSize": 1024,
            "learningRate": 0.001,
            "weightDecay": 0.0001,
            "patience": 3
          },
          "randomSeed": 20260923,
          "epochsOrTrees": 5,
          "bestValidationEpoch": 2,
          "trainingDurationSeconds": 1.344,
          "validation": {
            "threshold": 0.36,
            "precision": 0.4225,
            "recall": 0.9488,
            "f1": 0.5846,
            "balancedAccuracy": 0.5493,
            "predictedPositiveRate": 0.8892,
            "constraintsSatisfied": false,
            "rocAuc": 0.6178,
            "brierScore": 0.236621
          }
        },
        {
          "engine": "offer",
          "modelName": "EmbeddingMLP",
          "configurationId": 2,
          "configuration": {
            "hidden": [
              96,
              48,
              24
            ],
            "dropout": 0.25,
            "embeddingDim": 8,
            "epochs": 14,
            "batchSize": 1024,
            "learningRate": 0.0006,
            "weightDecay": 0.0003,
            "patience": 3
          },
          "randomSeed": 20260923,
          "epochsOrTrees": 4,
          "bestValidationEpoch": 1,
          "trainingDurationSeconds": 1.053,
          "validation": {
            "threshold": 0.1,
            "precision": 0.3959,
            "recall": 1,
            "f1": 0.5673,
            "balancedAccuracy": 0.5,
            "predictedPositiveRate": 1,
            "constraintsSatisfied": false,
            "rocAuc": 0.5411,
            "brierScore": 0.245516
          }
        },
        {
          "engine": "purchase",
          "modelName": "EmbeddingMLP",
          "configurationId": 1,
          "configuration": {
            "hidden": [
              128,
              64,
              32
            ],
            "dropout": 0.15,
            "embeddingDim": 12,
            "epochs": 14,
            "batchSize": 1024,
            "learningRate": 0.001,
            "weightDecay": 0.0001,
            "patience": 3
          },
          "randomSeed": 20260923,
          "epochsOrTrees": 14,
          "bestValidationEpoch": 12,
          "trainingDurationSeconds": 52.808,
          "validation": {
            "threshold": 0.46,
            "precision": 0.6485,
            "recall": 0.833,
            "f1": 0.7293,
            "balancedAccuracy": 0.7644,
            "predictedPositiveRate": 0.5171,
            "constraintsSatisfied": false,
            "rocAuc": 0.8389,
            "brierScore": 0.16418
          }
        },
        {
          "engine": "purchase",
          "modelName": "EmbeddingMLP",
          "configurationId": 2,
          "configuration": {
            "hidden": [
              96,
              48,
              24
            ],
            "dropout": 0.25,
            "embeddingDim": 8,
            "epochs": 14,
            "batchSize": 1024,
            "learningRate": 0.0006,
            "weightDecay": 0.0003,
            "patience": 3
          },
          "randomSeed": 20260923,
          "epochsOrTrees": 14,
          "bestValidationEpoch": 14,
          "trainingDurationSeconds": 51.212,
          "validation": {
            "threshold": 0.44,
            "precision": 0.6376,
            "recall": 0.8418,
            "f1": 0.7256,
            "balancedAccuracy": 0.7597,
            "predictedPositiveRate": 0.5315,
            "constraintsSatisfied": false,
            "rocAuc": 0.8376,
            "brierScore": 0.165189
          }
        },
        {
          "engine": "purchase",
          "modelName": "PurchaseGRU",
          "configurationId": 1,
          "configuration": {
            "embeddingDim": 8,
            "hiddenDim": 32,
            "dropout": 0.2,
            "epochs": 6,
            "batchSize": 512,
            "learningRate": 0.0008,
            "weightDecay": 0.0002,
            "patience": 2
          },
          "randomSeed": 20260923,
          "epochsOrTrees": 6,
          "bestValidationEpoch": 6,
          "trainingDurationSeconds": 515.732,
          "validation": {
            "threshold": 0.46,
            "precision": 0.6439,
            "recall": 0.8308,
            "f1": 0.7255,
            "balancedAccuracy": 0.7606,
            "predictedPositiveRate": 0.5194,
            "constraintsSatisfied": false,
            "rocAuc": 0.8374,
            "brierScore": 0.165281
          }
        }
      ],
      "configurationCount": 19
    },
    "validationMetrics": {
      "label": "MOCK / SYNTHETIC DEEP-LEARNING BENCHMARK — SAUDI MARKET",
      "engines": {
        "offer": {
          "currentBaseline": {
            "threshold": 0.3,
            "precision": 0.4562,
            "recall": 0.8532,
            "f1": 0.5945,
            "balancedAccuracy": 0.5933,
            "predictedPositiveRate": 0.7405,
            "constraintsSatisfied": false
          },
          "CatBoostClassifier": {
            "threshold": 0.28,
            "precision": 0.4528,
            "recall": 0.884,
            "f1": 0.5988,
            "balancedAccuracy": 0.5919,
            "predictedPositiveRate": 0.773,
            "constraintsSatisfied": false,
            "rocAuc": 0.6915,
            "brierScore": 0.209525
          },
          "EmbeddingMLP": {
            "threshold": 0.28,
            "precision": 0.4221,
            "recall": 0.9249,
            "f1": 0.5797,
            "balancedAccuracy": 0.5475,
            "predictedPositiveRate": 0.8676,
            "constraintsSatisfied": false,
            "rocAuc": 0.6178,
            "brierScore": 0.227105
          }
        },
        "purchase": {
          "currentBaseline": {
            "threshold": 0.34,
            "precision": 0.6421,
            "recall": 0.8474,
            "f1": 0.7306,
            "balancedAccuracy": 0.7646,
            "predictedPositiveRate": 0.5313,
            "constraintsSatisfied": false
          },
          "CatBoostClassifier": {
            "threshold": 0.34,
            "precision": 0.6357,
            "recall": 0.8516,
            "f1": 0.728,
            "balancedAccuracy": 0.7614,
            "predictedPositiveRate": 0.5393,
            "constraintsSatisfied": false,
            "rocAuc": 0.8397,
            "brierScore": 0.15944
          },
          "EmbeddingMLP": {
            "threshold": 0.38,
            "precision": 0.6511,
            "recall": 0.8269,
            "f1": 0.7285,
            "balancedAccuracy": 0.7641,
            "predictedPositiveRate": 0.5113,
            "constraintsSatisfied": false,
            "rocAuc": 0.8389,
            "brierScore": 0.159995
          },
          "PurchaseGRU": {
            "threshold": 0.36,
            "precision": 0.6391,
            "recall": 0.8396,
            "f1": 0.7258,
            "balancedAccuracy": 0.7601,
            "predictedPositiveRate": 0.5288,
            "constraintsSatisfied": false,
            "rocAuc": 0.8374,
            "brierScore": 0.160878
          }
        }
      }
    },
    "testMetrics": {
      "label": "MOCK / SYNTHETIC DEEP-LEARNING BENCHMARK — SAUDI MARKET",
      "engines": {
        "offer": {
          "currentBaseline": {
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
          "CatBoostClassifier": {
            "accuracy": 0.5392,
            "balancedAccuracy": 0.5877,
            "precision": 0.4754,
            "recall": 0.8974,
            "f1": 0.6215,
            "rocAuc": 0.6711,
            "brierScore": 0.222888,
            "threshold": 0.28,
            "testRows": 740,
            "confusionMatrix": [
              [
                119,
                309
              ],
              [
                32,
                280
              ]
            ]
          },
          "EmbeddingMLP": {
            "accuracy": 0.4851,
            "balancedAccuracy": 0.5445,
            "precision": 0.4465,
            "recall": 0.9231,
            "f1": 0.6019,
            "rocAuc": 0.6143,
            "brierScore": 0.234572,
            "threshold": 0.28,
            "testRows": 740,
            "confusionMatrix": [
              [
                71,
                357
              ],
              [
                24,
                288
              ]
            ]
          }
        },
        "purchase": {
          "currentBaseline": {
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
          },
          "CatBoostClassifier": {
            "accuracy": 0.7407,
            "balancedAccuracy": 0.7586,
            "precision": 0.6313,
            "recall": 0.8485,
            "f1": 0.724,
            "rocAuc": 0.8391,
            "brierScore": 0.1599,
            "threshold": 0.34,
            "testRows": 29700,
            "confusionMatrix": [
              [
                11902,
                5897
              ],
              [
                1803,
                10098
              ]
            ]
          },
          "EmbeddingMLP": {
            "accuracy": 0.7512,
            "balancedAccuracy": 0.7635,
            "precision": 0.649,
            "recall": 0.8256,
            "f1": 0.7267,
            "rocAuc": 0.8397,
            "brierScore": 0.159521,
            "threshold": 0.38,
            "testRows": 29700,
            "confusionMatrix": [
              [
                12486,
                5313
              ],
              [
                2076,
                9825
              ]
            ]
          },
          "PurchaseGRU": {
            "accuracy": 0.7436,
            "balancedAccuracy": 0.7595,
            "precision": 0.6365,
            "recall": 0.8395,
            "f1": 0.724,
            "rocAuc": 0.8374,
            "brierScore": 0.160711,
            "threshold": 0.36,
            "testRows": 29700,
            "confusionMatrix": [
              [
                12093,
                5706
              ],
              [
                1910,
                9991
              ]
            ]
          }
        }
      },
      "evaluationPolicy": "one untouched-test evaluation per validation-selected family finalist"
    },
    "baselineComparison": {
      "label": "MOCK / SYNTHETIC DEEP-LEARNING BENCHMARK — SAUDI MARKET",
      "resultsLabelAr": "نتائج على بيانات تجريبية من السوق السعودي",
      "nonProductionNoticeAr": "هذه النتائج لا تمثل أداءً إنتاجياً على بيانات عملاء حقيقية",
      "finalists": {
        "offer": {
          "currentBaseline": {
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
          "CatBoostClassifier": {
            "accuracy": 0.5392,
            "balancedAccuracy": 0.5877,
            "precision": 0.4754,
            "recall": 0.8974,
            "f1": 0.6215,
            "rocAuc": 0.6711,
            "brierScore": 0.222888,
            "threshold": 0.28,
            "testRows": 740,
            "confusionMatrix": [
              [
                119,
                309
              ],
              [
                32,
                280
              ]
            ]
          },
          "EmbeddingMLP": {
            "accuracy": 0.4851,
            "balancedAccuracy": 0.5445,
            "precision": 0.4465,
            "recall": 0.9231,
            "f1": 0.6019,
            "rocAuc": 0.6143,
            "brierScore": 0.234572,
            "threshold": 0.28,
            "testRows": 740,
            "confusionMatrix": [
              [
                71,
                357
              ],
              [
                24,
                288
              ]
            ]
          }
        },
        "purchase": {
          "currentBaseline": {
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
          },
          "CatBoostClassifier": {
            "accuracy": 0.7407,
            "balancedAccuracy": 0.7586,
            "precision": 0.6313,
            "recall": 0.8485,
            "f1": 0.724,
            "rocAuc": 0.8391,
            "brierScore": 0.1599,
            "threshold": 0.34,
            "testRows": 29700,
            "confusionMatrix": [
              [
                11902,
                5897
              ],
              [
                1803,
                10098
              ]
            ]
          },
          "EmbeddingMLP": {
            "accuracy": 0.7512,
            "balancedAccuracy": 0.7635,
            "precision": 0.649,
            "recall": 0.8256,
            "f1": 0.7267,
            "rocAuc": 0.8397,
            "brierScore": 0.159521,
            "threshold": 0.38,
            "testRows": 29700,
            "confusionMatrix": [
              [
                12486,
                5313
              ],
              [
                2076,
                9825
              ]
            ]
          },
          "PurchaseGRU": {
            "accuracy": 0.7436,
            "balancedAccuracy": 0.7595,
            "precision": 0.6365,
            "recall": 0.8395,
            "f1": 0.724,
            "rocAuc": 0.8374,
            "brierScore": 0.160711,
            "threshold": 0.36,
            "testRows": 29700,
            "confusionMatrix": [
              [
                12093,
                5706
              ],
              [
                1910,
                9991
              ]
            ]
          }
        }
      },
      "validationSelectedStrongestTabular": {
        "offer": "CatBoostClassifier",
        "purchase": "currentBaseline"
      },
      "validationSelectedNeural": {
        "offer": "EmbeddingMLP",
        "purchase": "EmbeddingMLP"
      },
      "selectedModels": {
        "offer": "CatBoostClassifier",
        "purchase": "currentBaseline"
      }
    },
    "thresholdComparison": {
      "label": "MOCK / SYNTHETIC DEEP-LEARNING BENCHMARK — SAUDI MARKET",
      "source": "validation only",
      "searchRange": [
        0.1,
        0.9
      ],
      "step": 0.02,
      "engines": {
        "offer": {
          "currentBaseline": {
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
          "CatBoostClassifier": {
            "selected": {
              "threshold": 0.28,
              "precision": 0.4528,
              "recall": 0.884,
              "f1": 0.5988,
              "balancedAccuracy": 0.5919,
              "predictedPositiveRate": 0.773,
              "constraintsSatisfied": false
            },
            "rows": [
              {
                "threshold": 0.1,
                "precision": 0.4028,
                "recall": 0.9966,
                "f1": 0.5737,
                "balancedAccuracy": 0.514,
                "predictedPositiveRate": 0.9797
              },
              {
                "threshold": 0.12,
                "precision": 0.4028,
                "recall": 0.9966,
                "f1": 0.5737,
                "balancedAccuracy": 0.514,
                "predictedPositiveRate": 0.9797
              },
              {
                "threshold": 0.14,
                "precision": 0.4117,
                "recall": 0.9863,
                "f1": 0.5809,
                "balancedAccuracy": 0.5312,
                "predictedPositiveRate": 0.9486
              },
              {
                "threshold": 0.16,
                "precision": 0.4117,
                "recall": 0.9863,
                "f1": 0.5809,
                "balancedAccuracy": 0.5312,
                "predictedPositiveRate": 0.9486
              },
              {
                "threshold": 0.18,
                "precision": 0.4117,
                "recall": 0.9863,
                "f1": 0.5809,
                "balancedAccuracy": 0.5312,
                "predictedPositiveRate": 0.9486
              },
              {
                "threshold": 0.2,
                "precision": 0.4185,
                "recall": 0.9727,
                "f1": 0.5852,
                "balancedAccuracy": 0.5434,
                "predictedPositiveRate": 0.9203
              },
              {
                "threshold": 0.22,
                "precision": 0.4185,
                "recall": 0.9727,
                "f1": 0.5852,
                "balancedAccuracy": 0.5434,
                "predictedPositiveRate": 0.9203
              },
              {
                "threshold": 0.24,
                "precision": 0.4448,
                "recall": 0.9078,
                "f1": 0.5971,
                "balancedAccuracy": 0.5826,
                "predictedPositiveRate": 0.8081
              },
              {
                "threshold": 0.26,
                "precision": 0.4448,
                "recall": 0.9078,
                "f1": 0.5971,
                "balancedAccuracy": 0.5826,
                "predictedPositiveRate": 0.8081
              },
              {
                "threshold": 0.28,
                "precision": 0.4528,
                "recall": 0.884,
                "f1": 0.5988,
                "balancedAccuracy": 0.5919,
                "predictedPositiveRate": 0.773
              },
              {
                "threshold": 0.3,
                "precision": 0.4528,
                "recall": 0.884,
                "f1": 0.5988,
                "balancedAccuracy": 0.5919,
                "predictedPositiveRate": 0.773
              },
              {
                "threshold": 0.32,
                "precision": 0.4528,
                "recall": 0.884,
                "f1": 0.5988,
                "balancedAccuracy": 0.5919,
                "predictedPositiveRate": 0.773
              },
              {
                "threshold": 0.34,
                "precision": 0.5675,
                "recall": 0.5597,
                "f1": 0.5636,
                "balancedAccuracy": 0.64,
                "predictedPositiveRate": 0.3905
              },
              {
                "threshold": 0.36,
                "precision": 0.5675,
                "recall": 0.5597,
                "f1": 0.5636,
                "balancedAccuracy": 0.64,
                "predictedPositiveRate": 0.3905
              },
              {
                "threshold": 0.38,
                "precision": 0.5675,
                "recall": 0.5597,
                "f1": 0.5636,
                "balancedAccuracy": 0.64,
                "predictedPositiveRate": 0.3905
              },
              {
                "threshold": 0.4,
                "precision": 0.5675,
                "recall": 0.5597,
                "f1": 0.5636,
                "balancedAccuracy": 0.64,
                "predictedPositiveRate": 0.3905
              },
              {
                "threshold": 0.42,
                "precision": 0.6386,
                "recall": 0.4403,
                "f1": 0.5212,
                "balancedAccuracy": 0.6385,
                "predictedPositiveRate": 0.273
              },
              {
                "threshold": 0.44,
                "precision": 0.6386,
                "recall": 0.4403,
                "f1": 0.5212,
                "balancedAccuracy": 0.6385,
                "predictedPositiveRate": 0.273
              },
              {
                "threshold": 0.46,
                "precision": 0.6477,
                "recall": 0.4266,
                "f1": 0.5144,
                "balancedAccuracy": 0.6372,
                "predictedPositiveRate": 0.2608
              },
              {
                "threshold": 0.48,
                "precision": 0.6477,
                "recall": 0.4266,
                "f1": 0.5144,
                "balancedAccuracy": 0.6372,
                "predictedPositiveRate": 0.2608
              },
              {
                "threshold": 0.5,
                "precision": 0.6477,
                "recall": 0.4266,
                "f1": 0.5144,
                "balancedAccuracy": 0.6372,
                "predictedPositiveRate": 0.2608
              },
              {
                "threshold": 0.52,
                "precision": 0.6477,
                "recall": 0.4266,
                "f1": 0.5144,
                "balancedAccuracy": 0.6372,
                "predictedPositiveRate": 0.2608
              },
              {
                "threshold": 0.54,
                "precision": 0.6667,
                "recall": 0.3823,
                "f1": 0.4859,
                "balancedAccuracy": 0.6285,
                "predictedPositiveRate": 0.227
              },
              {
                "threshold": 0.56,
                "precision": 0.6667,
                "recall": 0.3823,
                "f1": 0.4859,
                "balancedAccuracy": 0.6285,
                "predictedPositiveRate": 0.227
              },
              {
                "threshold": 0.58,
                "precision": 0.7069,
                "recall": 0.2799,
                "f1": 0.401,
                "balancedAccuracy": 0.6019,
                "predictedPositiveRate": 0.1568
              },
              {
                "threshold": 0.6,
                "precision": 0.7069,
                "recall": 0.2799,
                "f1": 0.401,
                "balancedAccuracy": 0.6019,
                "predictedPositiveRate": 0.1568
              },
              {
                "threshold": 0.62,
                "precision": 0.7069,
                "recall": 0.2799,
                "f1": 0.401,
                "balancedAccuracy": 0.6019,
                "predictedPositiveRate": 0.1568
              },
              {
                "threshold": 0.64,
                "precision": 0.7069,
                "recall": 0.2799,
                "f1": 0.401,
                "balancedAccuracy": 0.6019,
                "predictedPositiveRate": 0.1568
              },
              {
                "threshold": 0.66,
                "precision": 0.7069,
                "recall": 0.2799,
                "f1": 0.401,
                "balancedAccuracy": 0.6019,
                "predictedPositiveRate": 0.1568
              },
              {
                "threshold": 0.68,
                "precision": 0.7674,
                "recall": 0.1126,
                "f1": 0.1964,
                "balancedAccuracy": 0.5451,
                "predictedPositiveRate": 0.0581
              },
              {
                "threshold": 0.7,
                "precision": 0.7674,
                "recall": 0.1126,
                "f1": 0.1964,
                "balancedAccuracy": 0.5451,
                "predictedPositiveRate": 0.0581
              },
              {
                "threshold": 0.72,
                "precision": 0.7674,
                "recall": 0.1126,
                "f1": 0.1964,
                "balancedAccuracy": 0.5451,
                "predictedPositiveRate": 0.0581
              },
              {
                "threshold": 0.74,
                "precision": 1,
                "recall": 0.0239,
                "f1": 0.0467,
                "balancedAccuracy": 0.5119,
                "predictedPositiveRate": 0.0095
              },
              {
                "threshold": 0.76,
                "precision": 1,
                "recall": 0.0239,
                "f1": 0.0467,
                "balancedAccuracy": 0.5119,
                "predictedPositiveRate": 0.0095
              },
              {
                "threshold": 0.78,
                "precision": 1,
                "recall": 0.0239,
                "f1": 0.0467,
                "balancedAccuracy": 0.5119,
                "predictedPositiveRate": 0.0095
              },
              {
                "threshold": 0.8,
                "precision": 1,
                "recall": 0.0239,
                "f1": 0.0467,
                "balancedAccuracy": 0.5119,
                "predictedPositiveRate": 0.0095
              },
              {
                "threshold": 0.82,
                "precision": 1,
                "recall": 0.0239,
                "f1": 0.0467,
                "balancedAccuracy": 0.5119,
                "predictedPositiveRate": 0.0095
              },
              {
                "threshold": 0.84,
                "precision": 1,
                "recall": 0.0239,
                "f1": 0.0467,
                "balancedAccuracy": 0.5119,
                "predictedPositiveRate": 0.0095
              },
              {
                "threshold": 0.86,
                "precision": 1,
                "recall": 0.0239,
                "f1": 0.0467,
                "balancedAccuracy": 0.5119,
                "predictedPositiveRate": 0.0095
              },
              {
                "threshold": 0.88,
                "precision": 1,
                "recall": 0.0239,
                "f1": 0.0467,
                "balancedAccuracy": 0.5119,
                "predictedPositiveRate": 0.0095
              },
              {
                "threshold": 0.9,
                "precision": 1,
                "recall": 0.0239,
                "f1": 0.0467,
                "balancedAccuracy": 0.5119,
                "predictedPositiveRate": 0.0095
              }
            ]
          },
          "EmbeddingMLP": {
            "selected": {
              "threshold": 0.28,
              "precision": 0.4221,
              "recall": 0.9249,
              "f1": 0.5797,
              "balancedAccuracy": 0.5475,
              "predictedPositiveRate": 0.8676,
              "constraintsSatisfied": false
            },
            "rows": [
              {
                "threshold": 0.1,
                "precision": 0.3959,
                "recall": 1,
                "f1": 0.5673,
                "balancedAccuracy": 0.5,
                "predictedPositiveRate": 1
              },
              {
                "threshold": 0.12,
                "precision": 0.3959,
                "recall": 1,
                "f1": 0.5673,
                "balancedAccuracy": 0.5,
                "predictedPositiveRate": 1
              },
              {
                "threshold": 0.14,
                "precision": 0.3959,
                "recall": 1,
                "f1": 0.5673,
                "balancedAccuracy": 0.5,
                "predictedPositiveRate": 1
              },
              {
                "threshold": 0.16,
                "precision": 0.3959,
                "recall": 1,
                "f1": 0.5673,
                "balancedAccuracy": 0.5,
                "predictedPositiveRate": 1
              },
              {
                "threshold": 0.18,
                "precision": 0.3965,
                "recall": 1,
                "f1": 0.5678,
                "balancedAccuracy": 0.5011,
                "predictedPositiveRate": 0.9986
              },
              {
                "threshold": 0.2,
                "precision": 0.3986,
                "recall": 1,
                "f1": 0.57,
                "balancedAccuracy": 0.5056,
                "predictedPositiveRate": 0.9932
              },
              {
                "threshold": 0.22,
                "precision": 0.4008,
                "recall": 0.9932,
                "f1": 0.5711,
                "balancedAccuracy": 0.51,
                "predictedPositiveRate": 0.9811
              },
              {
                "threshold": 0.24,
                "precision": 0.4076,
                "recall": 0.9863,
                "f1": 0.5768,
                "balancedAccuracy": 0.5234,
                "predictedPositiveRate": 0.9581
              },
              {
                "threshold": 0.26,
                "precision": 0.4082,
                "recall": 0.9556,
                "f1": 0.572,
                "balancedAccuracy": 0.5237,
                "predictedPositiveRate": 0.927
              },
              {
                "threshold": 0.28,
                "precision": 0.4221,
                "recall": 0.9249,
                "f1": 0.5797,
                "balancedAccuracy": 0.5475,
                "predictedPositiveRate": 0.8676
              },
              {
                "threshold": 0.3,
                "precision": 0.4266,
                "recall": 0.8635,
                "f1": 0.5711,
                "balancedAccuracy": 0.5514,
                "predictedPositiveRate": 0.8014
              },
              {
                "threshold": 0.32,
                "precision": 0.4251,
                "recall": 0.785,
                "f1": 0.5516,
                "balancedAccuracy": 0.5446,
                "predictedPositiveRate": 0.7311
              },
              {
                "threshold": 0.34,
                "precision": 0.4309,
                "recall": 0.7338,
                "f1": 0.5429,
                "balancedAccuracy": 0.5492,
                "predictedPositiveRate": 0.6743
              },
              {
                "threshold": 0.36,
                "precision": 0.4571,
                "recall": 0.6724,
                "f1": 0.5442,
                "balancedAccuracy": 0.5744,
                "predictedPositiveRate": 0.5824
              },
              {
                "threshold": 0.38,
                "precision": 0.4609,
                "recall": 0.5836,
                "f1": 0.5151,
                "balancedAccuracy": 0.5681,
                "predictedPositiveRate": 0.5014
              },
              {
                "threshold": 0.4,
                "precision": 0.4841,
                "recall": 0.5188,
                "f1": 0.5008,
                "balancedAccuracy": 0.5782,
                "predictedPositiveRate": 0.4243
              },
              {
                "threshold": 0.42,
                "precision": 0.4856,
                "recall": 0.4608,
                "f1": 0.4729,
                "balancedAccuracy": 0.5704,
                "predictedPositiveRate": 0.3757
              },
              {
                "threshold": 0.44,
                "precision": 0.515,
                "recall": 0.4096,
                "f1": 0.4563,
                "balancedAccuracy": 0.5784,
                "predictedPositiveRate": 0.3149
              },
              {
                "threshold": 0.46,
                "precision": 0.5376,
                "recall": 0.3413,
                "f1": 0.4175,
                "balancedAccuracy": 0.5745,
                "predictedPositiveRate": 0.2514
              },
              {
                "threshold": 0.48,
                "precision": 0.5871,
                "recall": 0.3106,
                "f1": 0.4062,
                "balancedAccuracy": 0.5837,
                "predictedPositiveRate": 0.2095
              },
              {
                "threshold": 0.5,
                "precision": 0.629,
                "recall": 0.2662,
                "f1": 0.3741,
                "balancedAccuracy": 0.5817,
                "predictedPositiveRate": 0.1676
              },
              {
                "threshold": 0.52,
                "precision": 0.6535,
                "recall": 0.2253,
                "f1": 0.335,
                "balancedAccuracy": 0.5735,
                "predictedPositiveRate": 0.1365
              },
              {
                "threshold": 0.54,
                "precision": 0.6538,
                "recall": 0.1741,
                "f1": 0.2749,
                "balancedAccuracy": 0.5568,
                "predictedPositiveRate": 0.1054
              },
              {
                "threshold": 0.56,
                "precision": 0.6875,
                "recall": 0.1502,
                "f1": 0.2465,
                "balancedAccuracy": 0.5527,
                "predictedPositiveRate": 0.0865
              },
              {
                "threshold": 0.58,
                "precision": 0.72,
                "recall": 0.1229,
                "f1": 0.2099,
                "balancedAccuracy": 0.5458,
                "predictedPositiveRate": 0.0676
              },
              {
                "threshold": 0.6,
                "precision": 0.75,
                "recall": 0.1024,
                "f1": 0.1802,
                "balancedAccuracy": 0.54,
                "predictedPositiveRate": 0.0541
              },
              {
                "threshold": 0.62,
                "precision": 0.8462,
                "recall": 0.0751,
                "f1": 0.1379,
                "balancedAccuracy": 0.5331,
                "predictedPositiveRate": 0.0351
              },
              {
                "threshold": 0.64,
                "precision": 0.7895,
                "recall": 0.0512,
                "f1": 0.0962,
                "balancedAccuracy": 0.5211,
                "predictedPositiveRate": 0.0257
              },
              {
                "threshold": 0.66,
                "precision": 0.8,
                "recall": 0.0273,
                "f1": 0.0528,
                "balancedAccuracy": 0.5114,
                "predictedPositiveRate": 0.0135
              },
              {
                "threshold": 0.68,
                "precision": 0.8333,
                "recall": 0.0171,
                "f1": 0.0334,
                "balancedAccuracy": 0.5074,
                "predictedPositiveRate": 0.0081
              },
              {
                "threshold": 0.7,
                "precision": 0.75,
                "recall": 0.0102,
                "f1": 0.0202,
                "balancedAccuracy": 0.504,
                "predictedPositiveRate": 0.0054
              },
              {
                "threshold": 0.72,
                "precision": 1,
                "recall": 0.0034,
                "f1": 0.0068,
                "balancedAccuracy": 0.5017,
                "predictedPositiveRate": 0.0014
              },
              {
                "threshold": 0.74,
                "precision": 0,
                "recall": 0,
                "f1": 0,
                "balancedAccuracy": 0.5,
                "predictedPositiveRate": 0
              },
              {
                "threshold": 0.76,
                "precision": 0,
                "recall": 0,
                "f1": 0,
                "balancedAccuracy": 0.5,
                "predictedPositiveRate": 0
              },
              {
                "threshold": 0.78,
                "precision": 0,
                "recall": 0,
                "f1": 0,
                "balancedAccuracy": 0.5,
                "predictedPositiveRate": 0
              },
              {
                "threshold": 0.8,
                "precision": 0,
                "recall": 0,
                "f1": 0,
                "balancedAccuracy": 0.5,
                "predictedPositiveRate": 0
              },
              {
                "threshold": 0.82,
                "precision": 0,
                "recall": 0,
                "f1": 0,
                "balancedAccuracy": 0.5,
                "predictedPositiveRate": 0
              },
              {
                "threshold": 0.84,
                "precision": 0,
                "recall": 0,
                "f1": 0,
                "balancedAccuracy": 0.5,
                "predictedPositiveRate": 0
              },
              {
                "threshold": 0.86,
                "precision": 0,
                "recall": 0,
                "f1": 0,
                "balancedAccuracy": 0.5,
                "predictedPositiveRate": 0
              },
              {
                "threshold": 0.88,
                "precision": 0,
                "recall": 0,
                "f1": 0,
                "balancedAccuracy": 0.5,
                "predictedPositiveRate": 0
              },
              {
                "threshold": 0.9,
                "precision": 0,
                "recall": 0,
                "f1": 0,
                "balancedAccuracy": 0.5,
                "predictedPositiveRate": 0
              }
            ]
          }
        },
        "purchase": {
          "currentBaseline": {
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
          },
          "CatBoostClassifier": {
            "selected": {
              "threshold": 0.34,
              "precision": 0.6357,
              "recall": 0.8516,
              "f1": 0.728,
              "balancedAccuracy": 0.7614,
              "predictedPositiveRate": 0.5393,
              "constraintsSatisfied": false
            },
            "rows": [
              {
                "threshold": 0.1,
                "precision": 0.501,
                "recall": 0.9791,
                "f1": 0.6628,
                "balancedAccuracy": 0.6609,
                "predictedPositiveRate": 0.7868
              },
              {
                "threshold": 0.12,
                "precision": 0.5098,
                "recall": 0.9746,
                "f1": 0.6695,
                "balancedAccuracy": 0.6716,
                "predictedPositiveRate": 0.7696
              },
              {
                "threshold": 0.14,
                "precision": 0.5098,
                "recall": 0.9746,
                "f1": 0.6695,
                "balancedAccuracy": 0.6716,
                "predictedPositiveRate": 0.7696
              },
              {
                "threshold": 0.16,
                "precision": 0.5438,
                "recall": 0.9513,
                "f1": 0.692,
                "balancedAccuracy": 0.7067,
                "predictedPositiveRate": 0.7043
              },
              {
                "threshold": 0.18,
                "precision": 0.5506,
                "recall": 0.9456,
                "f1": 0.696,
                "balancedAccuracy": 0.7128,
                "predictedPositiveRate": 0.6914
              },
              {
                "threshold": 0.2,
                "precision": 0.5665,
                "recall": 0.9319,
                "f1": 0.7046,
                "balancedAccuracy": 0.7257,
                "predictedPositiveRate": 0.6623
              },
              {
                "threshold": 0.22,
                "precision": 0.5701,
                "recall": 0.9283,
                "f1": 0.7064,
                "balancedAccuracy": 0.7283,
                "predictedPositiveRate": 0.6555
              },
              {
                "threshold": 0.24,
                "precision": 0.5913,
                "recall": 0.9053,
                "f1": 0.7154,
                "balancedAccuracy": 0.7419,
                "predictedPositiveRate": 0.6164
              },
              {
                "threshold": 0.26,
                "precision": 0.5913,
                "recall": 0.9053,
                "f1": 0.7154,
                "balancedAccuracy": 0.7419,
                "predictedPositiveRate": 0.6164
              },
              {
                "threshold": 0.28,
                "precision": 0.6139,
                "recall": 0.8795,
                "f1": 0.7231,
                "balancedAccuracy": 0.7534,
                "predictedPositiveRate": 0.5767
              },
              {
                "threshold": 0.3,
                "precision": 0.6295,
                "recall": 0.8606,
                "f1": 0.7272,
                "balancedAccuracy": 0.7597,
                "predictedPositiveRate": 0.5503
              },
              {
                "threshold": 0.32,
                "precision": 0.6295,
                "recall": 0.8606,
                "f1": 0.7272,
                "balancedAccuracy": 0.7597,
                "predictedPositiveRate": 0.5503
              },
              {
                "threshold": 0.34,
                "precision": 0.6357,
                "recall": 0.8516,
                "f1": 0.728,
                "balancedAccuracy": 0.7614,
                "predictedPositiveRate": 0.5393
              },
              {
                "threshold": 0.36,
                "precision": 0.6357,
                "recall": 0.8516,
                "f1": 0.728,
                "balancedAccuracy": 0.7614,
                "predictedPositiveRate": 0.5393
              },
              {
                "threshold": 0.38,
                "precision": 0.6492,
                "recall": 0.8278,
                "f1": 0.7277,
                "balancedAccuracy": 0.7632,
                "predictedPositiveRate": 0.5133
              },
              {
                "threshold": 0.4,
                "precision": 0.657,
                "recall": 0.8141,
                "f1": 0.7271,
                "balancedAccuracy": 0.7638,
                "predictedPositiveRate": 0.4988
              },
              {
                "threshold": 0.42,
                "precision": 0.6639,
                "recall": 0.7999,
                "f1": 0.7256,
                "balancedAccuracy": 0.7635,
                "predictedPositiveRate": 0.4851
              },
              {
                "threshold": 0.44,
                "precision": 0.6691,
                "recall": 0.789,
                "f1": 0.7241,
                "balancedAccuracy": 0.763,
                "predictedPositiveRate": 0.4748
              },
              {
                "threshold": 0.46,
                "precision": 0.6691,
                "recall": 0.789,
                "f1": 0.7241,
                "balancedAccuracy": 0.763,
                "predictedPositiveRate": 0.4748
              },
              {
                "threshold": 0.48,
                "precision": 0.6795,
                "recall": 0.7617,
                "f1": 0.7182,
                "balancedAccuracy": 0.7598,
                "predictedPositiveRate": 0.4513
              },
              {
                "threshold": 0.5,
                "precision": 0.7016,
                "recall": 0.7054,
                "f1": 0.7035,
                "balancedAccuracy": 0.7516,
                "predictedPositiveRate": 0.4048
              },
              {
                "threshold": 0.52,
                "precision": 0.7091,
                "recall": 0.6866,
                "f1": 0.6977,
                "balancedAccuracy": 0.7484,
                "predictedPositiveRate": 0.3899
              },
              {
                "threshold": 0.54,
                "precision": 0.7346,
                "recall": 0.6258,
                "f1": 0.6759,
                "balancedAccuracy": 0.7367,
                "predictedPositiveRate": 0.343
              },
              {
                "threshold": 0.56,
                "precision": 0.7405,
                "recall": 0.6103,
                "f1": 0.6691,
                "balancedAccuracy": 0.7331,
                "predictedPositiveRate": 0.3318
              },
              {
                "threshold": 0.58,
                "precision": 0.7551,
                "recall": 0.571,
                "f1": 0.6503,
                "balancedAccuracy": 0.7231,
                "predictedPositiveRate": 0.3045
              },
              {
                "threshold": 0.6,
                "precision": 0.7551,
                "recall": 0.571,
                "f1": 0.6503,
                "balancedAccuracy": 0.7231,
                "predictedPositiveRate": 0.3045
              },
              {
                "threshold": 0.62,
                "precision": 0.7628,
                "recall": 0.5481,
                "f1": 0.6379,
                "balancedAccuracy": 0.7166,
                "predictedPositiveRate": 0.2893
              },
              {
                "threshold": 0.64,
                "precision": 0.7763,
                "recall": 0.5061,
                "f1": 0.6127,
                "balancedAccuracy": 0.7039,
                "predictedPositiveRate": 0.2624
              },
              {
                "threshold": 0.66,
                "precision": 0.7763,
                "recall": 0.5061,
                "f1": 0.6127,
                "balancedAccuracy": 0.7039,
                "predictedPositiveRate": 0.2624
              },
              {
                "threshold": 0.68,
                "precision": 0.7852,
                "recall": 0.4706,
                "f1": 0.5885,
                "balancedAccuracy": 0.692,
                "predictedPositiveRate": 0.2413
              },
              {
                "threshold": 0.7,
                "precision": 0.7948,
                "recall": 0.4334,
                "f1": 0.5609,
                "balancedAccuracy": 0.679,
                "predictedPositiveRate": 0.2195
              },
              {
                "threshold": 0.72,
                "precision": 0.7948,
                "recall": 0.4334,
                "f1": 0.5609,
                "balancedAccuracy": 0.679,
                "predictedPositiveRate": 0.2195
              },
              {
                "threshold": 0.74,
                "precision": 0.8045,
                "recall": 0.3847,
                "f1": 0.5205,
                "balancedAccuracy": 0.6608,
                "predictedPositiveRate": 0.1925
              },
              {
                "threshold": 0.76,
                "precision": 0.8284,
                "recall": 0.2863,
                "f1": 0.4256,
                "balancedAccuracy": 0.6232,
                "predictedPositiveRate": 0.1392
              },
              {
                "threshold": 0.78,
                "precision": 0.8473,
                "recall": 0.2193,
                "f1": 0.3484,
                "balancedAccuracy": 0.5963,
                "predictedPositiveRate": 0.1042
              },
              {
                "threshold": 0.8,
                "precision": 0.8473,
                "recall": 0.2193,
                "f1": 0.3484,
                "balancedAccuracy": 0.5963,
                "predictedPositiveRate": 0.1042
              },
              {
                "threshold": 0.82,
                "precision": 0.8868,
                "recall": 0.104,
                "f1": 0.1862,
                "balancedAccuracy": 0.5475,
                "predictedPositiveRate": 0.0472
              },
              {
                "threshold": 0.84,
                "precision": 0.889,
                "recall": 0.1001,
                "f1": 0.18,
                "balancedAccuracy": 0.5459,
                "predictedPositiveRate": 0.0453
              },
              {
                "threshold": 0.86,
                "precision": 0.9065,
                "recall": 0.0724,
                "f1": 0.1341,
                "balancedAccuracy": 0.5337,
                "predictedPositiveRate": 0.0322
              },
              {
                "threshold": 0.88,
                "precision": 0.9404,
                "recall": 0.0384,
                "f1": 0.0738,
                "balancedAccuracy": 0.5184,
                "predictedPositiveRate": 0.0164
              },
              {
                "threshold": 0.9,
                "precision": 0.9711,
                "recall": 0.0262,
                "f1": 0.0511,
                "balancedAccuracy": 0.5129,
                "predictedPositiveRate": 0.0109
              }
            ]
          },
          "EmbeddingMLP": {
            "selected": {
              "threshold": 0.38,
              "precision": 0.6511,
              "recall": 0.8269,
              "f1": 0.7285,
              "balancedAccuracy": 0.7641,
              "predictedPositiveRate": 0.5113,
              "constraintsSatisfied": false
            },
            "rows": [
              {
                "threshold": 0.1,
                "precision": 0.4965,
                "recall": 0.9796,
                "f1": 0.659,
                "balancedAccuracy": 0.655,
                "predictedPositiveRate": 0.7944
              },
              {
                "threshold": 0.12,
                "precision": 0.5086,
                "recall": 0.9727,
                "f1": 0.6679,
                "balancedAccuracy": 0.6697,
                "predictedPositiveRate": 0.77
              },
              {
                "threshold": 0.14,
                "precision": 0.5224,
                "recall": 0.9621,
                "f1": 0.6771,
                "balancedAccuracy": 0.6847,
                "predictedPositiveRate": 0.7415
              },
              {
                "threshold": 0.16,
                "precision": 0.5359,
                "recall": 0.9521,
                "f1": 0.6858,
                "balancedAccuracy": 0.6982,
                "predictedPositiveRate": 0.7153
              },
              {
                "threshold": 0.18,
                "precision": 0.5485,
                "recall": 0.9433,
                "f1": 0.6936,
                "balancedAccuracy": 0.71,
                "predictedPositiveRate": 0.6924
              },
              {
                "threshold": 0.2,
                "precision": 0.5586,
                "recall": 0.9355,
                "f1": 0.6995,
                "balancedAccuracy": 0.7186,
                "predictedPositiveRate": 0.6742
              },
              {
                "threshold": 0.22,
                "precision": 0.5681,
                "recall": 0.926,
                "f1": 0.7042,
                "balancedAccuracy": 0.7258,
                "predictedPositiveRate": 0.6562
              },
              {
                "threshold": 0.24,
                "precision": 0.5788,
                "recall": 0.9172,
                "f1": 0.7098,
                "balancedAccuracy": 0.7338,
                "predictedPositiveRate": 0.6379
              },
              {
                "threshold": 0.26,
                "precision": 0.5878,
                "recall": 0.9075,
                "f1": 0.7135,
                "balancedAccuracy": 0.7393,
                "predictedPositiveRate": 0.6215
              },
              {
                "threshold": 0.28,
                "precision": 0.5975,
                "recall": 0.8953,
                "f1": 0.7167,
                "balancedAccuracy": 0.7445,
                "predictedPositiveRate": 0.6033
              },
              {
                "threshold": 0.3,
                "precision": 0.6083,
                "recall": 0.8836,
                "f1": 0.7206,
                "balancedAccuracy": 0.7501,
                "predictedPositiveRate": 0.5848
              },
              {
                "threshold": 0.32,
                "precision": 0.6188,
                "recall": 0.8702,
                "f1": 0.7233,
                "balancedAccuracy": 0.7545,
                "predictedPositiveRate": 0.5661
              },
              {
                "threshold": 0.34,
                "precision": 0.6298,
                "recall": 0.8572,
                "f1": 0.7261,
                "balancedAccuracy": 0.7588,
                "predictedPositiveRate": 0.548
              },
              {
                "threshold": 0.36,
                "precision": 0.641,
                "recall": 0.8436,
                "f1": 0.7284,
                "balancedAccuracy": 0.7626,
                "predictedPositiveRate": 0.5299
              },
              {
                "threshold": 0.38,
                "precision": 0.6511,
                "recall": 0.8269,
                "f1": 0.7285,
                "balancedAccuracy": 0.7641,
                "predictedPositiveRate": 0.5113
              },
              {
                "threshold": 0.4,
                "precision": 0.6623,
                "recall": 0.8086,
                "f1": 0.7281,
                "balancedAccuracy": 0.7653,
                "predictedPositiveRate": 0.4915
              },
              {
                "threshold": 0.42,
                "precision": 0.6711,
                "recall": 0.7895,
                "f1": 0.7255,
                "balancedAccuracy": 0.7644,
                "predictedPositiveRate": 0.4736
              },
              {
                "threshold": 0.44,
                "precision": 0.6787,
                "recall": 0.7667,
                "f1": 0.72,
                "balancedAccuracy": 0.761,
                "predictedPositiveRate": 0.4548
              },
              {
                "threshold": 0.46,
                "precision": 0.6876,
                "recall": 0.7448,
                "f1": 0.7151,
                "balancedAccuracy": 0.7584,
                "predictedPositiveRate": 0.4361
              },
              {
                "threshold": 0.48,
                "precision": 0.6972,
                "recall": 0.7221,
                "f1": 0.7094,
                "balancedAccuracy": 0.7554,
                "predictedPositiveRate": 0.4169
              },
              {
                "threshold": 0.5,
                "precision": 0.706,
                "recall": 0.7002,
                "f1": 0.7031,
                "balancedAccuracy": 0.7518,
                "predictedPositiveRate": 0.3993
              },
              {
                "threshold": 0.52,
                "precision": 0.716,
                "recall": 0.6793,
                "f1": 0.6972,
                "balancedAccuracy": 0.7489,
                "predictedPositiveRate": 0.382
              },
              {
                "threshold": 0.54,
                "precision": 0.7253,
                "recall": 0.6571,
                "f1": 0.6895,
                "balancedAccuracy": 0.7447,
                "predictedPositiveRate": 0.3648
              },
              {
                "threshold": 0.56,
                "precision": 0.734,
                "recall": 0.6344,
                "f1": 0.6805,
                "balancedAccuracy": 0.7397,
                "predictedPositiveRate": 0.3479
              },
              {
                "threshold": 0.58,
                "precision": 0.7436,
                "recall": 0.6124,
                "f1": 0.6717,
                "balancedAccuracy": 0.7351,
                "predictedPositiveRate": 0.3315
              },
              {
                "threshold": 0.6,
                "precision": 0.7518,
                "recall": 0.5862,
                "f1": 0.6588,
                "balancedAccuracy": 0.7279,
                "predictedPositiveRate": 0.314
              },
              {
                "threshold": 0.62,
                "precision": 0.7605,
                "recall": 0.5605,
                "f1": 0.6454,
                "balancedAccuracy": 0.7208,
                "predictedPositiveRate": 0.2967
              },
              {
                "threshold": 0.64,
                "precision": 0.7697,
                "recall": 0.5338,
                "f1": 0.6304,
                "balancedAccuracy": 0.7131,
                "predictedPositiveRate": 0.2792
              },
              {
                "threshold": 0.66,
                "precision": 0.7755,
                "recall": 0.5012,
                "f1": 0.6089,
                "balancedAccuracy": 0.7017,
                "predictedPositiveRate": 0.2602
              },
              {
                "threshold": 0.68,
                "precision": 0.7812,
                "recall": 0.4666,
                "f1": 0.5842,
                "balancedAccuracy": 0.6892,
                "predictedPositiveRate": 0.2405
              },
              {
                "threshold": 0.7,
                "precision": 0.7891,
                "recall": 0.4259,
                "f1": 0.5532,
                "balancedAccuracy": 0.6746,
                "predictedPositiveRate": 0.2173
              },
              {
                "threshold": 0.72,
                "precision": 0.8003,
                "recall": 0.3826,
                "f1": 0.5177,
                "balancedAccuracy": 0.6591,
                "predictedPositiveRate": 0.1924
              },
              {
                "threshold": 0.74,
                "precision": 0.8124,
                "recall": 0.3269,
                "f1": 0.4662,
                "balancedAccuracy": 0.638,
                "predictedPositiveRate": 0.162
              },
              {
                "threshold": 0.76,
                "precision": 0.8282,
                "recall": 0.2692,
                "f1": 0.4063,
                "balancedAccuracy": 0.6158,
                "predictedPositiveRate": 0.1308
              },
              {
                "threshold": 0.78,
                "precision": 0.8353,
                "recall": 0.2184,
                "f1": 0.3463,
                "balancedAccuracy": 0.5947,
                "predictedPositiveRate": 0.1053
              },
              {
                "threshold": 0.8,
                "precision": 0.8562,
                "recall": 0.1805,
                "f1": 0.2981,
                "balancedAccuracy": 0.58,
                "predictedPositiveRate": 0.0849
              },
              {
                "threshold": 0.82,
                "precision": 0.8714,
                "recall": 0.1301,
                "f1": 0.2264,
                "balancedAccuracy": 0.5586,
                "predictedPositiveRate": 0.0601
              },
              {
                "threshold": 0.84,
                "precision": 0.8876,
                "recall": 0.0782,
                "f1": 0.1437,
                "balancedAccuracy": 0.5357,
                "predictedPositiveRate": 0.0355
              },
              {
                "threshold": 0.86,
                "precision": 0.9187,
                "recall": 0.0491,
                "f1": 0.0932,
                "balancedAccuracy": 0.5231,
                "predictedPositiveRate": 0.0215
              },
              {
                "threshold": 0.88,
                "precision": 0.9359,
                "recall": 0.0406,
                "f1": 0.0777,
                "balancedAccuracy": 0.5193,
                "predictedPositiveRate": 0.0174
              },
              {
                "threshold": 0.9,
                "precision": 0.9398,
                "recall": 0.0353,
                "f1": 0.068,
                "balancedAccuracy": 0.5169,
                "predictedPositiveRate": 0.0151
              }
            ]
          },
          "PurchaseGRU": {
            "selected": {
              "threshold": 0.36,
              "precision": 0.6391,
              "recall": 0.8396,
              "f1": 0.7258,
              "balancedAccuracy": 0.7601,
              "predictedPositiveRate": 0.5288,
              "constraintsSatisfied": false
            },
            "rows": [
              {
                "threshold": 0.1,
                "precision": 0.4987,
                "recall": 0.9782,
                "f1": 0.6606,
                "balancedAccuracy": 0.6578,
                "predictedPositiveRate": 0.7897
              },
              {
                "threshold": 0.12,
                "precision": 0.5123,
                "recall": 0.9702,
                "f1": 0.6705,
                "balancedAccuracy": 0.6739,
                "predictedPositiveRate": 0.7624
              },
              {
                "threshold": 0.14,
                "precision": 0.5259,
                "recall": 0.9619,
                "f1": 0.68,
                "balancedAccuracy": 0.6888,
                "predictedPositiveRate": 0.7363
              },
              {
                "threshold": 0.16,
                "precision": 0.5375,
                "recall": 0.9521,
                "f1": 0.6871,
                "balancedAccuracy": 0.7,
                "predictedPositiveRate": 0.7131
              },
              {
                "threshold": 0.18,
                "precision": 0.549,
                "recall": 0.9422,
                "f1": 0.6937,
                "balancedAccuracy": 0.7103,
                "predictedPositiveRate": 0.6909
              },
              {
                "threshold": 0.2,
                "precision": 0.5612,
                "recall": 0.9349,
                "f1": 0.7014,
                "balancedAccuracy": 0.7211,
                "predictedPositiveRate": 0.6706
              },
              {
                "threshold": 0.22,
                "precision": 0.5709,
                "recall": 0.9253,
                "f1": 0.7061,
                "balancedAccuracy": 0.7283,
                "predictedPositiveRate": 0.6525
              },
              {
                "threshold": 0.24,
                "precision": 0.5807,
                "recall": 0.9163,
                "f1": 0.7108,
                "balancedAccuracy": 0.7352,
                "predictedPositiveRate": 0.6353
              },
              {
                "threshold": 0.26,
                "precision": 0.5899,
                "recall": 0.9057,
                "f1": 0.7145,
                "balancedAccuracy": 0.7407,
                "predictedPositiveRate": 0.6181
              },
              {
                "threshold": 0.28,
                "precision": 0.6002,
                "recall": 0.8945,
                "f1": 0.7184,
                "balancedAccuracy": 0.7465,
                "predictedPositiveRate": 0.5999
              },
              {
                "threshold": 0.3,
                "precision": 0.6095,
                "recall": 0.8821,
                "f1": 0.7209,
                "balancedAccuracy": 0.7506,
                "predictedPositiveRate": 0.5827
              },
              {
                "threshold": 0.32,
                "precision": 0.6187,
                "recall": 0.8691,
                "f1": 0.7228,
                "balancedAccuracy": 0.7541,
                "predictedPositiveRate": 0.5655
              },
              {
                "threshold": 0.34,
                "precision": 0.6298,
                "recall": 0.8562,
                "f1": 0.7258,
                "balancedAccuracy": 0.7585,
                "predictedPositiveRate": 0.5473
              },
              {
                "threshold": 0.36,
                "precision": 0.6391,
                "recall": 0.8396,
                "f1": 0.7258,
                "balancedAccuracy": 0.7601,
                "predictedPositiveRate": 0.5288
              },
              {
                "threshold": 0.38,
                "precision": 0.6479,
                "recall": 0.8225,
                "f1": 0.7248,
                "balancedAccuracy": 0.7606,
                "predictedPositiveRate": 0.5111
              },
              {
                "threshold": 0.4,
                "precision": 0.6576,
                "recall": 0.8046,
                "f1": 0.7237,
                "balancedAccuracy": 0.7612,
                "predictedPositiveRate": 0.4926
              },
              {
                "threshold": 0.42,
                "precision": 0.6674,
                "recall": 0.7857,
                "f1": 0.7218,
                "balancedAccuracy": 0.7609,
                "predictedPositiveRate": 0.474
              },
              {
                "threshold": 0.44,
                "precision": 0.6761,
                "recall": 0.7671,
                "f1": 0.7187,
                "balancedAccuracy": 0.7597,
                "predictedPositiveRate": 0.4568
              },
              {
                "threshold": 0.46,
                "precision": 0.6847,
                "recall": 0.7473,
                "f1": 0.7146,
                "balancedAccuracy": 0.7577,
                "predictedPositiveRate": 0.4394
              },
              {
                "threshold": 0.48,
                "precision": 0.6932,
                "recall": 0.7256,
                "f1": 0.7091,
                "balancedAccuracy": 0.7546,
                "predictedPositiveRate": 0.4214
              },
              {
                "threshold": 0.5,
                "precision": 0.7027,
                "recall": 0.7031,
                "f1": 0.7029,
                "balancedAccuracy": 0.7513,
                "predictedPositiveRate": 0.4028
              },
              {
                "threshold": 0.52,
                "precision": 0.7114,
                "recall": 0.6831,
                "f1": 0.697,
                "balancedAccuracy": 0.7482,
                "predictedPositiveRate": 0.3865
              },
              {
                "threshold": 0.54,
                "precision": 0.7191,
                "recall": 0.6629,
                "f1": 0.6899,
                "balancedAccuracy": 0.7442,
                "predictedPositiveRate": 0.3711
              },
              {
                "threshold": 0.56,
                "precision": 0.7256,
                "recall": 0.6417,
                "f1": 0.6811,
                "balancedAccuracy": 0.7391,
                "predictedPositiveRate": 0.356
              },
              {
                "threshold": 0.58,
                "precision": 0.7314,
                "recall": 0.6188,
                "f1": 0.6704,
                "balancedAccuracy": 0.7328,
                "predictedPositiveRate": 0.3406
              },
              {
                "threshold": 0.6,
                "precision": 0.739,
                "recall": 0.5943,
                "f1": 0.6588,
                "balancedAccuracy": 0.7264,
                "predictedPositiveRate": 0.3238
              },
              {
                "threshold": 0.62,
                "precision": 0.7478,
                "recall": 0.5693,
                "f1": 0.6464,
                "balancedAccuracy": 0.72,
                "predictedPositiveRate": 0.3065
              },
              {
                "threshold": 0.64,
                "precision": 0.7588,
                "recall": 0.5391,
                "f1": 0.6303,
                "balancedAccuracy": 0.7118,
                "predictedPositiveRate": 0.286
              },
              {
                "threshold": 0.66,
                "precision": 0.7673,
                "recall": 0.5041,
                "f1": 0.6084,
                "balancedAccuracy": 0.7005,
                "predictedPositiveRate": 0.2645
              },
              {
                "threshold": 0.68,
                "precision": 0.7817,
                "recall": 0.4605,
                "f1": 0.5795,
                "balancedAccuracy": 0.6869,
                "predictedPositiveRate": 0.2372
              },
              {
                "threshold": 0.7,
                "precision": 0.7932,
                "recall": 0.411,
                "f1": 0.5414,
                "balancedAccuracy": 0.6694,
                "predictedPositiveRate": 0.2086
              },
              {
                "threshold": 0.72,
                "precision": 0.8067,
                "recall": 0.3592,
                "f1": 0.4971,
                "balancedAccuracy": 0.6506,
                "predictedPositiveRate": 0.1793
              },
              {
                "threshold": 0.74,
                "precision": 0.8196,
                "recall": 0.3058,
                "f1": 0.4454,
                "balancedAccuracy": 0.6302,
                "predictedPositiveRate": 0.1502
              },
              {
                "threshold": 0.76,
                "precision": 0.8353,
                "recall": 0.2568,
                "f1": 0.3929,
                "balancedAccuracy": 0.6113,
                "predictedPositiveRate": 0.1238
              },
              {
                "threshold": 0.78,
                "precision": 0.8421,
                "recall": 0.215,
                "f1": 0.3425,
                "balancedAccuracy": 0.5939,
                "predictedPositiveRate": 0.1028
              },
              {
                "threshold": 0.8,
                "precision": 0.8468,
                "recall": 0.1786,
                "f1": 0.2949,
                "balancedAccuracy": 0.5784,
                "predictedPositiveRate": 0.0849
              },
              {
                "threshold": 0.82,
                "precision": 0.858,
                "recall": 0.1385,
                "f1": 0.2385,
                "balancedAccuracy": 0.5615,
                "predictedPositiveRate": 0.065
              },
              {
                "threshold": 0.84,
                "precision": 0.8823,
                "recall": 0.0944,
                "f1": 0.1706,
                "balancedAccuracy": 0.543,
                "predictedPositiveRate": 0.0431
              },
              {
                "threshold": 0.86,
                "precision": 0.9162,
                "recall": 0.056,
                "f1": 0.1056,
                "balancedAccuracy": 0.5263,
                "predictedPositiveRate": 0.0246
              },
              {
                "threshold": 0.88,
                "precision": 0.9375,
                "recall": 0.03,
                "f1": 0.0581,
                "balancedAccuracy": 0.5143,
                "predictedPositiveRate": 0.0129
              },
              {
                "threshold": 0.9,
                "precision": 0.9788,
                "recall": 0.0161,
                "f1": 0.0316,
                "balancedAccuracy": 0.5079,
                "predictedPositiveRate": 0.0066
              }
            ]
          }
        }
      }
    },
    "calibrationComparison": {
      "label": "MOCK / SYNTHETIC DEEP-LEARNING BENCHMARK — SAUDI MARKET",
      "selectionMetric": "validation Brier score",
      "engines": {
        "offer": {
          "currentBaseline": {
            "selected": "isotonic",
            "rows": [
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
            ]
          },
          "CatBoostClassifier": {
            "selected": "isotonic",
            "rows": [
              {
                "method": "uncalibrated",
                "validationBrierScore": 0.225484
              },
              {
                "method": "sigmoid",
                "validationBrierScore": 0.216571
              },
              {
                "method": "isotonic",
                "validationBrierScore": 0.209525
              }
            ]
          },
          "EmbeddingMLP": {
            "selected": "sigmoid",
            "rows": [
              {
                "method": "uncalibrated",
                "validationBrierScore": 0.236621
              },
              {
                "method": "sigmoid",
                "validationBrierScore": 0.227105
              },
              {
                "method": "temperature",
                "validationBrierScore": 0.236617
              }
            ]
          }
        },
        "purchase": {
          "currentBaseline": {
            "selected": "isotonic",
            "rows": [
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
            ]
          },
          "CatBoostClassifier": {
            "selected": "isotonic",
            "rows": [
              {
                "method": "uncalibrated",
                "validationBrierScore": 0.164847
              },
              {
                "method": "sigmoid",
                "validationBrierScore": 0.16011
              },
              {
                "method": "isotonic",
                "validationBrierScore": 0.15944
              }
            ]
          },
          "EmbeddingMLP": {
            "selected": "sigmoid",
            "rows": [
              {
                "method": "uncalibrated",
                "validationBrierScore": 0.16418
              },
              {
                "method": "sigmoid",
                "validationBrierScore": 0.159995
              },
              {
                "method": "temperature",
                "validationBrierScore": 0.164168
              }
            ]
          },
          "PurchaseGRU": {
            "selected": "sigmoid",
            "rows": [
              {
                "method": "uncalibrated",
                "validationBrierScore": 0.165281
              },
              {
                "method": "sigmoid",
                "validationBrierScore": 0.160878
              },
              {
                "method": "temperature",
                "validationBrierScore": 0.165232
              }
            ]
          }
        }
      }
    },
    "runtimeBenchmark": {
      "label": "MOCK / SYNTHETIC DEEP-LEARNING BENCHMARK — SAUDI MARKET",
      "warmup": 1,
      "timedRepetitions": 100,
      "models": {
        "offer": {
          "currentBaseline": {
            "modelName": "RandomForestClassifier",
            "coldStartupMs": 73.776,
            "latency": {
              "1": {
                "meanMs": 46.7991,
                "medianMs": 48.1706,
                "p95Ms": 55.7053,
                "repetitions": 100
              },
              "32": {
                "meanMs": 49.3012,
                "medianMs": 50.3225,
                "p95Ms": 54.7353,
                "repetitions": 100
              },
              "256": {
                "meanMs": 56.4103,
                "medianMs": 58.2156,
                "p95Ms": 60.3722,
                "repetitions": 100
              }
            },
            "artifactBytes": 19371722,
            "trainingDurationSeconds": 0.509,
            "device": "CPU",
            "serviceStartupExcludedFromLatency": true
          },
          "CatBoostClassifier": {
            "modelName": "CatBoostClassifier",
            "coldStartupMs": 1.133,
            "latency": {
              "1": {
                "meanMs": 1.3953,
                "medianMs": 1.3858,
                "p95Ms": 1.595,
                "repetitions": 100
              },
              "32": {
                "meanMs": 1.6186,
                "medianMs": 1.6064,
                "p95Ms": 1.7544,
                "repetitions": 100
              },
              "256": {
                "meanMs": 2.1839,
                "medianMs": 2.1479,
                "p95Ms": 2.3565,
                "repetitions": 100
              }
            },
            "artifactBytes": 70504,
            "trainingDurationSeconds": 3.107,
            "device": "CPU",
            "serviceStartupExcludedFromLatency": true
          },
          "EmbeddingMLP": {
            "modelName": "EmbeddingMLP",
            "coldStartupMs": 1.6531,
            "latency": {
              "1": {
                "meanMs": 0.4516,
                "medianMs": 0.4347,
                "p95Ms": 0.5356,
                "repetitions": 100
              },
              "32": {
                "meanMs": 0.5048,
                "medianMs": 0.4909,
                "p95Ms": 0.6128,
                "repetitions": 100
              },
              "256": {
                "meanMs": 0.604,
                "medianMs": 0.5831,
                "p95Ms": 0.7199,
                "repetitions": 100
              }
            },
            "artifactBytes": 121247,
            "trainingDurationSeconds": 1.344,
            "device": "CPU",
            "serviceStartupExcludedFromLatency": true
          }
        },
        "purchase": {
          "currentBaseline": {
            "modelName": "HistGradientBoostingClassifier",
            "coldStartupMs": 13.7886,
            "latency": {
              "1": {
                "meanMs": 9.7951,
                "medianMs": 9.8053,
                "p95Ms": 10.5096,
                "repetitions": 100
              },
              "32": {
                "meanMs": 9.8746,
                "medianMs": 9.8276,
                "p95Ms": 10.7299,
                "repetitions": 100
              },
              "256": {
                "meanMs": 10.779,
                "medianMs": 10.4805,
                "p95Ms": 11.7906,
                "repetitions": 100
              }
            },
            "artifactBytes": 806420,
            "trainingDurationSeconds": 1.854,
            "device": "CPU",
            "serviceStartupExcludedFromLatency": true
          },
          "CatBoostClassifier": {
            "modelName": "CatBoostClassifier",
            "coldStartupMs": 1.418,
            "latency": {
              "1": {
                "meanMs": 1.5008,
                "medianMs": 1.4896,
                "p95Ms": 1.6158,
                "repetitions": 100
              },
              "32": {
                "meanMs": 1.628,
                "medianMs": 1.618,
                "p95Ms": 1.7187,
                "repetitions": 100
              },
              "256": {
                "meanMs": 2.2255,
                "medianMs": 2.2079,
                "p95Ms": 2.3834,
                "repetitions": 100
              }
            },
            "artifactBytes": 152972,
            "trainingDurationSeconds": 12.873,
            "device": "CPU",
            "serviceStartupExcludedFromLatency": true
          },
          "EmbeddingMLP": {
            "modelName": "EmbeddingMLP",
            "coldStartupMs": 1.6529,
            "latency": {
              "1": {
                "meanMs": 0.4451,
                "medianMs": 0.4388,
                "p95Ms": 0.4636,
                "repetitions": 100
              },
              "32": {
                "meanMs": 0.5504,
                "medianMs": 0.528,
                "p95Ms": 0.6867,
                "repetitions": 100
              },
              "256": {
                "meanMs": 0.7071,
                "medianMs": 0.6643,
                "p95Ms": 0.9512,
                "repetitions": 100
              }
            },
            "artifactBytes": 130489,
            "trainingDurationSeconds": 52.808,
            "device": "CPU",
            "serviceStartupExcludedFromLatency": true
          },
          "PurchaseGRU": {
            "modelName": "PurchaseGRU",
            "coldStartupMs": 1.8558,
            "latency": {
              "1": {
                "meanMs": 1.815,
                "medianMs": 1.8033,
                "p95Ms": 1.9763,
                "repetitions": 100
              },
              "32": {
                "meanMs": 2.6971,
                "medianMs": 2.6203,
                "p95Ms": 3.2193,
                "repetitions": 100
              },
              "256": {
                "meanMs": 5.6003,
                "medianMs": 5.5097,
                "p95Ms": 6.3316,
                "repetitions": 100
              }
            },
            "artifactBytes": 94385,
            "trainingDurationSeconds": 515.732,
            "device": "CPU",
            "serviceStartupExcludedFromLatency": true
          }
        }
      }
    },
    "confusionMatrices": {
      "label": "MOCK / SYNTHETIC DEEP-LEARNING BENCHMARK — SAUDI MARKET",
      "engines": {
        "offer": {
          "currentBaseline": [
            [
              134,
              294
            ],
            [
              43,
              269
            ]
          ],
          "CatBoostClassifier": [
            [
              119,
              309
            ],
            [
              32,
              280
            ]
          ],
          "EmbeddingMLP": [
            [
              71,
              357
            ],
            [
              24,
              288
            ]
          ]
        },
        "purchase": {
          "currentBaseline": [
            [
              12107,
              5692
            ],
            [
              1809,
              10092
            ]
          ],
          "CatBoostClassifier": [
            [
              11902,
              5897
            ],
            [
              1803,
              10098
            ]
          ],
          "EmbeddingMLP": [
            [
              12486,
              5313
            ],
            [
              2076,
              9825
            ]
          ],
          "PurchaseGRU": [
            [
              12093,
              5706
            ],
            [
              1910,
              9991
            ]
          ]
        }
      }
    },
    "trainingCurves": {
      "label": "MOCK / SYNTHETIC DEEP-LEARNING BENCHMARK — SAUDI MARKET",
      "curves": {
        "offerEmbeddingMlp": [
          {
            "epoch": 1,
            "trainLoss": 0.815248,
            "threshold": 0.36,
            "precision": 0.4198,
            "recall": 0.9113,
            "f1": 0.5748,
            "balancedAccuracy": 0.5429,
            "predictedPositiveRate": 0.8595,
            "constraintsSatisfied": false
          },
          {
            "epoch": 2,
            "trainLoss": 0.785165,
            "threshold": 0.36,
            "precision": 0.4225,
            "recall": 0.9488,
            "f1": 0.5846,
            "balancedAccuracy": 0.5493,
            "predictedPositiveRate": 0.8892,
            "constraintsSatisfied": false
          },
          {
            "epoch": 3,
            "trainLoss": 0.777631,
            "threshold": 0.34,
            "precision": 0.4148,
            "recall": 0.9727,
            "f1": 0.5816,
            "balancedAccuracy": 0.5367,
            "predictedPositiveRate": 0.9284,
            "constraintsSatisfied": false
          },
          {
            "epoch": 4,
            "trainLoss": 0.762424,
            "threshold": 0.32,
            "precision": 0.4106,
            "recall": 0.9795,
            "f1": 0.5786,
            "balancedAccuracy": 0.5289,
            "predictedPositiveRate": 0.9446,
            "constraintsSatisfied": false
          },
          {
            "epoch": 5,
            "trainLoss": 0.747805,
            "threshold": 0.32,
            "precision": 0.4158,
            "recall": 0.9522,
            "f1": 0.5788,
            "balancedAccuracy": 0.5376,
            "predictedPositiveRate": 0.9068,
            "constraintsSatisfied": false
          }
        ],
        "purchaseEmbeddingMlp": [
          {
            "epoch": 1,
            "trainLoss": 0.642714,
            "threshold": 0.46,
            "precision": 0.6278,
            "recall": 0.838,
            "f1": 0.7178,
            "balancedAccuracy": 0.7516,
            "predictedPositiveRate": 0.5374,
            "constraintsSatisfied": false
          },
          {
            "epoch": 2,
            "trainLoss": 0.612141,
            "threshold": 0.48,
            "precision": 0.6402,
            "recall": 0.8263,
            "f1": 0.7215,
            "balancedAccuracy": 0.7567,
            "predictedPositiveRate": 0.5196,
            "constraintsSatisfied": false
          },
          {
            "epoch": 3,
            "trainLoss": 0.60614,
            "threshold": 0.46,
            "precision": 0.6441,
            "recall": 0.8299,
            "f1": 0.7253,
            "balancedAccuracy": 0.7605,
            "predictedPositiveRate": 0.5187,
            "constraintsSatisfied": false
          },
          {
            "epoch": 4,
            "trainLoss": 0.602703,
            "threshold": 0.46,
            "precision": 0.6418,
            "recall": 0.8344,
            "f1": 0.7255,
            "balancedAccuracy": 0.7602,
            "predictedPositiveRate": 0.5234,
            "constraintsSatisfied": false
          },
          {
            "epoch": 5,
            "trainLoss": 0.599934,
            "threshold": 0.44,
            "precision": 0.6423,
            "recall": 0.8362,
            "f1": 0.7265,
            "balancedAccuracy": 0.7612,
            "predictedPositiveRate": 0.5241,
            "constraintsSatisfied": false
          },
          {
            "epoch": 6,
            "trainLoss": 0.598802,
            "threshold": 0.46,
            "precision": 0.6483,
            "recall": 0.8293,
            "f1": 0.7277,
            "balancedAccuracy": 0.763,
            "predictedPositiveRate": 0.515,
            "constraintsSatisfied": false
          },
          {
            "epoch": 7,
            "trainLoss": 0.596815,
            "threshold": 0.46,
            "precision": 0.644,
            "recall": 0.8359,
            "f1": 0.7275,
            "balancedAccuracy": 0.7622,
            "predictedPositiveRate": 0.5226,
            "constraintsSatisfied": false
          },
          {
            "epoch": 8,
            "trainLoss": 0.595534,
            "threshold": 0.46,
            "precision": 0.65,
            "recall": 0.8285,
            "f1": 0.7284,
            "balancedAccuracy": 0.7639,
            "predictedPositiveRate": 0.5131,
            "constraintsSatisfied": false
          },
          {
            "epoch": 9,
            "trainLoss": 0.595104,
            "threshold": 0.42,
            "precision": 0.63,
            "recall": 0.8618,
            "f1": 0.7279,
            "balancedAccuracy": 0.7603,
            "predictedPositiveRate": 0.5508,
            "constraintsSatisfied": false
          },
          {
            "epoch": 10,
            "trainLoss": 0.593641,
            "threshold": 0.48,
            "precision": 0.6476,
            "recall": 0.8337,
            "f1": 0.729,
            "balancedAccuracy": 0.764,
            "predictedPositiveRate": 0.5183,
            "constraintsSatisfied": false
          },
          {
            "epoch": 11,
            "trainLoss": 0.592905,
            "threshold": 0.48,
            "precision": 0.6563,
            "recall": 0.8196,
            "f1": 0.7289,
            "balancedAccuracy": 0.7652,
            "predictedPositiveRate": 0.5028,
            "constraintsSatisfied": false
          },
          {
            "epoch": 12,
            "trainLoss": 0.591258,
            "threshold": 0.46,
            "precision": 0.6485,
            "recall": 0.833,
            "f1": 0.7293,
            "balancedAccuracy": 0.7644,
            "predictedPositiveRate": 0.5171,
            "constraintsSatisfied": false
          },
          {
            "epoch": 13,
            "trainLoss": 0.590965,
            "threshold": 0.5,
            "precision": 0.6501,
            "recall": 0.8289,
            "f1": 0.7287,
            "balancedAccuracy": 0.7642,
            "predictedPositiveRate": 0.5133,
            "constraintsSatisfied": false
          },
          {
            "epoch": 14,
            "trainLoss": 0.588737,
            "threshold": 0.46,
            "precision": 0.6469,
            "recall": 0.8352,
            "f1": 0.7291,
            "balancedAccuracy": 0.764,
            "predictedPositiveRate": 0.5198,
            "constraintsSatisfied": false
          }
        ],
        "purchaseGru": [
          {
            "epoch": 1,
            "trainLoss": 0.636912,
            "threshold": 0.46,
            "precision": 0.6261,
            "recall": 0.8381,
            "f1": 0.7168,
            "balancedAccuracy": 0.7504,
            "predictedPositiveRate": 0.5389,
            "constraintsSatisfied": false
          },
          {
            "epoch": 2,
            "trainLoss": 0.609862,
            "threshold": 0.48,
            "precision": 0.6398,
            "recall": 0.8233,
            "f1": 0.72,
            "balancedAccuracy": 0.7554,
            "predictedPositiveRate": 0.518,
            "constraintsSatisfied": false
          },
          {
            "epoch": 3,
            "trainLoss": 0.605609,
            "threshold": 0.46,
            "precision": 0.6301,
            "recall": 0.8475,
            "f1": 0.7228,
            "balancedAccuracy": 0.7561,
            "predictedPositiveRate": 0.5415,
            "constraintsSatisfied": false
          },
          {
            "epoch": 4,
            "trainLoss": 0.604539,
            "threshold": 0.5,
            "precision": 0.6516,
            "recall": 0.8145,
            "f1": 0.724,
            "balancedAccuracy": 0.7605,
            "predictedPositiveRate": 0.5033,
            "constraintsSatisfied": false
          },
          {
            "epoch": 5,
            "trainLoss": 0.601964,
            "threshold": 0.44,
            "precision": 0.6384,
            "recall": 0.8352,
            "f1": 0.7237,
            "balancedAccuracy": 0.7582,
            "predictedPositiveRate": 0.5267,
            "constraintsSatisfied": false
          },
          {
            "epoch": 6,
            "trainLoss": 0.599952,
            "threshold": 0.46,
            "precision": 0.6439,
            "recall": 0.8308,
            "f1": 0.7255,
            "balancedAccuracy": 0.7606,
            "predictedPositiveRate": 0.5194,
            "constraintsSatisfied": false
          }
        ]
      }
    },
    "modelSelection": {
      "label": "MOCK / SYNTHETIC DEEP-LEARNING BENCHMARK — SAUDI MARKET",
      "selectionMetric": "validation F1",
      "acceptanceRule": "DL requires +0.03 test F1 and +0.02 test balanced accuracy plus safety/latency constraints",
      "offer": {
        "selectedModel": "CatBoostClassifier",
        "strongestTabular": "CatBoostClassifier",
        "neuralCandidate": "EmbeddingMLP",
        "acceptance": {
          "passed": false,
          "differences": {
            "f1": -0.0196,
            "balancedAccuracy": -0.0432,
            "precision": -0.0289,
            "recall": 0.0257,
            "brierScore": 0.011684
          },
          "checks": {
            "f1GainAtLeast003": false,
            "balancedAccuracyGainAtLeast002": false,
            "precisionDegradationWithin002": false,
            "recallDegradationWithin002": true,
            "brierNotMateriallyWorse": true,
            "singleInferenceUnder150Ms": true
          }
        },
        "reason": "CatBoost had the highest validation F1 among tabular finalists; the offer MLP failed the DL acceptance margins. CatBoost remains optional and falls back to RandomForest when unavailable.",
        "rejectedModels": [
          {
            "modelName": "currentBaseline",
            "testF1DifferenceVsSelected": -0.0066,
            "testBalancedAccuracyDifferenceVsSelected": -0.0001,
            "singleInferenceMeanMsDifferenceVsSelected": 45.4038,
            "artifactBytesDifferenceVsSelected": 19301218,
            "reason": "Rejected by validation-only selection; test reporting difference versus the selected model was -0.0066 F1 and -0.0001 balanced accuracy."
          },
          {
            "modelName": "EmbeddingMLP",
            "testF1DifferenceVsSelected": -0.0196,
            "testBalancedAccuracyDifferenceVsSelected": -0.0432,
            "singleInferenceMeanMsDifferenceVsSelected": -0.9437,
            "artifactBytesDifferenceVsSelected": 50743,
            "reason": "Failed the explicit DL rule: test F1 difference -0.0196, balanced-accuracy difference -0.0432, precision difference -0.0289, recall difference +0.0257, and Brier difference +0.011684."
          }
        ],
        "selectedTestMetrics": {
          "accuracy": 0.5392,
          "balancedAccuracy": 0.5877,
          "precision": 0.4754,
          "recall": 0.8974,
          "f1": 0.6215,
          "rocAuc": 0.6711,
          "brierScore": 0.222888,
          "threshold": 0.28,
          "testRows": 740,
          "confusionMatrix": [
            [
              119,
              309
            ],
            [
              32,
              280
            ]
          ]
        },
        "selectedRuntime": {
          "modelName": "CatBoostClassifier",
          "coldStartupMs": 1.133,
          "latency": {
            "1": {
              "meanMs": 1.3953,
              "medianMs": 1.3858,
              "p95Ms": 1.595,
              "repetitions": 100
            },
            "32": {
              "meanMs": 1.6186,
              "medianMs": 1.6064,
              "p95Ms": 1.7544,
              "repetitions": 100
            },
            "256": {
              "meanMs": 2.1839,
              "medianMs": 2.1479,
              "p95Ms": 2.3565,
              "repetitions": 100
            }
          },
          "artifactBytes": 70504,
          "trainingDurationSeconds": 3.107,
          "device": "CPU",
          "serviceStartupExcludedFromLatency": true
        }
      },
      "purchase": {
        "selectedModel": "currentBaseline",
        "strongestTabular": "currentBaseline",
        "neuralCandidate": "EmbeddingMLP",
        "acceptance": {
          "passed": false,
          "differences": {
            "f1": -0.0024,
            "balancedAccuracy": -0.0006,
            "precision": 0.0096,
            "recall": -0.0224,
            "brierScore": 0.00109
          },
          "checks": {
            "f1GainAtLeast003": false,
            "balancedAccuracyGainAtLeast002": false,
            "precisionDegradationWithin002": true,
            "recallDegradationWithin002": false,
            "brierNotMateriallyWorse": true,
            "singleInferenceUnder150Ms": true
          }
        },
        "reason": "HistGradientBoosting retained the highest validation F1. The MLP missed the test F1 and balanced-accuracy gains; the GRU also trailed the simpler MLP while training much longer.",
        "rejectedModels": [
          {
            "modelName": "CatBoostClassifier",
            "testF1DifferenceVsSelected": -0.0051,
            "testBalancedAccuracyDifferenceVsSelected": -0.0055,
            "singleInferenceMeanMsDifferenceVsSelected": -8.2943,
            "artifactBytesDifferenceVsSelected": -653448,
            "reason": "Rejected by validation-only selection; test reporting difference versus the selected model was -0.0051 F1 and -0.0055 balanced accuracy."
          },
          {
            "modelName": "EmbeddingMLP",
            "testF1DifferenceVsSelected": -0.0024,
            "testBalancedAccuracyDifferenceVsSelected": -0.0006,
            "singleInferenceMeanMsDifferenceVsSelected": -9.35,
            "artifactBytesDifferenceVsSelected": -675931,
            "reason": "Failed the explicit DL rule: test F1 difference -0.0024, balanced-accuracy difference -0.0006, precision difference +0.0096, recall difference -0.0224, and Brier difference +0.001090."
          },
          {
            "modelName": "PurchaseGRU",
            "testF1DifferenceVsSelected": -0.0051,
            "testBalancedAccuracyDifferenceVsSelected": -0.0046,
            "singleInferenceMeanMsDifferenceVsSelected": -7.9801,
            "artifactBytesDifferenceVsSelected": -712035,
            "reason": "Rejected because validation F1 0.7258 did not beat the simpler MLP 0.7285; CPU training took 515.732s versus 52.808s."
          }
        ],
        "selectedTestMetrics": {
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
        },
        "selectedRuntime": {
          "modelName": "HistGradientBoostingClassifier",
          "coldStartupMs": 13.7886,
          "latency": {
            "1": {
              "meanMs": 9.7951,
              "medianMs": 9.8053,
              "p95Ms": 10.5096,
              "repetitions": 100
            },
            "32": {
              "meanMs": 9.8746,
              "medianMs": 9.8276,
              "p95Ms": 10.7299,
              "repetitions": 100
            },
            "256": {
              "meanMs": 10.779,
              "medianMs": 10.4805,
              "p95Ms": 11.7906,
              "repetitions": 100
            }
          },
          "artifactBytes": 806420,
          "trainingDurationSeconds": 1.854,
          "device": "CPU",
          "serviceStartupExcludedFromLatency": true
        }
      },
      "finalTestWasNotUsedForSelection": true,
      "leakageChecks": {
        "offerTemporalSeparation": true,
        "offerStableTestHash": true,
        "purchaseTemporalSeparation": true,
        "purchaseStableTestHash": true,
        "offerLabelsExcluded": true,
        "purchaseLabelsExcluded": true,
        "timestampsAndIdsExcludedFromNumericInputs": true,
        "unknownCategoriesUseSafeIndex": true,
        "gruSequenceStrictCutoff": true,
        "trainOnlyVocabulariesAndScalers": true
      },
      "savedArtifactProbabilityReproduction": {
        "offerCatBoost": true,
        "purchaseCatBoost": true,
        "offerEmbeddingMlp": true,
        "purchaseEmbeddingMlp": true,
        "purchaseGru": true
      },
      "integration": {
        "offer": "optional CatBoost local artifact with baseline fallback",
        "purchase": "existing HistGradientBoosting bundle",
        "normalRuntimeRequiresTorch": false
      }
    },
    "recommendationExamples": {
      "label": "MOCK / SYNTHETIC DEEP-LEARNING BENCHMARK — SAUDI MARKET",
      "selectedModels": {
        "offer": "CatBoostClassifier",
        "purchase": "currentBaseline"
      },
      "examples": {
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
            "offerProbability": 0.6786,
            "purchaseProbability": 0.827,
            "personalizedScore": 0.1445,
            "windowDays": 7,
            "estimatedSavingSar": 15.45,
            "occasion": "اليوم الوطني السعودي",
            "eligible": true,
            "suppressionReason": null,
            "reasons": [
              "تكرر الشراء 3 مرة خلال آخر 30 يوماً",
              "ظهرت 11 حملات تجريبية في الموسم نفسه سابقاً",
              "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 15.45 ر.س"
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
            "offerProbability": 0.3358,
            "purchaseProbability": 0.6082,
            "personalizedScore": 0.1278,
            "windowDays": 7,
            "estimatedSavingSar": 72.05,
            "occasion": "اليوم الوطني السعودي",
            "eligible": true,
            "suppressionReason": null,
            "reasons": [
              "فواصل الشراء السابقة منتظمة نسبياً",
              "ظهرت 12 حملات تجريبية في الموسم نفسه سابقاً",
              "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 72.05 ر.س"
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
            "offerProbability": 0.7222,
            "purchaseProbability": 0.9101,
            "personalizedScore": 0.0719,
            "windowDays": 7,
            "estimatedSavingSar": 33.73,
            "occasion": "اليوم الوطني السعودي",
            "eligible": true,
            "suppressionReason": null,
            "reasons": [
              "فواصل الشراء السابقة منتظمة نسبياً",
              "ظهرت 16 حملات تجريبية في الموسم نفسه سابقاً",
              "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 33.73 ر.س"
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
            "offerProbability": 0.6786,
            "purchaseProbability": 0.5,
            "personalizedScore": 0.06,
            "windowDays": 7,
            "estimatedSavingSar": 11.04,
            "occasion": "اليوم الوطني السعودي",
            "eligible": true,
            "suppressionReason": null,
            "reasons": [
              "تكرر الشراء 3 مرة خلال آخر 30 يوماً",
              "ظهرت 5 حملات تجريبية في الموسم نفسه سابقاً",
              "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 11.04 ر.س"
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
            "offerProbability": 0.6667,
            "purchaseProbability": 0.9101,
            "personalizedScore": 0.0554,
            "windowDays": 7,
            "estimatedSavingSar": 15.01,
            "occasion": "اليوم الوطني السعودي",
            "eligible": true,
            "suppressionReason": null,
            "reasons": [
              "فواصل الشراء السابقة منتظمة نسبياً",
              "ظهرت 13 حملات تجريبية في الموسم نفسه سابقاً",
              "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 15.01 ر.س"
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
            "offerProbability": 0.4023,
            "purchaseProbability": 0.5588,
            "personalizedScore": 0.0442,
            "windowDays": 7,
            "estimatedSavingSar": 11.79,
            "occasion": "اليوم الوطني السعودي",
            "eligible": true,
            "suppressionReason": null,
            "reasons": [
              "تكرر الشراء 3 مرة خلال آخر 30 يوماً",
              "ظهرت 11 حملات تجريبية في الموسم نفسه سابقاً",
              "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 11.79 ر.س"
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
            "offerProbability": 0.6786,
            "purchaseProbability": 0.827,
            "personalizedScore": 0.1445,
            "windowDays": 7,
            "estimatedSavingSar": 15.45,
            "occasion": "اليوم الوطني السعودي",
            "eligible": true,
            "suppressionReason": null,
            "reasons": [
              "تكرر الشراء 3 مرة خلال آخر 30 يوماً",
              "ظهرت 11 حملات تجريبية في الموسم نفسه سابقاً",
              "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 15.45 ر.س"
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
            "offerProbability": 0.6667,
            "purchaseProbability": 0.9583,
            "personalizedScore": 0.1325,
            "windowDays": 7,
            "estimatedSavingSar": 19.25,
            "occasion": "اليوم الوطني السعودي",
            "eligible": false,
            "suppressionReason": "essential_purchase",
            "reasons": [
              "فواصل الشراء السابقة منتظمة نسبياً",
              "ظهرت 6 حملات تجريبية في الموسم نفسه سابقاً",
              "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 19.25 ر.س"
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
            "offerProbability": 0.3358,
            "purchaseProbability": 0.6082,
            "personalizedScore": 0.1278,
            "windowDays": 7,
            "estimatedSavingSar": 72.05,
            "occasion": "اليوم الوطني السعودي",
            "eligible": true,
            "suppressionReason": null,
            "reasons": [
              "فواصل الشراء السابقة منتظمة نسبياً",
              "ظهرت 12 حملات تجريبية في الموسم نفسه سابقاً",
              "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 72.05 ر.س"
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
            "offerProbability": 0.7222,
            "purchaseProbability": 0.9101,
            "personalizedScore": 0.0719,
            "windowDays": 7,
            "estimatedSavingSar": 33.73,
            "occasion": "اليوم الوطني السعودي",
            "eligible": true,
            "suppressionReason": null,
            "reasons": [
              "فواصل الشراء السابقة منتظمة نسبياً",
              "ظهرت 16 حملات تجريبية في الموسم نفسه سابقاً",
              "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 33.73 ر.س"
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
            "offerProbability": 0.6786,
            "purchaseProbability": 0.5,
            "personalizedScore": 0.06,
            "windowDays": 7,
            "estimatedSavingSar": 11.04,
            "occasion": "اليوم الوطني السعودي",
            "eligible": true,
            "suppressionReason": null,
            "reasons": [
              "تكرر الشراء 3 مرة خلال آخر 30 يوماً",
              "ظهرت 5 حملات تجريبية في الموسم نفسه سابقاً",
              "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 11.04 ر.س"
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
            "offerProbability": 0.6667,
            "purchaseProbability": 0.9101,
            "personalizedScore": 0.0554,
            "windowDays": 7,
            "estimatedSavingSar": 15.01,
            "occasion": "اليوم الوطني السعودي",
            "eligible": true,
            "suppressionReason": null,
            "reasons": [
              "فواصل الشراء السابقة منتظمة نسبياً",
              "ظهرت 13 حملات تجريبية في الموسم نفسه سابقاً",
              "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 15.01 ر.س"
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
            "offerProbability": 0.4023,
            "purchaseProbability": 0.5588,
            "personalizedScore": 0.0442,
            "windowDays": 7,
            "estimatedSavingSar": 11.79,
            "occasion": "اليوم الوطني السعودي",
            "eligible": true,
            "suppressionReason": null,
            "reasons": [
              "تكرر الشراء 3 مرة خلال آخر 30 يوماً",
              "ظهرت 11 حملات تجريبية في الموسم نفسه سابقاً",
              "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 11.79 ر.س"
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
            "offerProbability": 0.3358,
            "purchaseProbability": 0.5837,
            "personalizedScore": 0.0395,
            "windowDays": 7,
            "estimatedSavingSar": 12.09,
            "occasion": "اليوم الوطني السعودي",
            "eligible": false,
            "suppressionReason": "essential_purchase",
            "reasons": [
              "تكرر الشراء 1 مرة خلال آخر 30 يوماً",
              "ظهرت 5 حملات تجريبية في الموسم نفسه سابقاً",
              "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 12.09 ر.س"
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
            "offerProbability": 0.4023,
            "purchaseProbability": 0.9101,
            "personalizedScore": 0.0381,
            "windowDays": 7,
            "estimatedSavingSar": 16.67,
            "occasion": "اليوم الوطني السعودي",
            "eligible": false,
            "suppressionReason": "threshold_not_met",
            "reasons": [
              "فواصل الشراء السابقة منتظمة نسبياً",
              "ظهرت 11 حملات تجريبية في الموسم نفسه سابقاً",
              "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 16.67 ر.س"
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
            "offerProbability": 0.3358,
            "purchaseProbability": 0.9101,
            "personalizedScore": 0.0314,
            "windowDays": 7,
            "estimatedSavingSar": 24.02,
            "occasion": "اليوم الوطني السعودي",
            "eligible": false,
            "suppressionReason": "threshold_not_met",
            "reasons": [
              "ظهرت 9 حملات تجريبية في الموسم نفسه سابقاً",
              "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 24.02 ر.س"
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
            "offerProbability": 0.4023,
            "purchaseProbability": 0.9101,
            "personalizedScore": 0.0191,
            "windowDays": 7,
            "estimatedSavingSar": 13.78,
            "occasion": "اليوم الوطني السعودي",
            "eligible": false,
            "suppressionReason": "threshold_not_met",
            "reasons": [
              "فواصل الشراء السابقة منتظمة نسبياً",
              "ظهرت 9 حملات تجريبية في الموسم نفسه سابقاً",
              "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 13.78 ر.س"
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
            "offerProbability": 0.4023,
            "purchaseProbability": 0.2009,
            "personalizedScore": 0.0112,
            "windowDays": 7,
            "estimatedSavingSar": 8.68,
            "occasion": "اليوم الوطني السعودي",
            "eligible": false,
            "suppressionReason": "essential_purchase",
            "reasons": [
              "تكرر الشراء 1 مرة خلال آخر 30 يوماً",
              "ظهرت 9 حملات تجريبية في الموسم نفسه سابقاً",
              "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 8.68 ر.س"
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
            "offerProbability": 0.6667,
            "purchaseProbability": 0.6538,
            "personalizedScore": 0.0111,
            "windowDays": 7,
            "estimatedSavingSar": 10.12,
            "occasion": "اليوم الوطني السعودي",
            "eligible": false,
            "suppressionReason": "essential_purchase",
            "reasons": [
              "فواصل الشراء السابقة منتظمة نسبياً",
              "ظهرت 7 حملات تجريبية في الموسم نفسه سابقاً",
              "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 10.12 ر.س"
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
            "offerProbability": 0.5769,
            "purchaseProbability": 0.0814,
            "personalizedScore": 0.0025,
            "windowDays": 7,
            "estimatedSavingSar": 15.2,
            "occasion": "اليوم الوطني السعودي",
            "eligible": false,
            "suppressionReason": "threshold_not_met",
            "reasons": [
              "تكرر الشراء 1 مرة خلال آخر 30 يوماً",
              "ظهرت 11 حملات تجريبية في الموسم نفسه سابقاً",
              "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 15.2 ر.س"
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
            "offerProbability": 0.3358,
            "purchaseProbability": 0.0085,
            "personalizedScore": 0.0014,
            "windowDays": 7,
            "estimatedSavingSar": 76.06,
            "occasion": "اليوم الوطني السعودي",
            "eligible": false,
            "suppressionReason": "threshold_not_met",
            "reasons": [
              "تكرر الشراء 1 مرة خلال آخر 30 يوماً",
              "ظهرت 7 حملات تجريبية في الموسم نفسه سابقاً",
              "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 76.06 ر.س"
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
            "offerProbability": 0.5769,
            "purchaseProbability": 0.9101,
            "personalizedScore": 0.0012,
            "windowDays": 7,
            "estimatedSavingSar": 7.73,
            "occasion": "اليوم الوطني السعودي",
            "eligible": false,
            "suppressionReason": "threshold_not_met",
            "reasons": [
              "فواصل الشراء السابقة منتظمة نسبياً",
              "ظهرت 12 حملات تجريبية في الموسم نفسه سابقاً",
              "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 7.73 ر.س"
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
            "offerProbability": 0.6786,
            "purchaseProbability": 0.6538,
            "personalizedScore": 0,
            "windowDays": 7,
            "estimatedSavingSar": 35.31,
            "occasion": "اليوم الوطني السعودي",
            "eligible": false,
            "suppressionReason": "threshold_not_met",
            "reasons": [
              "فواصل الشراء السابقة منتظمة نسبياً",
              "ظهرت 9 حملات تجريبية في الموسم نفسه سابقاً",
              "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 35.31 ر.س"
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
            "offerProbability": 0.7222,
            "purchaseProbability": 0.6538,
            "personalizedScore": 0,
            "windowDays": 7,
            "estimatedSavingSar": 36.85,
            "occasion": "اليوم الوطني السعودي",
            "eligible": false,
            "suppressionReason": "threshold_not_met",
            "reasons": [
              "فواصل الشراء السابقة منتظمة نسبياً",
              "ظهرت 17 حملات تجريبية في الموسم نفسه سابقاً",
              "تأجيل عملية غير أساسية حتى 7 أيام قد يوفر نحو 36.85 ر.س"
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
      "orchestratorChecks": {
        "bothProbabilitiesRequired": true,
        "essentialCategoriesSuppressed": true,
        "priorDecisionSuppressionPreserved": true,
        "lowExpectedSavingsRankedLower": true,
        "probabilisticWording": true,
        "hardcodedWinner": false
      }
    },
    "leakageTests": {
      "label": "MOCK / SYNTHETIC DEEP-LEARNING BENCHMARK — SAUDI MARKET",
      "checks": {
        "offerTemporalSeparation": true,
        "offerStableTestHash": true,
        "purchaseTemporalSeparation": true,
        "purchaseStableTestHash": true,
        "offerLabelsExcluded": true,
        "purchaseLabelsExcluded": true,
        "timestampsAndIdsExcludedFromNumericInputs": true,
        "unknownCategoriesUseSafeIndex": true,
        "gruSequenceStrictCutoff": true,
        "trainOnlyVocabulariesAndScalers": true
      },
      "passed": true
    }
  }
};
