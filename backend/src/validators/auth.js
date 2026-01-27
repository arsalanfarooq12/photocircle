import { checkSchema } from "express-validator";

export const registerSchema = checkSchema({
  email: { isEmail: { errorMessage: "Valid email required" } },
  password: {
    isLength: { options: { min: 6 }, errorMessage: "Password min 6 chars" },
  },
});
