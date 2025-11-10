import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getStudentContentById } from "../controllers/student.controller.js";

const router = Router();

router.get("/content/:id", getStudentContentById);
export default router;