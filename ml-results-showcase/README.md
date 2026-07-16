# Nadeem ML results showcase

An offline, Arabic RTL results report. It is a continuous screenshot-ready dashboard with fixed 1920×1080 sections, not a presentation and not part of the production frontend.

Generate actual model artifacts, synchronize the offline bundle, then serve from the repository root:

```powershell
python -m scripts.evaluate_models # from ml-service; also generates the bundle
npm --prefix ml-results-showcase run sync-results
python -m http.server 8090
```

Open `http://127.0.0.1:8090/ml-results-showcase/`. No fallback metrics are embedded: unavailable results render as dashes or a training prompt.

Regenerate the screenshot set from the repository root after synchronizing results:

```powershell
npm --prefix visual-design install
npm --prefix visual-design run capture
```

The canonical tracked outputs are the 1920×1080 PNGs. Duplicate 1600×900 captures are retained locally but ignored by Git.
