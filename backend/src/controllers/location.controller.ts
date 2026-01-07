import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';

const createLocationSchema = z.object({
    name: z.string().min(2),
    code: z.string().min(2),
    branchId: z.string().uuid(),
});

const updateLocationSchema = createLocationSchema.partial();

export const createLocation = async (req: Request, res: Response) => {
    try {
        const data = createLocationSchema.parse(req.body);

        const branch = await prisma.branch.findUnique({ where: { id: data.branchId } });
        if (!branch) return res.status(404).json({ message: "Branch not found" });

        const existing = await prisma.location.findUnique({ where: { code: data.code } });
        if (existing) return res.status(400).json({ message: "Location code already exists" });

        const location = await prisma.location.create({ data });
        res.status(201).json(location);
    } catch (error: any) {
        if (error instanceof z.ZodError) return res.status(400).json({ errors: error.errors });
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllLocations = async (req: Request, res: Response) => {
    try {
        const locations = await prisma.location.findMany({
            include: { branch: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(locations);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getLocationById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const location = await prisma.location.findUnique({
            where: { id },
            include: { branch: true }
        });
        if (!location) return res.status(404).json({ message: "Location not found" });
        res.json(location);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateLocation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = updateLocationSchema.parse(req.body);

        const location = await prisma.location.update({
            where: { id },
            data
        });
        res.json(location);
    } catch (error: any) {
        if (error instanceof z.ZodError) return res.status(400).json({ errors: error.errors });
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteLocation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.location.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
