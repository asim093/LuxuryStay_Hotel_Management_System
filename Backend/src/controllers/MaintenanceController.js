import { HousekeepingTaskModel } from '../Models/HousekeepingTask.model.js';
import { RoomModel } from '../Models/Room.model.js';
import { Usermodle } from '../Models/User.model.js';

// Get all maintenance tasks
export const getAllMaintenanceTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, category } = req.query;
    
    const filter = { taskType: 'Maintenance' };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

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
    console.error('Get all maintenance tasks error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get completed maintenance tasks
export const getCompletedMaintenanceTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const tasks = await HousekeepingTaskModel.find({ 
      taskType: 'Maintenance',
      status: 'Completed' 
    })
      .populate('room', 'roomNumber roomType floor')
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email')
      .sort({ completedDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await HousekeepingTaskModel.countDocuments({ 
      taskType: 'Maintenance',
      status: 'Completed' 
    });

    res.json({
      success: true,
      tasks,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get completed maintenance tasks error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get task by ID
export const getMaintenanceTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await HousekeepingTaskModel.findOne({
      _id: id,
      taskType: 'Maintenance'
    })
      .populate('room', 'roomNumber roomType floor')
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Maintenance task not found' });
    }

    res.json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Get maintenance task by ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create new maintenance task
export const createMaintenanceTask = async (req, res) => {
  try {
    const {
      room,
      title,
      description,
      category,
      location,
      assignedTo,
      priority,
      scheduledDate,
      estimatedDuration,
      estimatedCost,
      notes
    } = req.body;

    // Generate task number for maintenance
    const taskCount = await HousekeepingTaskModel.countDocuments({ taskType: 'Maintenance' });
    const taskNumber = `MT${String(taskCount + 1).padStart(4, '0')}`;

    const task = new HousekeepingTaskModel({
      taskNumber,
      room,
      taskType: 'Maintenance',
      title,
      description,
      category: category || 'General',
      location,
      assignedTo,
      priority: priority || 'Medium',
      scheduledDate: scheduledDate || new Date(),
      estimatedDuration: estimatedDuration || 60,
      estimatedCost: estimatedCost || 0,
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
      message: 'Maintenance task created successfully',
      task
    });
  } catch (error) {
    console.error('Create maintenance task error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update maintenance task
export const updateMaintenanceTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const task = await HousekeepingTaskModel.findOneAndUpdate(
      { _id: id, taskType: 'Maintenance' },
      updateData,
      { new: true, runValidators: true }
    ).populate([
      { path: 'room', select: 'roomNumber roomType floor' },
      { path: 'assignedTo', select: 'name email role' },
      { path: 'createdBy', select: 'name email' }
    ]);

    if (!task) {
      return res.status(404).json({ message: 'Maintenance task not found' });
    }

    res.json({
      success: true,
      message: 'Maintenance task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update maintenance task error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Assign maintenance task to staff
export const assignMaintenanceTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;

    // Verify the assigned user exists and has maintenance role
    const user = await Usermodle.findById(assignedTo);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!['Admin', 'Manager', 'Maintenance'].includes(user.role)) {
      return res.status(400).json({ message: 'User cannot be assigned maintenance tasks' });
    }

    const task = await HousekeepingTaskModel.findOneAndUpdate(
      { _id: id, taskType: 'Maintenance' },
      { assignedTo, status: 'Pending' },
      { new: true, runValidators: true }
    ).populate([
      { path: 'room', select: 'roomNumber roomType floor' },
      { path: 'assignedTo', select: 'name email role' },
      { path: 'createdBy', select: 'name email' }
    ]);

    if (!task) {
      return res.status(404).json({ message: 'Maintenance task not found' });
    }

    res.json({
      success: true,
      message: 'Maintenance task assigned successfully',
      task
    });
  } catch (error) {
    console.error('Assign maintenance task error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Complete maintenance task
export const completeMaintenanceTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes, actualDuration, actualCost, satisfaction } = req.body;

    const task = await HousekeepingTaskModel.findOne({
      _id: id,
      taskType: 'Maintenance'
    });

    if (!task) {
      return res.status(404).json({ message: 'Maintenance task not found' });
    }

    // Update task status
    task.status = 'Completed';
    task.completedDate = new Date();
    if (notes) task.notes = notes;
    if (actualDuration) task.actualDuration = actualDuration;
    if (actualCost) task.actualCost = actualCost;
    if (satisfaction) task.satisfaction = satisfaction;

    await task.save();

    // If task is room-related, optionally update room status
    if (task.room) {
      await RoomModel.findByIdAndUpdate(task.room, { 
        status: 'Available',
        lastMaintenanceDate: new Date()
      });
    }

    // Populate the task before sending response
    await task.populate([
      { path: 'room', select: 'roomNumber roomType floor' },
      { path: 'assignedTo', select: 'name email role' },
      { path: 'createdBy', select: 'name email' }
    ]);

    res.json({
      success: true,
      message: 'Maintenance task completed successfully',
      task
    });
  } catch (error) {
    console.error('Complete maintenance task error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get maintenance staff
export const getMaintenanceStaff = async (req, res) => {
  try {
    const staff = await Usermodle.find({
      role: { $in: ['Maintenance', 'Manager', 'Admin'] },
      isActive: true
    }).select('name email role');

    res.json({
      success: true,
      staff
    });
  } catch (error) {
    console.error('Get maintenance staff error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get maintenance statistics
export const getMaintenanceStats = async (req, res) => {
  try {
    const totalTasks = await HousekeepingTaskModel.countDocuments({ taskType: 'Maintenance' });
    const completedTasks = await HousekeepingTaskModel.countDocuments({ 
      taskType: 'Maintenance', 
      status: 'Completed' 
    });
    const pendingTasks = await HousekeepingTaskModel.countDocuments({ 
      taskType: 'Maintenance', 
      status: { $in: ['Open', 'Pending'] }
    });
    const inProgressTasks = await HousekeepingTaskModel.countDocuments({ 
      taskType: 'Maintenance', 
      status: 'In Progress' 
    });

    // Get overdue tasks
    const overdueTasks = await HousekeepingTaskModel.countDocuments({
      taskType: 'Maintenance',
      status: { $nin: ['Completed', 'Cancelled'] },
      scheduledDate: { $lt: new Date() }
    });

    // Get high priority tasks
    const highPriorityTasks = await HousekeepingTaskModel.countDocuments({
      taskType: 'Maintenance',
      priority: { $in: ['High', 'Urgent'] },
      status: { $nin: ['Completed', 'Cancelled'] }
    });

    res.json({
      success: true,
      stats: {
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        overdueTasks,
        highPriorityTasks
      }
    });
  } catch (error) {
    console.error('Get maintenance stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete maintenance task
export const deleteMaintenanceTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await HousekeepingTaskModel.findOneAndDelete({
      _id: id,
      taskType: 'Maintenance'
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Maintenance task not found' });
    }

    res.json({
      success: true,
      message: 'Maintenance task deleted successfully'
    });
  } catch (error) {
    console.error('Delete maintenance task error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
