// index.js — Express app: wires the API and serves the Cheat Controller at /.
import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import simulateRoutes from "./routes/simulate.js";
import gameRoutes from "./routes/game.js";
import familyRoutes from "./routes/family.js";
import offersRoutes from "./routes/offers.js";
import budgetRoutes from "./routes/budget.js";
import mlRoutes from "./routes/ml.js";
import userRoutes from "./routes/users.js";
import { requireUserScope } from "./services/userStore.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

const app = express();
app.use(cors());
app.use(express.json());

// Session provisioning and controller inventory intentionally sit outside a
// user scope. Every product endpoint below requires a UUID and is transparently
// rooted under /users/{uuid}.
app.use("/api", userRoutes);
app.use("/api", requireUserScope);

// User-scoped API
app.use("/api", simulateRoutes);
app.use("/api", gameRoutes);
app.use("/api", familyRoutes);
app.use("/api", offersRoutes);
app.use("/api", budgetRoutes);
app.use("/api", mlRoutes);
app.get("/health", (_req, res) => res.json({ ok: true, service: "amad-backend" }));

// Serve the Cheat Controller (static) at the root.
app.use(express.static(path.join(__dirname, "../../cheat-controller")));

// Central error handler — keeps the demo alive on unexpected failures.
app.use((err, _req, res, _next) => {
  console.error("❌", err);
  res.status(500).json({ ok: false, error: err.message });
});

app.listen(PORT, HOST, () => {
  if (HOST === "0.0.0.0") {
    console.log(`🚀 Backend listening on port: ${PORT}`);
  } else if (HOST === "127.0.0.1") {
    console.log(`🚀 Backend on http://localhost:${PORT}`);
  } else {
    console.log(`🚀 Backend on http://${HOST}:${PORT}`);
  }

  console.log(`🎮 Cheat Controller: http://localhost:${PORT}/`);
});
