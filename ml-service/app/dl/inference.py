"""Small helpers used by the benchmark runtime measurements only."""

from __future__ import annotations

import torch


@torch.no_grad()
def probability(model, batch):
    model.eval()
    features = {key: value for key, value in batch.items() if key != "target"}
    return torch.sigmoid(model(**features)).cpu()
