import { Router } from "express";
 
import {
  getThreads,
  getThreadMessages,
  newMessage,
  newThread,
} from "./thread.controller";
import { validateRequest } from "@/src/shared/middlewares/validate-request";
import { messageSchema } from "./thread.schema";
import { verifyAuthentication } from "@/src/shared/middlewares/verify-auth";
 
const router = Router();
router.use(verifyAuthentication);
 
router.post("/", validateRequest(messageSchema), newThread);
router.get("/", getThreads);
router.get("/:threadId/messages", getThreadMessages);
router.post("/:threadId/messages", validateRequest(messageSchema), newMessage);
 
export default router;