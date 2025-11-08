import express from 'express';
import {
  signup,
  login,
  getMe,
  updateProfile,
  changePassword,
  signupValidation,
  loginValidation,
  validate,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/signup', signupValidation, validate, signup);
router.post('/login', loginValidation, validate, login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/change-password', protect, changePassword);

export default router;
