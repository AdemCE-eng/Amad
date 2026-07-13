from __future__ import annotations

import torch
from torch import nn
from torch.nn.utils.rnn import pack_padded_sequence

from .purchase_embedding_mlp import embedding_dimension


class PurchaseGRU(nn.Module):
    def __init__(self, candidate_cardinalities, event_cardinalities, numeric_count, embedding_dim=8, hidden_dim=32, dropout=.2):
        super().__init__()
        self.candidate_embeddings = nn.ModuleList([
            nn.Embedding(size, embedding_dimension(size, embedding_dim), padding_idx=0)
            for size in candidate_cardinalities
        ])
        event_dims = [embedding_dim, embedding_dim, embedding_dim, 4, 4]
        self.event_embeddings = nn.ModuleList([
            nn.Embedding(size, dim, padding_idx=0) for size, dim in zip(event_cardinalities, event_dims)
        ])
        event_width = sum(event_dims) + 6
        self.gru = nn.GRU(event_width, hidden_dim, batch_first=True)
        candidate_width = sum(layer.embedding_dim for layer in self.candidate_embeddings)
        self.classifier = nn.Sequential(
            nn.Linear(hidden_dim + candidate_width + numeric_count, 64), nn.GELU(),
            nn.LayerNorm(64), nn.Dropout(dropout), nn.Linear(64, 32), nn.GELU(),
            nn.Dropout(dropout), nn.Linear(32, 1),
        )

    def forward(self, categorical, numeric, sequence_categorical, sequence_numeric, lengths, **_):
        event_parts = [layer(sequence_categorical[:, :, index]) for index, layer in enumerate(self.event_embeddings)]
        event_tensor = torch.cat(event_parts + [sequence_numeric], dim=2)
        packed = pack_padded_sequence(event_tensor, lengths.cpu(), batch_first=True, enforce_sorted=False)
        _, hidden = self.gru(packed)
        candidate_parts = [layer(categorical[:, index]) for index, layer in enumerate(self.candidate_embeddings)]
        combined = torch.cat([hidden[-1]] + candidate_parts + [numeric], dim=1)
        return self.classifier(combined).squeeze(1)
