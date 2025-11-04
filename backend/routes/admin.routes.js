import { Router } from 'express';
import { 
  getCourseStudents,
  getAllStudents,
  enrollStudentInCourse,
  unenrollStudentFromCourse,
  getAllCourses
} from '../controllers/admin.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/courses/:id/students', authenticateToken, getCourseStudents);
router.get('/students', authenticateToken, getAllStudents);
router.post('/courses/:id/enroll-student', authenticateToken, enrollStudentInCourse);
router.delete('/courses/:id/unenroll-student/:studentId', authenticateToken, unenrollStudentFromCourse);
router.get('/courses', authenticateToken, getAllCourses);

export default router;