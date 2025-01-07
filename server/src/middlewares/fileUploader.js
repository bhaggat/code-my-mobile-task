import multer from "multer";
import mongoose from "mongoose";
import { Readable } from "stream";
import { mongooseConnection } from "../dbs/mongoDb.js";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "../constants/constants.js";

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
        const { originalname, buffer, mimetype, size } = file;

        if (!ALLOWED_FILE_TYPES.includes(mimetype)) {
          return res.status(422).json({
            success: false,
            message: `File type not allowed: ${originalname}`,
          });
        }

        if (size > MAX_FILE_SIZE) {
          return res.status(422).json({
            success: false,
            message: `File size exceeds the limit of 5 MB: ${originalname}`,
          });
        }

        const uploadStream = bucket.openUploadStream(originalname);
        const readBuffer = new Readable();
        readBuffer.push(buffer);
        readBuffer.push(null);

        try {
          await new Promise((resolve, reject) => {
            readBuffer
              .pipe(uploadStream)
              .on("finish", resolve)
              .on("error", reject);
          });
          uploadedFileIds.push(uploadStream.id);
        } catch (uploadErr) {
          return res.status(500).json({
            success: false,
            message: `Failed to upload file: ${originalname}`,
          });
        }
      }

      req.uploadedFileIds = uploadedFileIds;
      next();
    } catch (err) {
      next(err);
    }
  });
};

export async function removeUploadedFiles(fileIds) {
  if (!fileIds || !fileIds.length || !bucket) return;

  try {
    for (const id of fileIds) {
      await bucket.delete(new mongoose.Types.ObjectId(id));
    }
  } catch (err) {
    console.error("Failed to delete uploaded files:", err);
  }
}

export const getDownloadMetaData = (fileId) => {
  return bucket.find({ _id: new mongoose.Types.ObjectId(fileId) });
};

export const getDownloadStreamFromBucket = (fileId) => {
  return bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
};
