import { Router } from "express";
import HealthRouter from "../modules/health/health.routes";
import AuthRouter from "../modules/auth/auth.routes";
import UserRouter from "../modules/user/user.routes";
import UploadRouter from "../modules/upload/upload.routes";
import ThreadRouter from "../modules/threads/thread.routes";

const router = Router();

router.use("/health", HealthRouter);
router.use("/auth", AuthRouter);
router.use("/user", UserRouter);
router.use("/upload", UploadRouter);
router.use("/threads", ThreadRouter);

export default router;
