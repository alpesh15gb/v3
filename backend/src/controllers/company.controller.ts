import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';

// Validation Schemas
const createCompanySchema = z.object({
    name: z.string().min(2, "Company name must be at least 2 characters"),
    code: z.string().min(2, "Code must be at least 2 characters").max(10),
    address: z.string().optional(),
});

const updateCompanySchema = createCompanySchema.partial();

export const createCompany = async (req: Request, res: Response) => {
    try {
        const data = createCompanySchema.parse(req.body);

        // Check for unique code
        const existing = await prisma.company.findUnique({ where: { code: data.code } });
        if (existing) {
            return res.status(400).json({ message: "Company code already exists" });
        }

        const company = await prisma.company.create({ data });
        res.status(201).json(company);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllCompanies = async (req: Request, res: Response) => {
    try {
        const companies = await prisma.company.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getCompanyById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const company = await prisma.company.findUnique({ where: { id } });

        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        res.json(company);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateCompany = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = updateCompanySchema.parse(req.body);

        const existing = await prisma.company.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ message: "Company not found" });
        }

        if (data.code && data.code !== existing.code) {
            const codeExists = await prisma.company.findUnique({ where: { code: data.code } });
            if (codeExists) {
                return res.status(400).json({ message: "Company code already exists" });
            }
        }

        const company = await prisma.company.update({
            where: { id },
            data
        });
        res.json(company);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteCompany = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.company.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
