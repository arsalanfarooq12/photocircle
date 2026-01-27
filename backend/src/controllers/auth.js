import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import pool from "../db/pool.js";

export async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return next({ status: 400, message: "Email and password required" });

    const exists = await pool.query(
      "SELECT 1 FROM api.users WHERE email = $1",
      [email]
    );

    if (exists.rowCount > 0)
      return next({ status: 409, message: "Email already registered" });

    const id = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(password, 10);

    const created = await pool.query(
      "INSERT INTO api.users (id, email, password_hash) VALUES ($1, $2, $3) RETURNING id, email, role",
      [id, email, passwordHash]
    );

    const user = created.rows[0];
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return next({ status: 400, message: "Email and password required" });

    const result = await pool.query(
      "SELECT id, email, role, password_hash FROM api.users WHERE email = $1",
      [email]
    );

    if (result.rowCount === 0)
      return next({ status: 401, message: "Invalid credentials" });

    const userRow = result.rows[0];
    const ok = await bcrypt.compare(password, userRow.password_hash);
    if (!ok) return next({ status: 401, message: "Invalid credentials" });

    const token = jwt.sign(
      { id: userRow.id, role: userRow.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      token,
      user: { id: userRow.id, email: userRow.email, role: userRow.role },
    });
  } catch (err) {
    next(err);
  }
}
