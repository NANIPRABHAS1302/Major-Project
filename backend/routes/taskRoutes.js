import express from 'express';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskComplete,
  getDashboardStats,
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  taskValidation,
  taskQueryValidation,
  mongoIdValidation,
} from '../middleware/validators.js';

const router = express.Router();

router.use(protect);

router.get('/dashboard/stats', getDashboardStats);
router.get('/', taskQueryValidation, validate, getTasks);
router.get('/:id', mongoIdValidation, validate, getTask);
router.post('/', taskValidation, validate, createTask);
router.put('/:id', mongoIdValidation, taskValidation, validate, updateTask);
router.delete('/:id', mongoIdValidation, validate, deleteTask);
router.patch('/:id/toggle', mongoIdValidation, validate, toggleTaskComplete);

export default router;
