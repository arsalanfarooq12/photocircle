// validates the input for the tasks
// uses express-validator for this

import { checkSchema } from "express-validator";

export const createTaskSchema = checkSchema({
  title: {
    notEmpty: { errorMessage: "Title required" },
    isLength: { options: { min: 3 }, errorMessage: "Title min 3 chars" },
  },
  description: {
    optional: true,
    isString: { errorMessage: "Description must be a string" },
  },
});

export const updateTaskSchema = checkSchema({
  title: {
    optional: true,
    isLength: { options: { min: 3 }, errorMessage: "Title min 3 chars" },
  },
  description: {
    optional: true,
    isString: { errorMessage: "Description must be a string" },
  },
  completed: {
    optional: true,
    isBoolean: { errorMessage: "completed must be boolean" },
  },
});
