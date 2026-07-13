from __future__ import annotations

import copy
import random
import time
import numpy as np
import torch
from sklearn.metrics import balanced_accuracy_score, brier_score_loss, f1_score, precision_score, recall_score, roc_auc_score
from torch import nn
from torch.utils.data import DataLoader

from app.modeling import threshold_search


def set_reproducible_seed(seed):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.use_deterministic_algorithms(True, warn_only=True)
    torch.set_num_threads(max(1, min(8, torch.get_num_threads())))


def _move(batch, device):
    return {key: value.to(device) for key, value in batch.items() if key != "target"}


@torch.no_grad()
def predict(model, dataset, batch_size=2048, device="cpu"):
    model.eval()
    probabilities, targets = [], []
    for batch in DataLoader(dataset, batch_size=batch_size, shuffle=False, num_workers=0):
        logits = model(**_move(batch, device))
        probabilities.append(torch.sigmoid(logits).cpu().numpy())
        targets.append(batch["target"].numpy())
    return np.concatenate(probabilities), np.concatenate(targets)


def train_model(model, train_dataset, validation_dataset, seed, epochs=16, batch_size=1024, learning_rate=1e-3, weight_decay=1e-4, patience=3):
    set_reproducible_seed(seed)
    device = "cpu"
    model.to(device)
    labels = train_dataset.labels
    positives = max(1.0, float(labels.sum()))
    pos_weight = torch.tensor([(len(labels) - positives) / positives], dtype=torch.float32, device=device)
    loss_fn = nn.BCEWithLogitsLoss(pos_weight=pos_weight)
    optimizer = torch.optim.AdamW(model.parameters(), lr=learning_rate, weight_decay=weight_decay)
    scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode="max", factor=.5, patience=1)
    generator = torch.Generator().manual_seed(seed)
    loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, generator=generator, num_workers=0)
    best_state, best_f1, best_epoch, stale = None, -1.0, 0, 0
    curve = []
    started = time.perf_counter()
    for epoch in range(1, epochs + 1):
        model.train()
        losses = []
        for batch in loader:
            optimizer.zero_grad(set_to_none=True)
            logits = model(**_move(batch, device))
            loss = loss_fn(logits, batch["target"].to(device))
            loss.backward()
            nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            optimizer.step()
            losses.append(float(loss.detach()))
        val_probability, val_target = predict(model, validation_dataset, batch_size=batch_size, device=device)
        _, selected = threshold_search(val_target, val_probability)
        curve.append({"epoch": epoch, "trainLoss": round(float(np.mean(losses)), 6), **selected})
        scheduler.step(selected["f1"])
        if selected["f1"] > best_f1 + 1e-6:
            best_f1, best_epoch, stale = selected["f1"], epoch, 0
            best_state = copy.deepcopy(model.state_dict())
        else:
            stale += 1
            if stale >= patience:
                break
    model.load_state_dict(best_state)
    duration = time.perf_counter() - started
    probability, target = predict(model, validation_dataset, batch_size=batch_size, device=device)
    return {
        "model": model, "validationProbability": probability, "validationTarget": target,
        "bestEpoch": best_epoch, "trainingDurationSeconds": round(duration, 3), "trainingCurve": curve,
    }


def classification_metrics(targets, probabilities, threshold):
    predicted = probabilities >= threshold
    return {
        "accuracy": round(float((predicted == targets).mean()), 4),
        "balancedAccuracy": round(float(balanced_accuracy_score(targets, predicted)), 4),
        "precision": round(float(precision_score(targets, predicted, zero_division=0)), 4),
        "recall": round(float(recall_score(targets, predicted, zero_division=0)), 4),
        "f1": round(float(f1_score(targets, predicted, zero_division=0)), 4),
        "rocAuc": round(float(roc_auc_score(targets, probabilities)), 4),
        "brierScore": round(float(brier_score_loss(targets, probabilities)), 6),
        "threshold": float(threshold), "testRows": int(len(targets)),
        "confusionMatrix": [
            [int(((targets == 0) & (predicted == 0)).sum()), int(((targets == 0) & (predicted == 1)).sum())],
            [int(((targets == 1) & (predicted == 0)).sum()), int(((targets == 1) & (predicted == 1)).sum())],
        ],
    }
