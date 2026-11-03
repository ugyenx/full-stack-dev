const { fileTypeFromFile } = require("file-type");
const fs = require("fs/promises");
const path = require("path");

const validateImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const fileType = await fileTypeFromFile(req.file.path);

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!fileType || !allowedTypes.includes(fileType.mime)) {
      await fs.unlink(req.file.path);

      return res.status(400).json({
        success: false,
        message: "Only JPEG, PNG and WebP images are allowed",
      });
    }

    const newFilename = `${req.file.filename}.${fileType.ext}`;

    const newPath = path.join(req.file.destination, newFilename);

    await fs.rename(req.file.path, newPath);

    req.file.filename = newFilename;
    req.file.path = newPath;
    req.file.detectedMimeType = fileType.mime;
    req.file.detectedExtension = fileType.ext;

    next();
  } catch (error) {
    if (req.file?.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }

    next(error);
  }
};

module.exports = validateImage;
