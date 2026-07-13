from pathlib import Path
import os

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
ARTIFACT_DIR = ROOT / "artifacts"
MODEL_DIR = ARTIFACT_DIR / "models"
OFFER_MODEL_PATH = MODEL_DIR / "offer_model.joblib"
PURCHASE_MODEL_PATH = MODEL_DIR / "purchase_model.joblib"

RANDOM_SEED = 20260923
DEMO_AS_OF = "2026-09-20"
DATA_START = "2022-01-03"
DATASET_VERSION = "synthetic-saudi-v2"
DATA_LABEL = "MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET"
RESULTS_LABEL_AR = "نتائج على بيانات تجريبية من السوق السعودي"
DISCLAIMER_AR = "توقع احتمالي مبني على بيانات تجريبية وأنماط سابقة، وليس عرضاً مضموناً"

OFFER_THRESHOLD = float(os.getenv("OFFER_THRESHOLD", "0.46"))
RECOMMENDATION_THRESHOLD = float(os.getenv("RECOMMENDATION_THRESHOLD", "0.04"))
MIN_SAVING_SAR = float(os.getenv("MIN_SAVING_SAR", "5"))
APP_ENV = os.getenv("APP_ENV", "development").lower()
