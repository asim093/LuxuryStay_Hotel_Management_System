import NotificationService from '../services/notificationService.js';

export const getNotifications = async (req, res) => {
  try {
    const userRole = req.user?.role;
    const { limit = 50 } = req.query;
    
    if (!userRole) {
      console.error('User role not found in request');
      return res.status(400).json({
        success: false,
        message: 'User role not found'
      });
    }
    
    const normalizedRole = userRole.charAt(0).toUpperCase() + userRole.slice(1).toLowerCase();
    
    console.log('Getting notifications for user role:', userRole, 'normalized to:', normalizedRole);
    const notifications = await NotificationService.getNotificationsForRole(normalizedRole, parseInt(limit));
    console.log('Found notifications:', notifications.length);
    
    res.json({
      success: true,
      notifications: notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get unread notification count
export const getUnreadCount = async (req, res) => {
  try {
    const userRole = req.user?.role;
    const userId = req.user?.id;
    
    if (!userRole) {
      console.error('User role not found in request');
      return res.status(400).json({
        success: false,
        message: 'User role not found'
      });
    }
    
    // Normalize role case - convert to proper case
    const normalizedRole = userRole.charAt(0).toUpperCase() + userRole.slice(1).toLowerCase();
    
    console.log('Getting unread count for user role:', userRole, 'normalized to:', normalizedRole, 'userId:', userId);
    const count = await NotificationService.getUnreadCount(normalizedRole, userId);
    console.log('Unread count:', count);
    
    res.json({
      success: true,
      unreadCount: count
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await NotificationService.markAsRead(id);
    
    res.json({
      success: true,
      message: 'Notification marked as read',
      notification: notification
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const userRole = req.user?.role;
    
    if (!userRole) {
      console.error('User role not found in request');
      return res.status(400).json({
        success: false,
        message: 'User role not found'
      });
    }
    
    // Normalize role case - convert to proper case
    const normalizedRole = userRole.charAt(0).toUpperCase() + userRole.slice(1).toLowerCase();
    
    await NotificationService.markAllAsRead(normalizedRole);
    
    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create a new notification (Admin only)
export const createNotification = async (req, res) => {
  try {
    const { title, message, type, category, recipientRole, priority, metadata } = req.body;
    
    const notification = await NotificationService.createNotification({
      title,
      message,
      type,
      category,
      recipientRole,
      priority,
      metadata
    });
    
    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      notification: notification
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { NotificationModel } = await import('../Models/Notification.model.js');
    const notification = await NotificationModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getNotificationStats = async (req, res) => {
  try {
    const userRole = req.user?.role;
    
    if (!userRole) {
      console.error('User role not found in request');
      return res.status(400).json({
        success: false,
        message: 'User role not found'
      });
    }
    
    const normalizedRole = userRole.charAt(0).toUpperCase() + userRole.slice(1).toLowerCase();
    
    const { NotificationModel } = await import('../Models/Notification.model.js');
    
    const stats = await NotificationModel.aggregate([
      {
        $match: {
          recipientRole: normalizedRole,
          isActive: true
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          unreadCount: {
            $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] }
          }
        }
      }
    ]);
    
    const totalUnread = await NotificationService.getUnreadCount(normalizedRole);
    
    res.json({
      success: true,
      stats: {
        totalUnread,
        byCategory: stats
      }
    });
  } catch (error) {
    console.error('Get notification stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
