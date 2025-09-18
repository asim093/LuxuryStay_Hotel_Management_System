import express from 'express';
import { 
  getAllTasks, 
  getTaskById, 
  createTask, 
  updateTask, 
  deleteTask, 
  getCompletedTasks,
  assignTask,
  completeTask
} from '../controllers/HousekeepingController.js';
import authMiddleware from '../middleware/Auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

// Get all housekeeping tasks
router.get('/', getAllTasks);

// Get completed tasks
router.get('/completed', getCompletedTasks);

// Get task by ID
router.get('/:id', getTaskById);

// Create new task
router.post('/', createTask);

// Update task
router.put('/:id', updateTask);

// Assign task to staff
router.put('/:id/assign', assignTask);

// Complete task
router.put('/:id/complete', completeTask);

// Update task status
router.patch('/:id/status', updateTask);

// Delete task
router.delete('/:id', deleteTask);

export default router;
