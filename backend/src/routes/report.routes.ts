import { Router } from 'express';
import * as ReportController from '../controllers/report.controller';

const router = Router();

router.get('/daily', ReportController.getDailyAttendanceReport);
router.get('/monthly', ReportController.getMonthlyAttendanceReport);

export default router;
