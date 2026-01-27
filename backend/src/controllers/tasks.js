import { readDB, writeDB } from "../storage/db.js";
function generateId(prefix = "t") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function listTasks(req, res, next) {
  try {
    const db = await readDB();
    const tasks = db.tasks.filter((task) => task.userId === req.user.id); // used to retrieve only the tasks belonging to the logged-in userimport { readDB, writeDB } from '../storage/db.js';

    res.json({ tasks });
  } catch (err) {
    next(err);
  }
}

export async function createTask(req, res, next) {
  try {
    const { title, description } = req.body;

    if (!title || title.trim().length < 3) {
      return next({
        status: 400,
        message: "Title must be at least 3 characters",
      });
    }

    const db = await readDB();
    const task = {
      id: generateId("t"),
      userId: req.user.id,
      title: title.trim(),
      description: description?.trim() || "",
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.tasks.push(task); //since here the tasks in db.json is an array i used .push() method.
    await writeDB(db);

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

export async function getTask(req, res, next) {
  try {
    const { id } = req.params;
    const db = await readDB();

    const task = db.tasks.find((t) => t.id === id && t.userId === req.user.id);
    if (!task) {
      return next({ status: 404, message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req, res, next) {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const db = await readDB();
    const taskIndex = db.tasks.findIndex(
      (t) => t.id === id && t.userId === req.user.id
    );

    if (taskIndex === -1) {
      return next({ status: 404, message: "Task not found" });
    }

    const task = db.tasks[taskIndex];

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description?.trim() || "";
    if (completed !== undefined) task.completed = Boolean(completed);
    task.updatedAt = new Date().toISOString();

    await writeDB(db);
    res.json(task);
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;
    const db = await readDB();

    const taskIndex = db.tasks.findIndex(
      (t) => t.id === id && t.userId === req.user.id
    );
    if (taskIndex === -1) {
      return next({ status: 404, message: "Task not found" });
    }

    db.tasks.splice(taskIndex, 1);
    await writeDB(db);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
