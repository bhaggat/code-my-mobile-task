import {
  getDownloadMetaData,
  getDownloadStreamFromBucket,
} from "../middlewares/fileUploader.js";

export async function readFile(req, res, next) {
  const { fileId } = req.params;

  try {
    const files = await getDownloadMetaData(fileId).toArray();
    if (!files || files.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }

    const fileMetadata = files[0];
    res.status(200).json({
      success: true,
      data: {
        filename: fileMetadata.filename,
        contentType: fileMetadata.contentType,
        fileId: fileId,
        uploadDate: fileMetadata.uploadDate,
        size: fileMetadata.length,
      },
    });
  } catch (err) {
    console.error("Error getting file info:", err);
    res
      .status(500)
      .json({ success: false, message: "Error getting file info" });
  }
}
export async function downloadFile(req, res, next) {
  const { fileId } = req.params;

  try {
    const downloadStream = getDownloadStreamFromBucket(fileId);
    downloadStream.on("file", (file) => {
      if (!file) {
        return res
          .status(404)
          .json({ success: false, message: "File not found" });
      }
      res.set("Content-Type", file.contentType);
      res.set("Content-Disposition", `attachment; filename="${file.filename}"`);
    });

    downloadStream.on("error", (err) => {
      console.error("Error reading file:", err);
      res.status(500).json({ success: false, message: "Error reading file" });
    });

    downloadStream.pipe(res);
  } catch (err) {
    console.error("Error setting up download stream:", err);
    res
      .status(500)
      .json({ success: false, message: "Error setting up download stream" });
  }
}
