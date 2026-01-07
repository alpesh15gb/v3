import cron from 'node-cron';
import { SQLServerConnector } from './etl/sqlserver.connector';

class SchedulerService {
    private connector: SQLServerConnector;

    constructor() {
        this.connector = new SQLServerConnector({});
    }

    start() {
        console.log("Scheduler Service Started");

        // Schedule sync every 15 minutes
        cron.schedule('*/15 * * * *', async () => {
            console.log("Running scheduled sync...");
            try {
                await this.connector.sync(new Date());
            } catch (error) {
                console.error("Sync failed", error);
            }
        });

        // Schedule daily processing at 1 AM
        cron.schedule('0 1 * * *', () => {
            console.log("Running daily processing...");
            // Call AttendanceService.processDailyAttendance(yesterday)
        });
    }
}

export default new SchedulerService();
