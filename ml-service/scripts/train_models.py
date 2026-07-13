from app.features import load_data
from app.offer_model import save_bundle as save_offer, train_offer_bundle
from app.purchase_model import save_bundle as save_purchase, train_purchase_bundle
from scripts.generate_demo_data import generate
from app.settings import DATA_DIR


def train():
    if not (DATA_DIR / "merchant_catalog.csv").exists():
        generate()
    catalog, campaigns, transactions = load_data()
    offer_bundle, offer_test = train_offer_bundle(campaigns, catalog)
    purchase_bundle, purchase_test = train_purchase_bundle(transactions, catalog)
    save_offer(offer_bundle)
    save_purchase(purchase_bundle)
    print(f"offer test rows={len(offer_test)} cutoff={offer_bundle['cutoff']}")
    print(f"purchase test rows={len(purchase_test)} cutoff={purchase_bundle['cutoff']}")


if __name__ == "__main__":
    train()

