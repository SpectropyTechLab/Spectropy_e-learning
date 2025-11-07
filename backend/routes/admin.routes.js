import { Router } from 'express';
import {  createCourse, getAllCourses, getCourseContent, createContentItem } from '../controllers/admin.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload, uploadContentFile } from '../controllers/scorm.controller.js';

const router = Router();

router.get('/courses', authenticateToken, getAllCourses);
router.post('/courses', authenticateToken, createCourse);
router.get('/courses/:courseId/content', authenticateToken, getCourseContent);
router.post('/courses/:courseId/content', authenticateToken, createContentItem);
router.post('/courses/:courseId/content/upload', upload.single('file'), authenticateToken, uploadContentFile);

export default router;