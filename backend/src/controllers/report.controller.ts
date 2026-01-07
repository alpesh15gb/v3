import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';

export const getDailyAttendanceReport = async (req: Request, res: Response) => {
    try {
        const { date } = req.query;
        if (!date || typeof date !== 'string') return res.status(400).json({ message: "Date is required" });

        const targetDate = new Date(date);

        // Get all employees
        const employees = await prisma.employee.findMany({
            where: { isActive: true },
            include: {
                department: true,
                designation: true,
                branch: true,
                dailyAttendance: {
                    where: { date: targetDate }
                }
            },
            orderBy: { firstName: 'asc' }
        });

        // Transform to flat report structure
        const report = employees.map(emp => {
            const att = emp.dailyAttendance[0];
            return {
                id: emp.id,
                employeeCode: emp.employeeCode,
                name: `${emp.firstName} ${emp.lastName || ''}`,
                department: emp.department?.name || '-',
                designation: emp.designation?.title || '-',
                branch: emp.branch?.name || '-',
                status: att?.status || 'ABSENT',
                inTime: att?.inTime,
                outTime: att?.outTime,
                totalHours: att?.totalHours || 0,
                lateIn: att?.lateInMinutes || 0,
                earlyOut: att?.earlyOutMinutes || 0
            };
        });

        res.json(report);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMonthlyAttendanceReport = async (req: Request, res: Response) => {
    try {
        const { month, year } = req.query;
        if (!month || !year) return res.status(400).json({ message: "Month and Year are required" });

        const startDate = startOfMonth(new Date(Number(year), Number(month) - 1));
        const endDate = endOfMonth(startDate);

        const employees = await prisma.employee.findMany({
            where: { isActive: true },
            include: {
                dailyAttendance: {
                    where: {
                        date: {
                            gte: startDate,
                            lte: endDate
                        }
                    }
                }
            },
            orderBy: { firstName: 'asc' }
        });

        const report = employees.map(emp => {
            const daysMap = new Map();
            emp.dailyAttendance.forEach(d => {
                daysMap.set(format(d.date, 'yyyy-MM-dd'), d.status);
            });

            // Calculate summaries
            const summary = {
                present: emp.dailyAttendance.filter(d => d.status === 'PRESENT').length,
                absent: emp.dailyAttendance.filter(d => d.status === 'ABSENT').length,
                leaves: emp.dailyAttendance.filter(d => d.status === 'LEAVE').length,
                holidays: emp.dailyAttendance.filter(d => d.status === 'HOLIDAY').length,
            };

            return {
                id: emp.id,
                name: `${emp.firstName} ${emp.lastName || ''}`,
                code: emp.employeeCode,
                attendance: Object.fromEntries(daysMap),
                summary
            };
        });

        res.json(report);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
