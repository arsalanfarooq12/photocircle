// this function validates user input
// if result is empty(means no validation errors ,then next() middleware is called)
import { validationResult } from "express-validator";

export function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  // if error is present it is sent to user.
  return res.status(422).json({
    errors: result.array().map((e) => ({ field: e.path, message: e.msg })),
  });
}
