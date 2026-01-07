import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';

const createDesignationSchema = z.object({
    title: z.string().min(2),
    code: z.string().min(2),
    departmentId: z.string().uuid(),
});

const updateDesignationSchema = createDesignationSchema.partial();

export const createDesignation = async (req: Request, res: Response) => {
    try {
        const data = createDesignationSchema.parse(req.body);

        const department = await prisma.department.findUnique({ where: { id: data.departmentId } });
        if (!department) return res.status(404).json({ message: "Department not found" });

        const existing = await prisma.designation.findUnique({ where: { code: data.code } });
        if (existing) return res.status(400).json({ message: "Designation code already exists" });

        const designation = await prisma.designation.create({ data });
        res.status(201).json(designation);
    } catch (error: any) {
        if (error instanceof z.ZodError) return res.status(400).json({ errors: error.issues });
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllDesignations = async (req: Request, res: Response) => {
    try {
        const designations = await prisma.designation.findMany({
            include: { department: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(designations);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getDesignationById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const designation = await prisma.designation.findUnique({
            where: { id },
            include: { department: true }
        });
        if (!designation) return res.status(404).json({ message: "Designation not found" });
        res.json(designation);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateDesignation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = updateDesignationSchema.parse(req.body);

        const designation = await prisma.designation.update({
            where: { id },
            data
        });
        res.json(designation);
    } catch (error: any) {
        if (error instanceof z.ZodError) return res.status(400).json({ errors: error.issues });
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteDesignation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.designation.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
