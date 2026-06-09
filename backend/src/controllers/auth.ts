import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        jobTitle: user.jobTitle,
        company: user.company,
        bio: user.bio
      }, 
      token 
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        jobTitle: user.jobTitle,
        company: user.company,
        bio: user.bio
      }, 
      token 
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Login failed' });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        jobTitle: user.jobTitle,
        company: user.company,
        bio: user.bio
      } 
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to fetch user' });
  }
};

const updateProfileSchema = z.object({
  name: z.string().optional(),
  password: z.string().min(6).optional(),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  bio: z.string().optional(),
});

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name, password, jobTitle, company, bio } = updateProfileSchema.parse(req.body);

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (jobTitle !== undefined) updateData.jobTitle = jobTitle;
    if (company !== undefined) updateData.company = company;
    if (bio !== undefined) updateData.bio = bio;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    res.json({ 
      user: { 
        id: updatedUser.id, 
        email: updatedUser.email, 
        name: updatedUser.name,
        jobTitle: updatedUser.jobTitle,
        company: updatedUser.company,
        bio: updatedUser.bio
      },
      message: 'Profile updated successfully'
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Update failed' });
  }
};
