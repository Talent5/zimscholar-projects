import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  logger.error('Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env file');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// Storage bucket names
export const BUCKETS = {
  PORTFOLIO: 'portfolio-projects',
  THUMBNAILS: 'thumbnails',
  ATTACHMENTS: 'attachments',
};

/**
 * Upload a file to Supabase Storage
 * @param {Buffer|File} file - The file to upload
 * @param {string} bucket - The bucket name
 * @param {string} filePath - The file path within the bucket (e.g., 'projects/file-name.pdf')
 * @param {Object} options - Additional options
 * @returns {Promise<{success: boolean, data?: {path: string, publicUrl: string}, error?: any}>}
 */
export async function uploadFile(file, bucket, filePath, options = {}) {
  try {
    const { contentType, upsert = false } = options;
    
    // Ensure file is in the correct format
    const fileData = file.buffer || file;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileData, {
        contentType: contentType || 'application/octet-stream',
        upsert,
        cacheControl: '3600',
      });

    if (error) {
      logger.error('Supabase upload error:', { error: error.message, bucket, filePath });
      return { success: false, error };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    logger.info('File uploaded successfully', { bucket, filePath });

    return {
      success: true,
      data: {
        path: data.path,
        publicUrl: urlData.publicUrl,
      },
    };
  } catch (error) {
    logger.error('Upload file error:', { error: error.message });
    return { success: false, error };
  }
}

/**
 * Upload multiple files to Supabase Storage
 * @param {Array} files - Array of files to upload
 * @param {string} bucket - The bucket name
 * @param {string} folderPath - The folder path within the bucket
 * @returns {Promise<Array>}
 */
export async function uploadMultipleFiles(files, bucket, folderPath = '') {
  const uploadPromises = files.map(async (file, index) => {
    const uniqueName = `${Date.now()}-${index}-${file.originalname || file.name}`;
    const filePath = folderPath ? `${folderPath}/${uniqueName}` : uniqueName;
    
    const result = await uploadFile(
      file,
      bucket,
      filePath,
      { contentType: file.mimetype || file.type }
    );

    return {
      ...result,
      originalName: file.originalname || file.name,
      size: file.size,
      mimetype: file.mimetype || file.type,
    };
  });

  return await Promise.all(uploadPromises);
}

/**
 * Delete a file from Supabase Storage
 * @param {string} bucket - The bucket name
 * @param {string} filePath - The file path within the bucket
 * @returns {Promise<{success: boolean, error?: any}>}
 */
export async function deleteFile(bucket, filePath) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      logger.error('Supabase delete error:', { error: error.message, bucket, filePath });
      return { success: false, error };
    }

    logger.info('File deleted successfully', { bucket, filePath });
    return { success: true, data };
  } catch (error) {
    logger.error('Delete file error:', { error: error.message });
    return { success: false, error };
  }
}

/**
 * Delete multiple files from Supabase Storage
 * @param {string} bucket - The bucket name
 * @param {Array<string>} filePaths - Array of file paths to delete
 * @returns {Promise<{success: boolean, error?: any}>}
 */
export async function deleteMultipleFiles(bucket, filePaths) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove(filePaths);

    if (error) {
      logger.error('Supabase delete multiple error:', { error: error.message, bucket, count: filePaths.length });
      return { success: false, error };
    }

    logger.info('Files deleted successfully', { bucket, count: filePaths.length });
    return { success: true, data };
  } catch (error) {
    logger.error('Delete multiple files error:', { error: error.message });
    return { success: false, error };
  }
}

/**
 * Get public URL for a file
 * @param {string} bucket - The bucket name
 * @param {string} filePath - The file path within the bucket
 * @returns {string}
 */
export function getPublicUrl(bucket, filePath) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);
  
  return data.publicUrl;
}

/**
 * List files in a bucket folder
 * @param {string} bucket - The bucket name
 * @param {string} folderPath - The folder path (optional)
 * @returns {Promise<{success: boolean, data?: Array, error?: any}>}
 */
export async function listFiles(bucket, folderPath = '') {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folderPath, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) {
      logger.error('Supabase list files error:', { error: error.message, bucket, folderPath });
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    logger.error('List files error:', { error: error.message });
    return { success: false, error };
  }
}

/**
 * Extract file path from Supabase public URL
 * @param {string} publicUrl - The public URL
 * @returns {string|null}
 */
export function extractFilePathFromUrl(publicUrl) {
  try {
    const url = new URL(publicUrl);
    const pathParts = url.pathname.split('/');
    // Remove '/storage/v1/object/public/' and bucket name
    return pathParts.slice(5).join('/');
  } catch (error) {
    logger.error('Failed to extract file path from URL:', { error: error.message, publicUrl });
    return null;
  }
}

/**
 * Create storage buckets if they don't exist
 */
export async function initializeBuckets() {
  try {
    const buckets = Object.values(BUCKETS);
    
    for (const bucketName of buckets) {
      const { data: existingBuckets } = await supabase.storage.listBuckets();
      const bucketExists = existingBuckets?.some(b => b.name === bucketName);
      
      if (!bucketExists) {
        const { error } = await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 52428800, // 50MB
          allowedMimeTypes: [
            'image/*',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/zip',
            'text/*',
          ],
        });
        
        if (error && error.message !== 'The resource already exists') {
          logger.error(`Failed to create bucket ${bucketName}:`, error);
        } else {
          logger.info(`Bucket created: ${bucketName}`);
        }
      }
    }
  } catch (error) {
    logger.error('Failed to initialize buckets:', error);
  }
}

export default supabase;
