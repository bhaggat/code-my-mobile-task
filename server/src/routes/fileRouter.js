import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { readFile, downloadFile } from "../controllers/fileController.js";

const fileRouter = Router();
fileRouter.get("/:fileId", authMiddleware, readFile);
fileRouter.get("/:fileId/download", authMiddleware, downloadFile);

export default fileRouter;
