/**
 * MIME Type Mapper - Converts file extensions to proper MIME types
 * Handles cases where multer defaults to application/octet-stream
 */

export const MIME_TYPES_MAP = {
  // Notebooks & Scientific
  'ipynb': 'application/x-ipynb+json',
  'jupyter': 'application/x-ipynb+json',
  
  // Documents
  'pdf': 'application/pdf',
  'doc': 'application/msword',
  'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'xls': 'application/vnd.ms-excel',
  'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'ppt': 'application/vnd.ms-powerpoint',
  'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'txt': 'text/plain',
  'csv': 'text/csv',
  'md': 'text/markdown',
  
  // Archives
  'zip': 'application/zip',
  'rar': 'application/x-rar-compressed',
  '7z': 'application/x-7z-compressed',
  'tar': 'application/x-tar',
  'gz': 'application/gzip',
  'bz2': 'application/x-bzip2',
  
  // Images
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'png': 'image/png',
  'gif': 'image/gif',
  'webp': 'image/webp',
  'svg': 'image/svg+xml',
  'bmp': 'image/bmp',
  'tiff': 'image/tiff',
  
  // Videos
  'mp4': 'video/mp4',
  'mpeg': 'video/mpeg',
  'webm': 'video/webm',
  'mov': 'video/quicktime',
  'avi': 'video/x-msvideo',
  'mkv': 'video/x-matroska',
  'flv': 'video/x-flv',
  
  // Audio
  'mp3': 'audio/mpeg',
  'wav': 'audio/wav',
  'ogg': 'audio/ogg',
  'aac': 'audio/aac',
  'flac': 'audio/flac',
  
  // Code
  'json': 'application/json',
  'xml': 'application/xml',
  'html': 'text/html',
  'css': 'text/css',
  'js': 'application/javascript',
  'ts': 'application/typescript',
  'py': 'text/x-python',
  'java': 'text/x-java-source',
  'cpp': 'text/x-c++src',
  'c': 'text/x-csrc',
  'sql': 'application/sql',
  
  // Data
  'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'xls': 'application/vnd.ms-excel',
  'ods': 'application/vnd.oasis.opendocument.spreadsheet',
  
  // Other
  'rtf': 'application/rtf',
  'tex': 'application/x-latex',
};

/**
 * Get proper MIME type from filename
 * @param {string} filename - The filename (e.g., 'document.ipynb')
 * @param {string} currentMimeType - The current MIME type (fallback if extension not found)
 * @returns {string} The proper MIME type
 */
export function getMimeTypeFromFilename(filename, currentMimeType = 'application/octet-stream') {
  if (!filename) return currentMimeType;

  // Extract extension from filename
  const ext = filename.split('.').pop()?.toLowerCase();
  
  if (!ext) return currentMimeType;

  // Look up in map
  const mimeType = MIME_TYPES_MAP[ext];
  
  if (mimeType) {
    return mimeType;
  }

  // If current MIME type is application/octet-stream, try to infer from extension
  if (currentMimeType === 'application/octet-stream') {
    // Check some common patterns
    if (/^\.?(xlsx?|ods|csv)$/i.test(`.${ext}`)) return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (/^\.?(docx?|txt|rtf)$/i.test(`.${ext}`)) return 'text/plain';
    if (/^\.?(pptx?|odp)$/i.test(`.${ext}`)) return 'application/vnd.ms-powerpoint';
    if (/^\.?(zip|rar|7z|tar|gz)$/i.test(`.${ext}`)) return 'application/zip';
  }

  return currentMimeType;
}

/**
 * Normalize MIME types that Supabase might reject
 * @param {string} mimeType - The MIME type to normalize
 * @returns {string} A Supabase-compatible MIME type
 */
export function normalizeMimeType(mimeType) {
  if (!mimeType || mimeType === 'application/octet-stream') {
    return 'application/octet-stream';
  }

  // For Jupyter notebooks
  if (mimeType.includes('ipynb') || mimeType.includes('jupyter')) {
    return 'application/x-ipynb+json';
  }

  return mimeType;
}

/**
 * Process file MIME type before Supabase upload
 * @param {Object} file - Multer file object
 * @returns {string} Proper MIME type to use
 */
export function processFileMimeType(file) {
  if (!file) return 'application/octet-stream';

  const filename = file.originalname || file.name;
  let mimeType = file.mimetype || file.type || 'application/octet-stream';

  // Step 1: Try to infer from filename if MIME type is generic
  if (mimeType === 'application/octet-stream' || !mimeType) {
    mimeType = getMimeTypeFromFilename(filename, mimeType);
  }

  // Step 2: Normalize for Supabase compatibility
  mimeType = normalizeMimeType(mimeType);

  return mimeType;
}

export default {
  MIME_TYPES_MAP,
  getMimeTypeFromFilename,
  normalizeMimeType,
  processFileMimeType,
};
