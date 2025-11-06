import { Router } from 'express';
import { getTeacherCourses, createCourse } from '../controllers/course.controller.js';
import {getTeacherCourseContent,addCourseContentItem} from '../controllers/teacherContentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/courses', authenticateToken, getTeacherCourses);
router.post('/courses', authenticateToken, createCourse);
router.get('/courses/:id/content', authenticateToken, getTeacherCourseContent);
router.post('/courses/:id/content', authenticateToken, addCourseContentItem);

export default router;