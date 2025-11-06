import { Router } from 'express';
import {  createCourse, getAllCourses, getCourseContent, createContentItem } from '../controllers/admin.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/courses', authenticateToken, getAllCourses);
router.post('/courses', authenticateToken, createCourse);
router.get('/courses/:courseId/content', authenticateToken, getCourseContent);
router.post('/courses/:courseId/content', authenticateToken, createContentItem);

export default router;