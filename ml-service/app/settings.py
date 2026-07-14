from pathlib import Path
import os

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
ARTIFACT_DIR = ROOT / "artifacts"
MODEL_DIR = ARTIFACT_DIR / "models"
OFFER_MODEL_PATH = MODEL_DIR / "offer_model.joblib"
PURCHASE_MODEL_PATH = MODEL_DIR / "purchase_model.joblib"
SELECTED_OFFER_MODEL_PATH = ARTIFACT_DIR / "dl-benchmark" / "models" / "selected_offer_model.joblib"

RANDOM_SEED = 20260923
# Frozen presentation fixture. This date is an existing realistic National Day
# candidate whose CatBoost output is stable and high-confidence without
# changing the trained artifact or benchmark evaluation split.
DEMO_USER_ID = "rashid"
DEMO_AS_OF = "2026-09-15"
DEMO_WINDOW_DAYS = 3
DATA_START = "2022-01-03"
DATASET_VERSION = "synthetic-saudi-v2"
DATA_LABEL = "MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET"
RESULTS_LABEL_AR = "نتائج على بيانات تجريبية من السوق السعودي"
DISCLAIMER_AR = "توقع احتمالي مبني على بيانات تجريبية وأنماط سابقة، وليس عرضاً مضموناً"

OFFER_THRESHOLD = float(os.getenv("OFFER_THRESHOLD", "0.46"))
RECOMMENDATION_THRESHOLD = float(os.getenv("RECOMMENDATION_THRESHOLD", "0.04"))
MIN_SAVING_SAR = float(os.getenv("MIN_SAVING_SAR", "5"))
APP_ENV = os.getenv("APP_ENV", "development").lower()
