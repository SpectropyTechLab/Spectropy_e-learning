import { Router } from 'express';
import { createCourse, getAllCourses, getCourseContent, createContentItem } from '../controllers/admin.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload, uploadContentFile, viewScormFile } from '../controllers/scorm.controller.js';
import helmet from "helmet";



const router = Router();
router.use(
    "/view/*",
    helmet({
        frameguard: false
    })

);
router.get('/courses', authenticateToken, getAllCourses);
router.post('/courses', authenticateToken, createCourse);
router.get('/courses/:courseId/content', authenticateToken, getCourseContent);
router.post('/courses/:courseId/content', authenticateToken, createContentItem);
router.post('/courses/:courseId/content/upload', upload.single('file'), authenticateToken, uploadContentFile);
router.get("/view/*", viewScormFile); // 


export default router;