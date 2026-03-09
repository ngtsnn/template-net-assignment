import { Router } from "express";
import { verifyAuthentication } from "../../shared/middlewares/verify-auth";
import { getProfile } from "./user.controller";

const router = Router();

router.get(
  "/profile",
  verifyAuthentication,
  getProfile
);

export default router;
