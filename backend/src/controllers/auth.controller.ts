import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-prod';

const loginSchema = z.object({
    employeeCode: z.string(),
    password: z.string()
});

export const login = async (req: Request, res: Response) => {
    try {
        const { employeeCode, password } = loginSchema.parse(req.body);

        const employee = await prisma.employee.findUnique({
            where: { employeeCode }
        });

        if (!employee) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Temporary: If no password set (migration), allow login with generic pass or specific logic
        // For Production: Fail if no password. 
        // For Dev: If password is null, allow login if password input is 'password' (Just for initial setup)
        if (!employee.password) {
            if (password !== 'password') return res.status(400).json({ message: 'Invalid credentials (setup)' });

            // Auto-set password on first login? Or just warn.
        } else {
            const isMatch = await bcrypt.compare(password, employee.password);
            if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: employee.id, role: employee.role, name: employee.firstName },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token, user: { id: employee.id, role: employee.role, name: employee.firstName } });
    } catch (error: any) {
        if (error instanceof z.ZodError) return res.status(400).json({ errors: error.issues });
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getMe = async (req: any, res: Response) => {
    try {
        const employee = await prisma.employee.findUnique({
            where: { id: req.user.id },
            select: { id: true, firstName: true, lastName: true, role: true, employeeCode: true }
        });
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}
