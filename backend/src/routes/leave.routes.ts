import { Router } from 'express';
import * as LeaveController from '../controllers/leave.controller';

const router = Router();

// Leave Types
router.post('/types', LeaveController.createLeaveType);
router.get('/types', LeaveController.getLeaveTypes);

// Leave Requests
router.post('/requests', LeaveController.applyLeave);
router.get('/requests', LeaveController.getLeaveRequests);
router.put('/requests/:id/status', LeaveController.updateLeaveStatus);

export default router;
