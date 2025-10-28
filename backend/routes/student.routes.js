// backend/routes/student.routes.js
import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { getStudentCourses, getCourseContent } from '../controllers/course.controller.js';
import { saveScormAttempt } from '../controllers/scorm.controller.js';

const router = Router();

router.use(verifyToken);
router.use(requireRole('student'));

router.get('/courses', getStudentCourses);
router.get('/courses/:courseId/content', getCourseContent);
router.post('/scorm/:contentItemId/save', saveScormAttempt);

export default router;