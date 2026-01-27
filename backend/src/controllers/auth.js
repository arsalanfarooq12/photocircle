import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { readDB, writeDB } from "../storage/db.js";

function generateId(prefix = "u") {
  // It combines a timestamp with a random alphanumeric string to ensure
  //  no two users have the same ID.
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
// register controller

export async function register(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next({ status: 400, message: "Email and password required" });
    }

    const db = await readDB();

    // Check if user exists
    const existingUser = db.users.find((u) => u.email === email);
    if (existingUser) {
      return next({ status: 409, message: "Email already registered" });
    }

    // Hash password + create user
    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
      id: generateId("u"),
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    db.users.push(user);
    await writeDB(db);

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    next(err);
  }
}

// login controller
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next({ status: 400, message: "Email and password required" });
    }

    const db = await readDB();
    const user = db.users.find((u) => u.email === email);

    if (!user) {
      return next({ status: 401, message: "Invalid credentials" });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return next({ status: 401, message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    next(err);
  }
}
