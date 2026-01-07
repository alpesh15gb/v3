import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';

const createEmployeeSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().optional(),
    employeeCode: z.string().min(2),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    dateOfJoining: z.string().transform((str) => new Date(str)), // Expect YYYY-MM-DD
    companyId: z.string().uuid(),
    branchId: z.string().uuid(),
    departmentId: z.string().uuid().optional(),
    designationId: z.string().uuid().optional(),
    locationId: z.string().uuid().optional(),
});

const updateEmployeeSchema = createEmployeeSchema.partial();

export const createEmployee = async (req: Request, res: Response) => {
    try {
        const data = createEmployeeSchema.parse(req.body);

        const existing = await prisma.employee.findUnique({ where: { employeeCode: data.employeeCode } });
        if (existing) return res.status(400).json({ message: "Employee code already exists" });

        if (data.email) {
            const emailExists = await prisma.employee.findUnique({ where: { email: data.email } });
            if (emailExists) return res.status(400).json({ message: "Email already exists" });
        }

        const employee = await prisma.employee.create({ data });
        res.status(201).json(employee);
    } catch (error: any) {
        if (error instanceof z.ZodError) return res.status(400).json({ errors: error.issues });
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllEmployees = async (req: Request, res: Response) => {
    try {
        const { branchId, departmentId } = req.query;

        const where: any = {};
        if (branchId) where.branchId = String(branchId);
        if (departmentId) where.departmentId = String(departmentId);

        const employees = await prisma.employee.findMany({
            where,
            include: {
                company: true,
                branch: true,
                department: true,
                designation: true,
                location: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getEmployeeById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const employee = await prisma.employee.findUnique({
            where: { id },
            include: {
                company: true,
                branch: true,
                department: true,
                designation: true,
                location: true
            },
        });
        if (!employee) return res.status(404).json({ message: "Employee not found" });
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateEmployee = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = updateEmployeeSchema.parse(req.body);

        const employee = await prisma.employee.update({
            where: { id },
            data
        });
        res.json(employee);
    } catch (error: any) {
        if (error instanceof z.ZodError) return res.status(400).json({ errors: error.issues });
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteEmployee = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.employee.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
