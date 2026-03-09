import { Router } from "express";
import { signup, login } from "./auth.controller";
import { validateRequest } from "@/src/shared/middlewares/validate-request";
import { signupSchema, loginSchema } from "./auth.schema";

const router = Router();

router.post("/signup", validateRequest(signupSchema), signup);
router.post("/login", validateRequest(loginSchema), login);

export default router;
