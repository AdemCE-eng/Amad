import pandas as pd

from .settings import DATA_LABEL


FIXTURE_VERSION = "rashid-national-day-v1"
FROZEN_TRANSACTION_ID = "syn_txn_0000140"
FROZEN_TRANSACTION_TIMESTAMP = pd.Timestamp("2026-09-07T19:00:00")


def canonical_demo_transactions(transactions):
    """Return the frozen presentation history without mutating model data.

    The source row is SYNTHETIC. Moving its timestamp within the same synthetic
    history creates a repeatable inference fixture and does not touch the
    benchmark split, trained artifacts, or recorded metrics.
    """
    fixture = transactions.copy()
    mask = (
        (fixture["transaction_id"] == FROZEN_TRANSACTION_ID)
        & (fixture["user_id"] == "rashid")
        & (fixture["merchant_id"] == "half_million")
    )
    if int(mask.sum()) != 1:
        raise RuntimeError("canonical_demo_transaction_missing")
    fixture.loc[mask, "timestamp"] = FROZEN_TRANSACTION_TIMESTAMP
    fixture.loc[mask, "source_label"] = DATA_LABEL
    return fixture
