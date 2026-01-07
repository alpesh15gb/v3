import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';

const createDepartmentSchema = z.object({
    name: z.string().min(2),
    code: z.string().min(2),
    branchId: z.string().uuid(),
});

const updateDepartmentSchema = createDepartmentSchema.partial();

export const createDepartment = async (req: Request, res: Response) => {
    try {
        const data = createDepartmentSchema.parse(req.body);

        const branch = await prisma.branch.findUnique({ where: { id: data.branchId } });
        if (!branch) return res.status(404).json({ message: "Branch not found" });

        const existing = await prisma.department.findUnique({ where: { code: data.code } });
        if (existing) return res.status(400).json({ message: "Department code already exists" });

        const department = await prisma.department.create({ data });
        res.status(201).json(department);
    } catch (error: any) {
        if (error instanceof z.ZodError) return res.status(400).json({ errors: error.errors });
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllDepartments = async (req: Request, res: Response) => {
    try {
        const departments = await prisma.department.findMany({
            include: { branch: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getDepartmentById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const department = await prisma.department.findUnique({
            where: { id },
            include: { branch: true }
        });
        if (!department) return res.status(404).json({ message: "Department not found" });
        res.json(department);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateDepartment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = updateDepartmentSchema.parse(req.body);

        const department = await prisma.department.update({
            where: { id },
            data
        });
        res.json(department);
    } catch (error: any) {
        if (error instanceof z.ZodError) return res.status(400).json({ errors: error.errors });
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteDepartment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.department.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
