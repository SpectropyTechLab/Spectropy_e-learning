import { Router } from 'express';
import {getTeacherCourseContent,addCourseContentItem,updateCoursePublishStatus} from '../controllers/teacherContentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/courses/:id/content', authenticateToken, getTeacherCourseContent);
router.post('/courses/:id/content', authenticateToken, addCourseContentItem);
router.patch('/courses/:id/publish', authenticateToken,updateCoursePublishStatus);

export default router;