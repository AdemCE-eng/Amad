from typing import Literal
from pydantic import BaseModel, Field


class OfferPredictionRequest(BaseModel):
    merchantId: str
    asOfDate: str | None = None
    windowDays: int = Field(default=7, ge=1, le=30)
    city: str | None = None


class OfferPrediction(BaseModel):
    merchantId: str
    merchantNameAr: str
    merchantNameEn: str
    offerProbability: float = Field(ge=0, le=1)
    windowDays: int
    estimatedSavingSar: float = Field(ge=0)
    occasion: str
    confidence: Literal["low", "medium", "high"]
    reasons: list[str]
    dataLabel: str

class PurchasePattern(BaseModel):
    merchantId: str
    merchantNameAr: str
    merchantNameEn: str
    category: str
    purchaseProbability7d: float = Field(ge=0, le=1)
    frequency30d: int = Field(ge=0)
    usualDay: str
    usualTimePeriod: str
    averageSpendSar: float = Field(ge=0)
    isEssential: bool
    reasons: list[str]


class Recommendation(BaseModel):
    userId: str
    merchantId: str
    merchant: str
    merchantNameAr: str
    category: str
    offerProbability: float
    purchaseProbability: float
    personalizedScore: float
    windowDays: int
    estimatedSavingSar: float
    occasion: str
    reasons: list[str]
    disclaimer: str
    dataLabel: str
