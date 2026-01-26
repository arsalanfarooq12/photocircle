import express from "express";
import { readDB, writeDB } from "./storage/db.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ ok: true });
});
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// Test storage
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

export default app;
