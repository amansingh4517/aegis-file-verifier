import express from 'express';
import { upload } from '../config/multer.js';
import { protect } from '../middleware/auth.js';
import {
  uploadAndVerify,
  getVerificationHistory,
  getVerification,
  deleteVerification,
  getStats,
  getDetailedReport,
} from '../controllers/verificationController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// File upload and verification
router.post('/upload', upload.single('file'), uploadAndVerify);

// Verification history and management
router.get('/history', getVerificationHistory);
router.get('/stats', getStats);
router.get('/:id', getVerification);
router.delete('/:id', deleteVerification);
router.get('/:id/report', getDetailedReport);

export default router;
