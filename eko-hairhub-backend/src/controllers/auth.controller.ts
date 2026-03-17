import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient, UserRole } from '@prisma/client';
import { config } from '../config';

const prisma = new PrismaClient();

function generateToken(userId: string, email: string, role: string): string {
  return jwt.sign(
    { userId, email, role },
    config.jwtSecret as string,
    { expiresIn: '7d' }
  );
}

// POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password, fullName, phone, role = 'CUSTOMER' } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ success: false, error: 'Email, password, and full name are required.' });
    }

    if (!['CUSTOMER', 'STYLIST'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role. Must be CUSTOMER or STYLIST.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'An account with this email already exists.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, error: 'Password must be at least 8 characters.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        fullName,
        phone,
        role: role as UserRole,
      },
      select: { id: true, email: true, fullName: true, phone: true, role: true, avatar: true, createdAt: true },
    });

    if (role === 'STYLIST') {
      await prisma.stylistProfile.create({
        data: {
          userId: user.id,
          bio: '',
          specialties: [],
          location: '',
          area: '',
        },
      });
    }

    const token = generateToken(user.id, user.email, user.role);

    return res.status(201).json({
      success: true,
      data: { user, token },
      message: 'Account created successfully!',
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, error: 'Failed to create account. Please try again.' });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { stylistProfile: { select: { id: true, status: true, rating: true } } },
    });

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, error: 'Your account has been suspended. Please contact support.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const token = generateToken(user.id, user.email, user.role);
    const { password: _, ...userWithoutPassword } = user;

    return res.json({
      success: true,
      data: { user: userWithoutPassword, token },
      message: 'Signed in successfully!',
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, error: 'Login failed. Please try again.' });
  }
};

// GET /api/auth/me
export const getMe = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true, email: true, fullName: true, phone: true, avatar: true, role: true, createdAt: true,
        stylistProfile: {
          select: {
            id: true, bio: true, specialties: true, location: true, area: true,
            status: true, rating: true, reviewCount: true, offersHomeService: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    return res.json({ success: true, data: user });
  } catch (error) {
    console.error('Get me error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch user data.' });
  }
};

// POST /api/auth/change-password
export const changePassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return res.status(400).json({ success: false, error: 'Current password is incorrect.' });

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, error: 'New password must be at least 8 characters.' });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: req.user!.userId }, data: { password: hashed } });

    return res.json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to change password.' });
  }
};
