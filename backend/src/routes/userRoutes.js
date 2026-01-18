import express from 'express';
import userController from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateUserCreation, validateUserUpdate } from '../middleware/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Admin only routes
router.get('/', authorize('admin'), userController.getAllUsers);
router.post('/', authorize('admin'), validateUserCreation, userController.createUser);
router.get('/:id', authorize('admin'), userController.getUserById);
router.patch('/:id', authorize('admin'), validateUserUpdate, userController.updateUser);
router.delete('/:id', authorize('admin'), userController.deleteUser);

export default router;
