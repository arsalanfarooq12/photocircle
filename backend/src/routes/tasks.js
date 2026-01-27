// this file is routes where CRUD ops are performed
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createTaskSchema, updateTaskSchema } from "../validators/tasks.js";
import {
  listTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} from "../controllers/tasks.js";

const router = Router();

// All routes require auth
router.use(requireAuth);

router.get("/", listTasks); // GET /api/tasks
router.post("/", createTaskSchema, validate, createTask); // POST /api/tasks
router.get("/:id", getTask); // GET /api/tasks/:id
router.put("/:id", updateTaskSchema, validate, updateTask); // PUT /api/tasks/:id
router.delete("/:id", deleteTask); // DELETE /api/tasks/:id

export default router;
