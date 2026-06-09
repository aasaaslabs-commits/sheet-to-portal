import { Router } from 'express';
import { uploadSheet, getSheets, getSheetData, upload } from '../controllers/sheets.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/upload', authMiddleware, upload.single('file'), uploadSheet);
router.get('/', authMiddleware, getSheets);
router.get('/:id/data', authMiddleware, getSheetData);

export default router;
