// backend/routes/scorm.routes.js
import express from "express";
import { saveScormProgress, getScormProgress } from "../controllers/scorm.controller.js";
import { getStudentContentById } from '../controllers/student.controller.js';


import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post("/commit", saveScormProgress);
// backend/routes/scorm.routes.js
router.get("/progress/:userId/:contentId", getScormProgress);

router.get('/content/:id', authenticateToken, getStudentContentById);
// Example: /api/scorm/serve/course-files/8/1762597630232/res/index.html

export default router;
