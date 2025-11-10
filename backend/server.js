// backend/server.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import superadminRoutes from './routes/superadmin.routes.js';
import adminRoutes from './routes/admin.routes.js';
import authRoutes from './routes/auth.routes.js';
import teacherRoutes from './routes/teacher.routes.js';
import studentRoutes from './routes/student.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import scormRoutes from './routes/scorm.routes.js';
import { viewScormFile } from './controllers/scorm.controller.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(helmet());
app.use(cors());
app.use(express.json());

app.get(
  "/api/scorm/*",
  helmet({ frameguard: false }),             // <- disables X-Frame-Options here
  (req, res, next) => {                      // <- extra hardening: kill any pre-set header
    res.removeHeader("X-Frame-Options");
    next();
  },

  viewScormFile
);



// ------------------------------
// ⬇️ STATIC FILE SERVING FOR UPLOADS
// ------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/uploads/scorm', scormRoutes); // Serve SCORM uploads
app.use('/api/superadmin', superadminRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// ✅ Error handling — catches unhandled promise errors to prevent crashes
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

app.listen(PORT, () => {

  console.log(`Server running on http://localhost:${PORT}`);
});