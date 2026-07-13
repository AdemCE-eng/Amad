from __future__ import annotations

from dataclasses import dataclass
import numpy as np
import pandas as pd
import torch
from torch.utils.data import Dataset


@dataclass
class Vocabulary:
    values: dict[str, int]

    @classmethod
    def fit(cls, values):
        unique = sorted({str(value) for value in values if pd.notna(value)})
        return cls({value: index + 1 for index, value in enumerate(unique)})

    def encode(self, value):
        return self.values.get(str(value), 0)

    @property
    def size(self):
        return len(self.values) + 1


class TabularEncoder:
    def __init__(self, categorical, numeric):
        self.categorical = list(categorical)
        self.numeric = list(numeric)
        self.vocabularies = {}
        self.means = None
        self.scales = None

    def fit(self, frame):
        self.vocabularies = {name: Vocabulary.fit(frame[name]) for name in self.categorical}
        values = frame[self.numeric].astype(float).replace([np.inf, -np.inf], np.nan).fillna(0).to_numpy(np.float64)
        self.means = values.mean(axis=0)
        self.scales = values.std(axis=0)
        self.scales[self.scales < 1e-8] = 1.0
        return self

    def transform(self, frame):
        cats = np.column_stack([
            frame[name].map(self.vocabularies[name].encode).to_numpy(np.int64)
            for name in self.categorical
        ])
        nums = frame[self.numeric].astype(float).replace([np.inf, -np.inf], np.nan).fillna(0).to_numpy(np.float64)
        nums = ((nums - self.means) / self.scales).astype(np.float32)
        return cats, nums

    @property
    def cardinalities(self):
        return [self.vocabularies[name].size for name in self.categorical]

    def metadata(self):
        return {
            "categorical": self.categorical,
            "numeric": self.numeric,
            "vocabularies": {name: vocab.values for name, vocab in self.vocabularies.items()},
            "means": self.means.tolist(),
            "scales": self.scales.tolist(),
            "fitScope": "training rows only",
            "unknownIndex": 0,
        }


class TabularFrameDataset(Dataset):
    def __init__(self, frame, encoder):
        self.cats, self.nums = encoder.transform(frame)
        self.labels = frame.target.to_numpy(np.float32)

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, index):
        return {
            "categorical": torch.from_numpy(self.cats[index]),
            "numeric": torch.from_numpy(self.nums[index]),
            "target": torch.tensor(self.labels[index], dtype=torch.float32),
        }


class SequenceHistory:
    PERIODS = {"morning": 1, "afternoon": 2, "evening": 3, "night": 4}

    def __init__(self, transactions, train_cutoff):
        ordered = transactions.sort_values("timestamp").copy()
        fitting = ordered[ordered.timestamp < pd.Timestamp(train_cutoff)]
        self.merchant_vocab = Vocabulary.fit(fitting.merchant_id)
        self.category_vocab = Vocabulary.fit(fitting.category)
        self.city_vocab = Vocabulary.fit(fitting.city)
        amounts = fitting.amount_sar.to_numpy(float)
        self.amount_mean = float(amounts.mean())
        self.amount_scale = float(amounts.std()) or 1.0
        self.histories = {}
        for user_id, frame in ordered.groupby("user_id", sort=False):
            frame = frame.sort_values("timestamp").reset_index(drop=True)
            times = frame.timestamp.to_numpy(dtype="datetime64[ns]")
            deltas = frame.timestamp.diff().dt.total_seconds().div(86400).fillna(0).to_numpy(float)
            self.histories[str(user_id)] = {
                "times": times,
                "merchant": frame.merchant_id.astype(str).to_numpy(),
                "category": frame.category.astype(str).to_numpy(),
                "city": frame.city.astype(str).to_numpy(),
                "amount": frame.amount_sar.to_numpy(float),
                "delta": deltas,
                "weekday": frame.timestamp.dt.weekday.to_numpy(int),
                "period": frame.time_period.astype(str).to_numpy(),
                "salary": frame.timestamp.dt.day.between(24, 28).to_numpy(int),
                "weekend": frame.timestamp.dt.weekday.isin([4, 5]).to_numpy(int),
                "essential": frame.is_essential.astype(int).to_numpy(),
            }

    @property
    def event_cardinalities(self):
        return [self.merchant_vocab.size, self.category_vocab.size, self.city_vocab.size, 8, 5]

    def encode(self, user_id, as_of, max_length=30):
        history = self.histories.get(str(user_id))
        categorical = np.zeros((max_length, 5), dtype=np.int64)
        numerical = np.zeros((max_length, 6), dtype=np.float32)
        if history is None:
            return categorical, numerical, 1
        timestamp = np.datetime64(pd.Timestamp(as_of), "ns")
        stop = int(np.searchsorted(history["times"], timestamp, side="left"))
        start = max(0, stop - max_length)
        indexes = np.arange(start, stop)
        length = len(indexes)
        if not length:
            return categorical, numerical, 1
        for out, source in enumerate(indexes):
            categorical[out] = [
                self.merchant_vocab.encode(history["merchant"][source]),
                self.category_vocab.encode(history["category"][source]),
                self.city_vocab.encode(history["city"][source]),
                int(history["weekday"][source]) + 1,
                self.PERIODS.get(history["period"][source], 0),
            ]
            days_before = float((timestamp - history["times"][source]) / np.timedelta64(1, "D"))
            numerical[out] = [
                (history["amount"][source] - self.amount_mean) / self.amount_scale,
                min(history["delta"][source], 365) / 90.0,
                min(max(days_before, 0), 730) / 365.0,
                history["salary"][source], history["weekend"][source], history["essential"][source],
            ]
        return categorical, numerical, length

    def metadata(self):
        return {
            "merchantVocabulary": self.merchant_vocab.values,
            "categoryVocabulary": self.category_vocab.values,
            "cityVocabulary": self.city_vocab.values,
            "amountMean": self.amount_mean,
            "amountScale": self.amount_scale,
            "fitScope": "transactions strictly before the final training snapshot",
            "sequenceCutoff": "event timestamp strictly less than prediction timestamp",
        }


class SequenceFrameDataset(Dataset):
    def __init__(self, frame, encoder, history, max_length=30):
        self.frame = frame.reset_index(drop=True)
        self.cats, self.nums = encoder.transform(self.frame)
        self.labels = self.frame.target.to_numpy(np.float32)
        self.history = history
        self.max_length = max_length

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, index):
        row = self.frame.iloc[index]
        seq_cat, seq_num, length = self.history.encode(row.user_id, row.as_of_date, self.max_length)
        return {
            "categorical": torch.from_numpy(self.cats[index]),
            "numeric": torch.from_numpy(self.nums[index]),
            "sequence_categorical": torch.from_numpy(seq_cat),
            "sequence_numeric": torch.from_numpy(seq_num),
            "lengths": torch.tensor(length, dtype=torch.int64),
            "target": torch.tensor(self.labels[index], dtype=torch.float32),
        }
