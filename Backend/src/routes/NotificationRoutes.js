import express from 'express';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  createNotification,
  deleteNotification,
  getNotificationStats
} from '../controllers/NotificationController.js';
import authMiddleware from '../middleware/Auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get notifications for current user's role
router.get('/', getNotifications);

// Get unread notification count
router.get('/unread-count', getUnreadCount);

// Get notification statistics
router.get('/stats', getNotificationStats);

// Mark notification as read
router.patch('/:id/read', markAsRead);

// Mark all notifications as read
router.patch('/mark-all-read', markAllAsRead);

// Create notification (Admin only)
router.post('/', createNotification);

// Delete notification
router.delete('/:id', deleteNotification);

export default router;
