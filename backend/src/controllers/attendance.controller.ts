import { Request, Response } from 'express';
import { AttendanceService } from '../services/attendance.service';
import { z } from 'zod';

const processSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
});

export const processAttendance = async (req: Request, res: Response) => {
    try {
        const { date } = processSchema.parse(req.body);
        const result = await AttendanceService.processDailyAttendance(date);
        res.json({ message: "Processing completed", result });
    } catch (error: any) {
        if (error instanceof z.ZodError) return res.status(400).json({ errors: error.issues });
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getDailyReport = async (req: Request, res: Response) => {
    try {
        const { date } = req.query;
        if (!date || typeof date !== 'string') return res.status(400).json({ message: "Date parameter required" });

        const records = await AttendanceService.getDailyReport(date);
        res.json(records);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
