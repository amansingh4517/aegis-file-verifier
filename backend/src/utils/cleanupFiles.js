import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Clean up old files in the uploads directory
 * This should be run periodically to ensure no orphaned files remain
 */
export const cleanupOldFiles = () => {
  const uploadsDir = path.join(__dirname, '../../uploads');
  
  if (!fs.existsSync(uploadsDir)) {
    console.log('Uploads directory does not exist');
    return;
  }

  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      console.error('Error reading uploads directory:', err);
      return;
    }

    const now = Date.now();
    const maxAge = 60 * 60 * 1000; // 1 hour in milliseconds

    files.forEach((file) => {
      const filePath = path.join(uploadsDir, file);
      
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error getting stats for ${file}:`, err);
          return;
        }

        const age = now - stats.mtimeMs;
        
        // Delete files older than 1 hour (should already be deleted, but this is a safety cleanup)
        if (age > maxAge) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Error deleting old file ${file}:`, err);
            } else {
              console.log(`Deleted old file: ${file}`);
            }
          });
        }
      });
    });
  });
};

// Run cleanup every hour
export const startCleanupScheduler = () => {
  console.log('Starting file cleanup scheduler...');
  
  // Run immediately on start
  cleanupOldFiles();
  
  // Then run every hour
  setInterval(() => {
    console.log('Running scheduled file cleanup...');
    cleanupOldFiles();
  }, 60 * 60 * 1000); // 1 hour
};
