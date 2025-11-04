import { Router } from "express";
import { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse } from "../controllers/course.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

// Only authenticated admins should manage courses
router.post("/", verifyToken, createCourse);
router.get("/", verifyToken, getAllCourses);
router.get("/:id", verifyToken, getCourseById);
router.put("/:id", verifyToken, updateCourse);
router.delete("/:id", verifyToken, deleteCourse);

export default router;
