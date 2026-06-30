import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { categoryValidation, mongoIdValidation } from '../middleware/validators.js';

const router = express.Router();

router.use(protect);

router.get('/', getCategories);
router.post('/', categoryValidation, validate, createCategory);
router.put('/:id', mongoIdValidation, categoryValidation, validate, updateCategory);
router.delete('/:id', mongoIdValidation, validate, deleteCategory);

export default router;
