import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const uploadsPath = path.join(__dirname, '../../', uploadDir);

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

// File filter - allowed file types
const fileFilter = (req, file, cb) => {
  // Allowed file types for verification
  const allowedTypes = [
    // Images
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    // Videos
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo',
    'video/webm',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    // Text
    'text/plain',
    'text/csv',
    // Audio
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `File type not supported. Allowed types: images, videos, documents, audio files. Got: ${file.mimetype}`
      ),
      false
    );
  }
};

// Create multer upload instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
  },
});

/**
 * Delete file from uploads directory
 */
export const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

/**
 * Get file info
 */
export const getFileInfo = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      return {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting file info:', error);
    return null;
  }
};

export { upload, uploadsPath };
