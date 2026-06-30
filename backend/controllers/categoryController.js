import Category from '../models/Category.js';
import Task from '../models/Task.js';
import { AppError, asyncHandler } from '../utils/errorHandler.js';

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ user: req.user._id }).sort({ name: 1 });

  res.status(200).json({
    success: true,
    count: categories.length,
    categories,
  });
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, color } = req.body;

  const existing = await Category.findOne({
    name: { $regex: new RegExp(`^${name}$`, 'i') },
    user: req.user._id,
  });

  if (existing) {
    throw new AppError('Category already exists', 400);
  }

  const category = await Category.create({
    name,
    color: color || '#6366f1',
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    category,
  });
});

export const updateCategory = asyncHandler(async (req, res) => {
  let category = await Category.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  const { name, color } = req.body;

  if (name && name !== category.name) {
    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      user: req.user._id,
      _id: { $ne: category._id },
    });
    if (existing) {
      throw new AppError('Category name already exists', 400);
    }
    category.name = name;
  }

  if (color) category.color = color;

  await category.save();

  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    category,
  });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  await Task.updateMany(
    { category: category._id, user: req.user._id },
    { category: null }
  );

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully',
  });
});
