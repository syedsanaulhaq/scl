import express from 'express';
import * as courseController from '../controllers/CourseController.js';
<<<<<<< HEAD
import authMiddleware from '../middleware/auth.js';
=======
import { authenticate } from '../middleware/auth.js';
>>>>>>> main

const router = express.Router();

// Apply authentication middleware to all routes
<<<<<<< HEAD
router.use(authMiddleware);
=======
router.use(authenticate);
>>>>>>> main

// Course CRUD operations
router.get('/', courseController.getAllCourses);
router.post('/', courseController.createCourse);
router.get('/upcoming', courseController.getUpcomingCourses);
router.get('/active', courseController.getActiveCourses);
router.get('/:id', courseController.getCourse);
router.patch('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

export default router;
