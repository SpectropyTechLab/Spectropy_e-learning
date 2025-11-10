// routes/course.router.js
import { Router } from 'express';
import { getAllCourses } from '../controllers/admin.controller.js';

const router = Router();

// Public access — no authentication
router.get('/courses', getAllCourses);

export default router;