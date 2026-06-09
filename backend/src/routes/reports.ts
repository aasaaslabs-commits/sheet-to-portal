import { Router } from 'express';
import { generateReport, getReports, getReport, getPublicReport } from '../controllers/reports.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/generate', authMiddleware, generateReport);
router.get('/', authMiddleware, getReports);
router.get('/:id', authMiddleware, getReport);
router.get('/shared/:shareToken', getPublicReport); // Publicly accessible

export default router;
