import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';

const createLeaveTypeSchema = z.object({
    name: z.string().min(2),
    code: z.string().min(2),
    daysAllowed: z.number().int().min(0)
});

const applyLeaveSchema = z.object({
    employeeId: z.string().uuid(),
    leaveTypeId: z.string().uuid(),
    fromDate: z.string().transform(str => new Date(str)),
    toDate: z.string().transform(str => new Date(str)),
    reason: z.string().optional()
});

export const createLeaveType = async (req: Request, res: Response) => {
    try {
        const data = createLeaveTypeSchema.parse(req.body);
        const existing = await prisma.leaveType.findUnique({ where: { code: data.code } });
        if (existing) return res.status(400).json({ message: "Leave type code already exists" });

        const leaveType = await prisma.leaveType.create({ data });
        res.status(201).json(leaveType);
    } catch (error: any) {
        if (error instanceof z.ZodError) return res.status(400).json({ errors: error.errors });
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getLeaveTypes = async (req: Request, res: Response) => {
    try {
        const types = await prisma.leaveType.findMany();
        res.json(types);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const applyLeave = async (req: Request, res: Response) => {
    try {
        const data = applyLeaveSchema.parse(req.body);
        // Basic validation: Check end date >= start date
        if (data.toDate < data.fromDate) {
            return res.status(400).json({ message: "To Date must be equal or after From Date" });
        }

        const leaveRequest = await prisma.leaveRequest.create({ data });
        res.status(201).json(leaveRequest);
    } catch (error: any) {
        if (error instanceof z.ZodError) return res.status(400).json({ errors: error.errors });
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getLeaveRequests = async (req: Request, res: Response) => {
    try {
        const { status, employeeId } = req.query;
        const where: any = {};
        if (status) where.status = String(status);
        if (employeeId) where.employeeId = String(employeeId);

        const requests = await prisma.leaveRequest.findMany({
            where,
            include: { employee: true, leaveType: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateLeaveStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['APPROVED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const request = await prisma.leaveRequest.update({
            where: { id },
            data: { status }
        });
        res.json(request);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
