import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import masterRoutes from './routes/master.routes';
import employeeRoutes from './routes/employee.routes';
import shiftRoutes from './routes/shift.routes';
import attendanceRoutes from './routes/attendance.routes';
import leaveRoutes from './routes/leave.routes';
import reportRoutes from './routes/report.routes';
import authRoutes from './routes/auth.routes';
import { authenticate } from './middleware/auth.middleware';

import schedulerService from './services/scheduler.service';

const app = express();
const port = process.env.PORT || 5000;

// Initialize Scheduler
schedulerService.start();

app.use(cors());
app.use(express.json());

app.use('/api', masterRoutes); // Public for now (or make read-only public)
app.use('/api/employees', authenticate, employeeRoutes);
app.use('/api/shifts', authenticate, shiftRoutes);
app.use('/api/attendance', authenticate, attendanceRoutes);
app.use('/api/leaves', authenticate, leaveRoutes);
app.use('/api/reports', authenticate, reportRoutes);
app.use('/api/auth', authRoutes); // Public login

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date(), service: 'attendance-backend' });
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
