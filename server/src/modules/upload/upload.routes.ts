import { Router } from "express";
 
import upload from "../../shared/middlewares/upload-file";
import {
  deleteFile,
  uploadFile,
  uploadMultipleFile
} from "./upload.controller";
import { verifyAuthentication } from "../../shared/middlewares/verify-auth";
 
const router = Router();
router.use(verifyAuthentication);
 
router.post("/file", upload.single("file"), uploadFile);
router.post("/files", upload.array("files", 10), uploadMultipleFile);
router.delete("/", deleteFile);
 
export default router;
