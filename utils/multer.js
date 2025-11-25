const multer = require("multer");
const path = require("path");
const fs = require("fs");

/**
 * Creates a Multer middleware for a specific upload folder.
 * Automatically creates the folder and stores relative paths.
 *
 * @param {string} folderName - Subfolder under /uploads (e.g. 'product', 'shop', 'user')
 */
const createMulter = (folderName = "") => {
  const baseUploadDir = path.join(__dirname, "..", "uploads");
  const uploadPath = path.join(baseUploadDir, folderName);

  // Create directory if not exists
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  // Configure storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const ext = path.extname(file.originalname);
      let baseName = path
        .basename(file.originalname, ext)
        .replace(/[^a-zA-Z0-9-_]/g, "_")
        .slice(0, 50);
      cb(null, `${baseName}-${timestamp}${ext}`);
    },
  });

  // Allow all file types (you can add filters later)
  const fileFilter = (req, file, cb) => cb(null, true);

  const upload = multer({ storage, fileFilter });

  /**
   * Helper function to build relative paths for uploaded files.
   * Example: buildRelativePaths(req.files, 'product')
   */
  const buildRelativePaths = (files) => {
    if (!files) return [];
    return files.map((f) => path.join("uploads", folderName, f.filename));
  };

  return { upload, buildRelativePaths };
};

module.exports = createMulter;
