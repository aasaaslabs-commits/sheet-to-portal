import { Request, Response } from 'express';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '../lib/prisma.js';
import xlsx from 'xlsx';
import crypto from 'crypto';

const { readFile, utils } = xlsx;

const AI_PROVIDER = process.env.AI_PROVIDER || 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

export const generateReport = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { sheetId, title, description } = req.body;

    const sheet = await prisma.sheet.findFirst({
      where: { id: sheetId, userId }
    });

    if (!sheet) {
      return res.status(404).json({ error: 'Sheet not found' });
    }

    // Read sample data to help AI understand the content
    const workbook = readFile(sheet.filePath);
    const data = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    const sampleData = data.slice(0, 5); // Take first 5 rows
    const columns = JSON.parse(sheet.columnHeaders || '[]');

    const prompt = `
      You are a data analyst. Given a dataset with columns: ${columns.join(', ')}.
      Sample data: ${JSON.stringify(sampleData)}
      
      Suggest 4 visual widgets for a dashboard. 
      Each widget must have:
      - title: A descriptive title.
      - type: One of 'bar', 'line', 'pie', 'metric'.
      - config: A JSON object with keys:
        - dataKey: The column name for the value (Y-axis or metric value).
        - categoryKey: (Optional) The column name for the category (X-axis or labels).
        - color: A hex color string.
      
      Respond ONLY with a JSON object containing a "widgets" array of these 4 widget objects.
    `;

    let suggestedWidgets: any[] = [];

    if (AI_PROVIDER === 'gemini') {
      if (!genAI) throw new Error('GEMINI_API_KEY is not configured');
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });
      const result = await model.generateContent(prompt);
      const aiResponse = JSON.parse(result.response.text());
      suggestedWidgets = aiResponse.widgets || [];
    } else if (AI_PROVIDER === 'ollama') {
      const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';
      const ollamaModel = process.env.OLLAMA_MODEL || 'llama3';
      
      const response = await fetch(ollamaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: ollamaModel,
          prompt: prompt,
          stream: false,
          format: 'json'
        }),
      });

      if (!response.ok) throw new Error('Ollama generation failed');
      const result: any = await response.json();
      const aiResponse = JSON.parse(result.response);
      suggestedWidgets = aiResponse.widgets || [];
    } else {
      if (!openai) throw new Error('OPENAI_API_KEY is not configured');
      const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
        response_format: { type: 'json_object' },
      });
      const aiResponse = JSON.parse(completion.choices[0].message.content || '{"widgets": []}');
      suggestedWidgets = aiResponse.widgets || [];
    }

    const shareToken = crypto.randomBytes(16).toString('hex');

    const report = await prisma.report.create({
      data: {
        sheetId,
        title: title || `Report for ${sheet.originalName}`,
        description,
        shareToken,
        widgets: {
          create: suggestedWidgets.map((w: any) => ({
            type: w.type,
            title: w.title,
            config: JSON.stringify(w.config),
          }))
        }
      },
      include: {
        widgets: true
      }
    });

    res.status(201).json({ report });
  } catch (error: any) {
    console.error('AI Generation error:', error);
    res.status(500).json({ error: error.message || 'AI generation failed' });
  }
};

export const getReports = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const reports = await prisma.report.findMany({
      where: { sheet: { userId } },
      include: { sheet: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ reports });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const report = await prisma.report.findUnique({
      where: { id },
      include: { widgets: true, sheet: true }
    });
    if (!report) return res.status(404).json({ error: 'Report not found' });
    
    const widgets = report.widgets.map(w => ({
      ...w,
      config: JSON.parse(w.config)
    }));
    
    res.json({ ...report, widgets });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPublicReport = async (req: Request, res: Response) => {
  try {
    const { shareToken } = req.params;
    const report = await prisma.report.findUnique({
      where: { shareToken },
      include: { widgets: true, sheet: true }
    });
    if (!report) return res.status(404).json({ error: 'Report not found' });
    
    const widgets = report.widgets.map(w => ({
      ...w,
      config: JSON.parse(w.config)
    }));

    // For public reports, we also need to fetch the sheet data
    const workbook = readFile(report.sheet.filePath);
    const data = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    
    res.json({ ...report, widgets, data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
