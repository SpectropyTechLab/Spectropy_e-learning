import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { enrollUserByEmail, getCourseEnrollments } from "../controllers/enrollment.controller.js";

const router = Router();

router.post('/courses/:courseId/enroll-by-email',  authenticateToken,enrollUserByEmail);
router.get('/courses/:courseId/enrollments', authenticateToken,getCourseEnrollments);

export default router;