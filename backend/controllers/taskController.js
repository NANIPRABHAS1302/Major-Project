import Task from '../models/Task.js';
import Category from '../models/Category.js';
import { AppError, asyncHandler } from '../utils/errorHandler.js';

const priorityOrder = { high: 3, medium: 2, low: 1 };

export const getTasks = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
    priority,
    completed,
    category,
  } = req.query;

  const query = { user: req.user._id };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  if (priority) {
    query.priority = priority;
  }

  if (completed !== undefined) {
    query.completed = completed === 'true';
  }

  if (category) {
    query.category = category;
  }

  const sortOptions = {};
  if (sortBy === 'priority') {
    sortOptions.priority = sortOrder === 'asc' ? 1 : -1;
  } else {
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
  }

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  let tasks = await Task.find(query)
    .populate('category', 'name color')
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit, 10));

  if (sortBy === 'priority') {
    tasks = tasks.sort((a, b) => {
      const diff = priorityOrder[b.priority] - priorityOrder[a.priority];
      return sortOrder === 'asc' ? -diff : diff;
    });
  }

  const total = await Task.countDocuments(query);

  res.status(200).json({
    success: true,
    count: tasks.length,
    total,
    page: parseInt(page, 10),
    pages: Math.ceil(total / parseInt(limit, 10)),
    tasks,
  });
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user._id,
  }).populate('category', 'name color');

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  res.status(200).json({
    success: true,
    task,
  });
});

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, dueDate, category } = req.body;

  if (category) {
    const categoryExists = await Category.findOne({
      _id: category,
      user: req.user._id,
    });
    if (!categoryExists) {
      throw new AppError('Category not found', 404);
    }
  }

  const task = await Task.create({
    title,
    description,
    priority,
    dueDate: dueDate || null,
    category: category || null,
    user: req.user._id,
  });

  await task.populate('category', 'name color');

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    task,
  });
});

export const updateTask = asyncHandler(async (req, res) => {
  let task = await Task.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  const { title, description, priority, dueDate, category, completed } = req.body;

  if (category) {
    const categoryExists = await Category.findOne({
      _id: category,
      user: req.user._id,
    });
    if (!categoryExists) {
      throw new AppError('Category not found', 404);
    }
  }

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (priority !== undefined) task.priority = priority;
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (category !== undefined) task.category = category;
  if (completed !== undefined) {
    task.completed = completed;
    task.completedAt = completed ? new Date() : null;
  }

  await task.save();
  await task.populate('category', 'name color');

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    task,
  });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
  });
});

export const toggleTaskComplete = asyncHandler(async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  task.completed = !task.completed;
  task.completedAt = task.completed ? new Date() : null;
  await task.save();
  await task.populate('category', 'name color');

  res.status(200).json({
    success: true,
    message: task.completed ? 'Task marked as complete' : 'Task marked as incomplete',
    task,
  });
});

export const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const [
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
    highPriorityTasks,
    tasksByPriority,
    tasksByCategory,
    recentTasks,
    weeklyCompleted,
  ] = await Promise.all([
    Task.countDocuments({ user: userId }),
    Task.countDocuments({ user: userId, completed: true }),
    Task.countDocuments({ user: userId, completed: false }),
    Task.countDocuments({
      user: userId,
      completed: false,
      dueDate: { $lt: now, $ne: null },
    }),
    Task.countDocuments({ user: userId, priority: 'high', completed: false }),
    Task.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]),
    Task.aggregate([
      { $match: { user: userId, category: { $ne: null } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryInfo',
        },
      },
      { $unwind: '$categoryInfo' },
      {
        $project: {
          _id: 0,
          categoryId: '$_id',
          name: '$categoryInfo.name',
          color: '$categoryInfo.color',
          count: 1,
        },
      },
    ]),
    Task.find({ user: userId })
      .populate('category', 'name color')
      .sort({ updatedAt: -1 })
      .limit(5),
    Task.aggregate([
      {
        $match: {
          user: userId,
          completed: true,
          completedAt: { $gte: startOfWeek },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: '$completedAt' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyProductivity = dayNames.map((day, index) => {
    const dayData = weeklyCompleted.find((d) => d._id === index + 1);
    return {
      day,
      completed: dayData ? dayData.count : 0,
    };
  });

  const priorityStats = {
    low: 0,
    medium: 0,
    high: 0,
  };
  tasksByPriority.forEach((item) => {
    priorityStats[item._id] = item.count;
  });

  res.status(200).json({
    success: true,
    stats: {
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      highPriorityTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      priorityStats,
      categoryStats: tasksByCategory,
      recentTasks,
      weeklyProductivity,
    },
  });
});
