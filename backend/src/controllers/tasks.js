// this controller handles Crud operation on postgresql database
import crypto from "node:crypto";
import pool from "../db/pool.js";

export async function listTasks(req, res, next) {
  try {
    const result = await pool.query(
      "SELECT id, title, description, completed, created_at, updated_at FROM api.tasks WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json({ tasks: result.rows });
  } catch (err) {
    next(err);
  }
}

export async function createTask(req, res, next) {
  try {
    const { title, description } = req.body;
    const id = crypto.randomUUID();

    const result = await pool.query(
      `INSERT INTO api.tasks (id, user_id, title, description)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, description, completed, created_at, updated_at`,
      [id, req.user.id, title, description || ""]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function getTask(req, res, next) {
  try {
    const result = await pool.query(
      "SELECT id, title, description, completed, created_at, updated_at FROM api.tasks WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user.id]
    );

    if (result.rowCount === 0)
      return next({ status: 404, message: "Task not found" });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// Update task function
export async function updateTask(req, res, next) {
  try {
    const { title, description, completed } = req.body;

    //  update fields if provided
    const result = await pool.query(
      `UPDATE api.tasks
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           completed = COALESCE($3, completed),
           updated_at = now()
       WHERE id = $4 AND user_id = $5
       RETURNING id, title, description, completed, created_at, updated_at`,
      [
        title ?? null,
        description ?? null,
        completed ?? null,
        req.params.id,
        req.user.id,
      ]
    );

    if (result.rowCount === 0)
      return next({ status: 404, message: "Task not found" });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// Delete task function
export async function deleteTask(req, res, next) {
  try {
    const result = await pool.query(
      "DELETE FROM api.tasks WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user.id]
    );

    if (result.rowCount === 0)
      return next({ status: 404, message: "Task not found" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
