import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    const token =
      header && header.startsWith("Bearer ") ? header.slice(7) : null; //This cuts off the first 7 characters ("Bearer ") to extract just the raw encrypted token string.

    if (!token) {
      return next({ status: 401, message: "Access token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: "u_123" }
    next();
  } catch (err) {
    next({ status: 403, message: "Invalid or expired token" });
  }
}
