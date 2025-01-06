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
  upload.array("files")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: "Error uploading files",
      });
    }

    const files = req.files;
    if (!files || files.length === 0) {
      req.uploadedFileIds = [];
      return next();
    }

    try {
      if (!bucket) {
        return res.status(500).json({
          success: false,
          message: "GridFSBucket not initialized",
        });
      }

      const uploadedFileIds = [];
      for (const file of files) {
        const { originalname, buffer } = file;

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

        uploadedFileIds.push(uploadStream.id);
      }

      req.uploadedFileIds = uploadedFileIds;

      // Ensure `allFileIds` is an array (parse if needed)
      if (typeof req.body.allFileIds === "string") {
        req.body.allFileIds = JSON.parse(req.body.allFileIds);
      } else if (!req.body.allFileIds) {
        req.body.allFileIds = []; // Default to an empty array if not provided
      }

      next();
    } catch (err) {
      next(err);
    }
  });
};
