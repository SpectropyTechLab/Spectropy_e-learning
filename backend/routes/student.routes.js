import { Router } from 'express';
import {getStudentEnrolledCourses, getStudentCourse} from '../controllers/enrollment.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { getStudentContentById } from "../controllers/student.controller.js";

const router = Router();

router.get('/content/:id', authenticateToken, getStudentContentById);
router.get('/enrolled-courses', authenticateToken, getStudentEnrolledCourses);
router.get('/course/:courseId', authenticateToken, getStudentCourse);

export default router;