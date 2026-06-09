import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import xlsx from 'xlsx';
import prisma from '../lib/prisma.js';
import fs from 'fs';

const { readFile, utils } = xlsx;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });

export const uploadSheet = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const workbook = readFile(filePath);
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Parse the first few rows to get headers and row count
    const data = utils.sheet_to_json(worksheet);
    const rowCount = data.length;
    const columnHeaders = data.length > 0 ? Object.keys(data[0] as object) : [];

    const sheet = await prisma.sheet.create({
      data: {
        userId,
        originalName: req.file.originalname,
        filePath,
        rowCount,
        columnHeaders: JSON.stringify(columnHeaders),
      },
    });

    res.status(201).json({ 
      sheet: {
        id: sheet.id,
        name: sheet.originalName,
        rowCount: sheet.rowCount,
        columns: columnHeaders
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'File processing failed' });
  }
};

export const getSheets = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const sheets = await prisma.sheet.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        originalName: true,
        rowCount: true,
        columnHeaders: true,
        createdAt: true,
      }
    });

    res.json({ sheets: sheets.map(s => ({
      ...s,
      columnHeaders: s.columnHeaders ? JSON.parse(s.columnHeaders) : []
    })) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getSheetData = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const sheet = await prisma.sheet.findFirst({
      where: { id, userId }
    });

    if (!sheet) {
      return res.status(404).json({ error: 'Sheet not found' });
    }

    const workbook = readFile(sheet.filePath);
    const firstSheetName = workbook.SheetNames[0];
    const data = utils.sheet_to_json(workbook.Sheets[firstSheetName]);

    res.json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
