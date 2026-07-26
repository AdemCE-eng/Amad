// index.js — Express application API.
import "dotenv/config";
import express from "express";
import cors from "cors";
import simulateRoutes from "./routes/simulate.js";
import gameRoutes from "./routes/game.js";
import familyRoutes from "./routes/family.js";
import offersRoutes from "./routes/offers.js";
import budgetRoutes from "./routes/budget.js";
import mlRoutes from "./routes/ml.js";
import userRoutes from "./routes/users.js";
import { requireUserScope } from "./services/userStore.js";

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

const app = express();
app.use(cors());
app.use(express.json());

// Session provisioning sits outside a user scope. Every product endpoint below
// requires a UUID and is transparently rooted under /users/{uuid}.
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

app.get("/", (_req, res) => res.json({
  name: "Nadeem API",
  health: "/health",
  description: "Application services for the Nadeem financial companion.",
}));

// Central error handler keeps the service responsive on unexpected failures.
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

  console.log(`Nadeem API: http://localhost:${PORT}/`);
});
