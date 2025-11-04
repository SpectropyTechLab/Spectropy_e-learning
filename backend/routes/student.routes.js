import { Router } from 'express';
import { 
  getStudentCourses, 
  getCourseContent 
} from '../controllers/course.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/courses', authenticateToken, getStudentCourses);
router.get('/courses/:id/content', authenticateToken, getCourseContent);

export default router;