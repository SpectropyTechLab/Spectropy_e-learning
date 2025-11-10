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

export default router;
