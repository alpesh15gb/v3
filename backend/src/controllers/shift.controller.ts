import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';

const createShiftSchema = z.object({
    name: z.string().min(2),
    code: z.string().min(2),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
    breakDuration: z.number().int().min(0).default(0),
    graceTime: z.number().int().min(0).default(0),
    description: z.string().optional(),
});

const updateShiftSchema = createShiftSchema.partial();

export const createShift = async (req: Request, res: Response) => {
    try {
        const data = createShiftSchema.parse(req.body);

        const existing = await prisma.shift.findUnique({ where: { code: data.code } });
        if (existing) return res.status(400).json({ message: "Shift code already exists" });

        const shift = await prisma.shift.create({ data });
        res.status(201).json(shift);
    } catch (error: any) {
        if (error instanceof z.ZodError) return res.status(400).json({ errors: error.issues });
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllShifts = async (req: Request, res: Response) => {
    try {
        const shifts = await prisma.shift.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(shifts);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getShiftById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const shift = await prisma.shift.findUnique({ where: { id } });
        if (!shift) return res.status(404).json({ message: "Shift not found" });
        res.json(shift);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateShift = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = updateShiftSchema.parse(req.body);

        const shift = await prisma.shift.update({
            where: { id },
            data
        });
        res.json(shift);
    } catch (error: any) {
        if (error instanceof z.ZodError) return res.status(400).json({ errors: error.issues });
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteShift = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.shift.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
