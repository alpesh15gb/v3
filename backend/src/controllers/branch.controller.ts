import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';

const createBranchSchema = z.object({
    name: z.string().min(2),
    code: z.string().min(2),
    companyId: z.string().uuid(),
});

const updateBranchSchema = createBranchSchema.partial();

export const createBranch = async (req: Request, res: Response) => {
    try {
        const data = createBranchSchema.parse(req.body);

        // Check if company exists
        const company = await prisma.company.findUnique({ where: { id: data.companyId } });
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        const existing = await prisma.branch.findUnique({ where: { code: data.code } });
        if (existing) {
            return res.status(400).json({ message: "Branch code already exists" });
        }

        const branch = await prisma.branch.create({ data });
        res.status(201).json(branch);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllBranches = async (req: Request, res: Response) => {
    try {
        const branches = await prisma.branch.findMany({
            include: { company: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(branches);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getBranchById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const branch = await prisma.branch.findUnique({
            where: { id },
            include: { company: true }
        });
        if (!branch) return res.status(404).json({ message: "Branch not found" });
        res.json(branch);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateBranch = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = updateBranchSchema.parse(req.body);

        const branch = await prisma.branch.update({
            where: { id },
            data
        });
        res.json(branch);
    } catch (error: any) {
        if (error instanceof z.ZodError) return res.status(400).json({ errors: error.errors });
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteBranch = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.branch.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
