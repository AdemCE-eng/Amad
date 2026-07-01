// index.js — Express app: wires the API and serves the Cheat Controller at /.
import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import simulateRoutes from "./routes/simulate.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

// API
app.use("/api", simulateRoutes);
app.get("/health", (_req, res) => res.json({ ok: true, service: "amad-backend" }));

// Serve the Cheat Controller (static) at the root.
app.use(express.static(path.join(__dirname, "../../cheat-controller")));

// Central error handler — keeps the demo alive on unexpected failures.
app.use((err, _req, res, _next) => {
  console.error("❌", err);
  res.status(500).json({ ok: false, error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend on http://localhost:${PORT}`);
  console.log(`🎮 Cheat Controller: http://localhost:${PORT}/`);
});
