import { IDataConnector } from './connector.interface';
import prisma from '../../lib/prisma';

// Mock implementation - Replace with actual `mssql` logic later
export class SQLServerConnector implements IDataConnector {
    private config: any;

    constructor(config: any) {
        this.config = config;
    }

    async connect(): Promise<void> {
        console.log("Mock SQL Server Connected");
    }

    async disconnect(): Promise<void> {
        console.log("Mock SQL Server Disconnected");
    }

    async fetchLogs(fromDate: Date, toDate: Date): Promise<any[]> {
        // Return dummy data
        return [
            {
                DeviceId: 'DEV001',
                LogDate: new Date(),
                EmpCode: 'EMP001',
                Direction: 'IN'
            }
        ];
    }

    async sync(fromDate: Date): Promise<number> {
        console.log(`Syncing data from ${fromDate}...`);
        // Simulate fetching and saving
        await new Promise(resolve => setTimeout(resolve, 1000));

        // In a real scenario, we would map external logs to AttendanceLog model
        // const logs = await this.fetchLogs(fromDate, new Date());
        // await prisma.attendanceLog.createMany(...)

        console.log("Sync completed");
        return 0;
    }
}
