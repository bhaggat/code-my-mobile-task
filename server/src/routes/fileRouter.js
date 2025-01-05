import { Router } from "express";
import mongoose from "mongoose";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const fileRouter = Router();
fileRouter.get("/files/:fileId", authMiddleware, (req, res) => {
  const { fileId } = req.params;

  const downloadStream = bucket.openDownloadStream(
    new mongoose.Types.ObjectId(fileId)
  );

  downloadStream.on("file", (file) => {
    res.set("Content-Type", file.contentType);
  });

  downloadStream.pipe(res);
});

export default fileRouter;
