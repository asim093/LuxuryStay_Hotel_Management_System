import { HousekeepingTaskModel } from '../Models/HousekeepingTask.model.js';
import { RoomModel } from '../Models/Room.model.js';
import { Usermodle } from '../Models/User.model.js';

// Get all housekeeping tasks
export const getAllTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, taskType } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (taskType) filter.taskType = taskType;

    const tasks = await HousekeepingTaskModel.find(filter)
      .populate('room', 'roomNumber roomType floor')
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await HousekeepingTaskModel.countDocuments(filter);

    res.json({
      success: true,
      tasks,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get completed tasks
export const getCompletedTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const tasks = await HousekeepingTaskModel.find({ status: 'Completed' })
      .populate('room', 'roomNumber roomType floor')
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email')
      .sort({ completedDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await HousekeepingTaskModel.countDocuments({ status: 'Completed' });

    res.json({
      success: true,
      tasks,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get completed tasks error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get task by ID
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await HousekeepingTaskModel.findById(id)
      .populate('room', 'roomNumber roomType floor')
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Get task by ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create new task
export const createTask = async (req, res) => {
  try {
    const {
      room,
      assignedTo,
      taskType,
      priority,
      scheduledDate,
      estimatedDuration,
      description,
      notes
    } = req.body;

    // Generate task number
    const taskCount = await HousekeepingTaskModel.countDocuments();
    const taskNumber = `HT${String(taskCount + 1).padStart(4, '0')}`;

    const task = new HousekeepingTaskModel({
      taskNumber,
      room,
      assignedTo,
      taskType,
      priority: priority || 'Medium',
      scheduledDate: scheduledDate || new Date(),
      estimatedDuration: estimatedDuration || 30,
      description,
      notes,
      createdBy: req.user.id
    });

    await task.save();

    // Populate the task before sending response
    await task.populate([
      { path: 'room', select: 'roomNumber roomType floor' },
      { path: 'assignedTo', select: 'name email role' },
      { path: 'createdBy', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const task = await HousekeepingTaskModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate([
      { path: 'room', select: 'roomNumber roomType floor' },
      { path: 'assignedTo', select: 'name email role' },
      { path: 'createdBy', select: 'name email' }
    ]);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Assign task to staff
export const assignTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;

    const task = await HousekeepingTaskModel.findByIdAndUpdate(
      id,
      { assignedTo, status: 'Pending' },
      { new: true, runValidators: true }
    ).populate([
      { path: 'room', select: 'roomNumber roomType floor' },
      { path: 'assignedTo', select: 'name email role' },
      { path: 'createdBy', select: 'name email' }
    ]);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({
      success: true,
      message: 'Task assigned successfully',
      task
    });
  } catch (error) {
    console.error('Assign task error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Complete task
export const completeTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes, actualDuration, rating } = req.body;

    const task = await HousekeepingTaskModel.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update task status
    task.status = 'Completed';
    task.completedDate = new Date();
    if (notes) task.notes = notes;
    if (actualDuration) task.actualDuration = actualDuration;
    if (rating) task.rating = rating;

    await task.save();

    // Update room status to Clean
    await RoomModel.findByIdAndUpdate(task.room, { status: 'Clean' });

    // Populate the task before sending response
    await task.populate([
      { path: 'room', select: 'roomNumber roomType floor' },
      { path: 'assignedTo', select: 'name email role' },
      { path: 'createdBy', select: 'name email' }
    ]);

    res.json({
      success: true,
      message: 'Task completed successfully',
      task
    });
  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await HousekeepingTaskModel.findByIdAndDelete(id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
