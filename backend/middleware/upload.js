import multer from 'multer';

/**
 * Configure Multer to handle file uploads in memory
 * Files will be stored as Buffer objects in req.files
 * This allows us to upload directly to Supabase without saving to disk
 */
const storage = multer.memoryStorage();

/**
 * File filter to validate file types
 */
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedMimeTypes = [
    // Images
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    // Notebooks & Scientific
    'application/x-ipynb+json',
    // Code files
    'application/javascript',
    'text/javascript',
    'application/typescript',
    'text/typescript',
    'text/x-python',
    'text/html',
    'text/css',
    'text/markdown',
    // Additional common office/archive/video variants
    'application/vnd.rar',
    'video/x-msvideo',
    // Archives
    'application/zip',
    'application/x-zip-compressed',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'application/gzip',
    'application/x-tar',
    // Text
    'text/plain',
    'text/csv',
    // Videos
    'video/mp4',
    'video/mpeg',
    'video/webm',
    'video/quicktime',
    // Generic/Other (for portfolio project files)
    'application/octet-stream',
    // JSON
    'application/json',
  ];

  // For portfolio project files, be more lenient with file types
  if (file.fieldname === 'projectFiles' || file.fieldname === 'videoFile') {
    cb(null, true);
  } else if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Only supported document, code, image, video, and archive files are allowed.`), false);
  }
};

/**
 * Multer upload configuration
 */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 20, // Maximum 20 files
  },
});

/**
 * Middleware for handling single file upload
 */
export const uploadSingle = (fieldName) => upload.single(fieldName);

/**
 * Middleware for handling multiple file uploads
 */
export const uploadMultiple = (fieldName, maxCount = 20) => upload.array(fieldName, maxCount);

/**
 * Middleware for handling multiple fields with files
 */
export const uploadFields = (fields) => upload.fields(fields);

/**
 * Error handler for multer errors
 */
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum file size is 50MB.',
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files. Maximum 20 files allowed.',
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        error: 'Unexpected file field.',
      });
    }
    return res.status(400).json({
      success: false,
      error: `Upload error: ${err.message}`,
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
  next();
};
