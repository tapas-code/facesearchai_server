const express = require("express");
const multer = require("multer");
const File = require("../models/File");
const router = express.Router();

const upload = multer(); // Memory storage (no file saved on disk)

// POST route for file upload
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { fileName, fileSize } = req.body;
    const { buffer } = req.file;

    if (!fileName || !fileSize || !buffer) {
      return res.status(400).json({ message: "Missing file data" });
    }

    // Create a new File document
    const newFile = new File({
      fileName,
      file: buffer,
      fileSize: parseInt(fileSize, 10),
    });

    // Save file to MongoDB
    await newFile.save();

    res.status(201).json({
      message: "File uploaded successfully",
      fileId: newFile._id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
