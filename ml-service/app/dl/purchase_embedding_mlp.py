from __future__ import annotations

import math
import torch
from torch import nn


def embedding_dimension(cardinality, requested=None):
    return int(requested or max(4, min(24, math.ceil(math.sqrt(cardinality)))))


class EmbeddingMLP(nn.Module):
    def __init__(self, cardinalities, numeric_count, hidden=(128, 64, 32), dropout=.2, embedding_dim=None):
        super().__init__()
        self.embeddings = nn.ModuleList([
            nn.Embedding(size, embedding_dimension(size, embedding_dim), padding_idx=0)
            for size in cardinalities
        ])
        input_size = sum(layer.embedding_dim for layer in self.embeddings) + numeric_count
        layers = []
        for width in hidden:
            layers.extend([nn.Linear(input_size, width), nn.GELU(), nn.LayerNorm(width), nn.Dropout(dropout)])
            input_size = width
        layers.append(nn.Linear(input_size, 1))
        self.network = nn.Sequential(*layers)

    def forward(self, categorical, numeric, **_):
        embedded = [layer(categorical[:, index]) for index, layer in enumerate(self.embeddings)]
        return self.network(torch.cat(embedded + [numeric], dim=1)).squeeze(1)
