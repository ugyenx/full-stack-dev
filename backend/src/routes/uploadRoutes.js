const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const validateImage = require("../middleware/imageValidationMiddleware");
const uploadSingleImage = (req, res, next) => {
  upload.single("image")(req, res, (error) => {
    if (error) {
      return next(error);
    }

    next();
  });
};

router.post("/image", uploadSingleImage, validateImage, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Image validated successfully",
    file: {
      originalName: req.file.originalname,
      mimeType: req.file.detectedMimeType,
      extension: req.file.detectedExtension,
      size: req.file.size,
      path: req.file.path,
    },
  });
});

module.exports = router;
