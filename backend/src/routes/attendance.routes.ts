import { Router } from 'express';
import * as AttendanceController from '../controllers/attendance.controller';

const router = Router();

router.post('/process', AttendanceController.processAttendance);
router.get('/daily', AttendanceController.getDailyReport);

export default router;
