import multer from "multer";
import mongoose from "mongoose";
import { Readable } from "stream";
import { mongooseConnection } from "../dbs/mongoDb.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

let bucket;

mongooseConnection.once("connected", () => {
  bucket = new mongoose.mongo.GridFSBucket(mongooseConnection.db);
  console.info("GridFSBucket initialized");
});

export const fileUploader = async (req, res, next) => {
  if (req.body.fieldType === "file") {
    upload.single("file")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: "Error uploading file",
        });
      }

      const { file } = req;
      if (!file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const { originalname, mimetype, buffer } = file;

      try {
        if (!bucket) {
          return res.status(500).json({
            success: false,
            message: "GridFSBucket not initialized",
          });
        }

        const uploadStream = bucket.openUploadStream(originalname);
        const readBuffer = new Readable();
        readBuffer.push(buffer);
        readBuffer.push(null);

        await new Promise((resolve, reject) => {
          readBuffer
            .pipe(uploadStream)
            .on("finish", resolve)
            .on("error", reject);
        });

        req.fileId = uploadStream.id;
        next();
      } catch (err) {
        next(err);
      }
    });
  } else {
    next();
  }
};
