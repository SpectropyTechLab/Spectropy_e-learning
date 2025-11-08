import { Router } from 'express';
import {
  getStudentCourses,
  getCourseContent
} from '../controllers/course.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { getStudentContentById } from "../controllers/student.controller.js";

const router = Router();

router.get('/courses', authenticateToken, getStudentCourses);
router.get('/courses/:id/content', authenticateToken, getCourseContent);
router.get("/content/:id", getStudentContentById);
export default router;