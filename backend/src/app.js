import express from "express";

import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

import { readDB, writeDB } from "./storage/db.js";
import authRoutes from "./routes/auth.js";
import tasksRoutes from "./routes/tasks.js";
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// basic global rate limit
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// Storage test endpoints
app.get("/db-test", async (req, res) => {
  const db = await readDB();
  res.json({ count: { users: db.users.length, tasks: db.tasks.length } });
});

app.post("/db-test", async (req, res) => {
  const db = await readDB();
  db.test = (db.test || 0) + 1;
  await writeDB(db);
  res.json({ testCount: db.test });
});

// stricter rate limits for auth routes
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });
app.use("/api/auth", authLimiter);

// Auth routes
app.use("/api/auth", authRoutes);

// Tasks routes
app.use("/api/tasks", tasksRoutes);

app.use("/*path", (req, res) => {
  // it was giving error because of express 5x doesnot support unammed route (*) so i add (/*path)
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Server error",
  });
});

export default app;
