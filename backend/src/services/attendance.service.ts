import prisma from '../lib/prisma';
import { differenceInMinutes, format, startOfDay, endOfDay } from 'date-fns';

export class AttendanceService {

    static async processDailyAttendance(dateString: string) {
        const date = new Date(dateString);
        const start = startOfDay(date);
        const end = endOfDay(date);

        console.log(`Processing attendance for ${dateString}`);

        // 1. Get all active employees
        const employees = await prisma.employee.findMany({
            where: { isActive: true },
            include: {
                shiftAssignments: {
                    where: {
                        fromDate: { lte: date },
                        OR: [
                            { toDate: null },
                            { toDate: { gte: date } }
                        ]
                    },
                    include: { shift: true }
                }
            }
        });

        const results = [];

        for (const emp of employees) {
            // 2. Identify Shift
            // Simplified: Take the first active assignment or default to a dummy if none (logic to be enhanced)
            const assignment = emp.shiftAssignments[0];
            const shift = assignment?.shift;

            if (!shift) {
                // No shift assigned - Mark as WeekOff or Absent based on policy? For now, skip or mark ABSENT
                await this.upsertDailyRecord(emp.id, date, null, null, null, 'ABSENT', 0);
                continue;
            }

            // 3. Fetch Punches
            const punches = await prisma.attendanceLog.findMany({
                where: {
                    employeeCode: emp.employeeCode,
                    punchTime: {
                        gte: start,
                        lte: end
                    }
                },
                orderBy: { punchTime: 'asc' }
            });

            if (punches.length === 0) {
                await this.upsertDailyRecord(emp.id, date, shift.id, null, null, 'ABSENT', 0);
                continue;
            }

            // 4. Calculate Logic (Basic First In - Last Out)
            const inTime = punches[0].punchTime;
            const outTime = punches[punches.length - 1].punchTime;

            let status = 'PRESENT';
            let totalHours = 0;
            let lateIn = 0;
            let earlyOut = 0;

            if (punches.length === 1) {
                // Only one punch - limit case.
                totalHours = 0;
            } else {
                totalHours = differenceInMinutes(outTime, inTime) / 60;
            }

            // Check Late In (Simple comparison against shift start)
            // Note: This requires combining date with shift time string. 
            // Simplified for MVP: Assume StartTime is fixed on the day.

            // TODO: Robust Time Parsing & Comparison

            await this.upsertDailyRecord(emp.id, date, shift.id, inTime, outTime, status, totalHours);
            results.push({ emp: emp.employeeCode, status });
        }

        return results;
    }

    private static async upsertDailyRecord(
        employeeId: string,
        date: Date,
        shiftId: string | null,
        inTime: Date | null,
        outTime: Date | null,
        status: string,
        totalHours: number
    ) {
        // Check if exists
        const existing = await prisma.dailyAttendance.findUnique({
            where: {
                employeeId_date: {
                    employeeId,
                    date
                }
            }
        });

        const data = {
            shiftId,
            inTime,
            outTime,
            status,
            totalHours,
            isFinalized: false
        };

        if (existing) {
            return prisma.dailyAttendance.update({
                where: { id: existing.id },
                data
            });
        } else {
            return prisma.dailyAttendance.create({
                data: {
                    employeeId,
                    date,
                    ...data
                }
            });
        }
    }

    static async getDailyReport(dateString: string) {
        const date = new Date(dateString);
        return prisma.dailyAttendance.findMany({
            where: { date },
            include: { employee: true, shift: true }
        });
    }
}
