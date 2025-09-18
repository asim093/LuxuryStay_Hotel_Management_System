import express from 'express';
import { 
  getAllMaintenanceTasks, 
  getMaintenanceTaskById, 
  createMaintenanceTask, 
  updateMaintenanceTask, 
  deleteMaintenanceTask, 
  getCompletedMaintenanceTasks,
  assignMaintenanceTask,
  completeMaintenanceTask,
  getMaintenanceStaff,
  getMaintenanceStats
} from '../controllers/MaintenanceController.js';
import authMiddleware from '../middleware/Auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

// Get all maintenance tasks
router.get('/', getAllMaintenanceTasks);

// Get maintenance statistics
router.get('/stats', getMaintenanceStats);

// Get completed maintenance tasks
router.get('/completed', getCompletedMaintenanceTasks);

// Get maintenance staff
router.get('/staff', getMaintenanceStaff);

// Get task by ID
router.get('/:id', getMaintenanceTaskById);

// Create new maintenance task
router.post('/', createMaintenanceTask);

// Update maintenance task
router.put('/:id', updateMaintenanceTask);

// Assign maintenance task to staff
router.put('/:id/assign', assignMaintenanceTask);

// Complete maintenance task
router.put('/:id/complete', completeMaintenanceTask);

// Delete maintenance task
router.delete('/:id', deleteMaintenanceTask);

export default router;
