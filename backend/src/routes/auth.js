import { Router } from "express";
import { register, login } from "../controllers/auth.js";
import { validate } from "../middleware/validate.js";
import { registerSchema } from "../validators/auth.js";
const router = Router();

router.post("/register", registerSchema, validate, register);
router.post("/login", validate, login);

export default router;
