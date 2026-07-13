# Visual design laboratory

Offline Arabic RTL canvases for inspecting and exporting individual technical visuals. This directory is separate from the production frontend and is not presentation software.

```powershell
python -m http.server 8090
# open http://127.0.0.1:8090/visual-design/
npm --prefix visual-design install
npm --prefix visual-design run capture
```

The capture script reads generated ML artifacts through `ml-results-showcase/generated-results.js`, serves the repository locally, and exports every component at 1920×1080 and 1600×900. Git keeps the canonical 1920×1080 PNG for each visual; duplicate 1600×900 exports remain available locally and are ignored.
