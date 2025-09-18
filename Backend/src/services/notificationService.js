import { NotificationModel } from '../Models/Notification.model.js';

class NotificationService {
  // Create a new notification
  static async createNotification(data) {
    try {
      const notification = await NotificationModel.createNotification(data);
      console.log(`Notification created: ${notification.title} for ${data.recipientRole}`);
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Create notifications for multiple roles
  static async createMultiRoleNotification(data, roles) {
    try {
      const notifications = [];
      for (const role of roles) {
        const notification = await NotificationModel.createNotification({
          ...data,
          recipientRole: role
        });
        notifications.push(notification);
      }
      console.log(`Notifications created for roles: ${roles.join(', ')}`);
      return notifications;
    } catch (error) {
      console.error('Error creating multi-role notifications:', error);
      throw error;
    }
  }

  // Booking related notifications
  static async notifyBookingCheckout(booking) {
    try {
      // Notify Housekeeping about dirty room
      await this.createNotification({
        title: 'Room Needs Cleaning',
        message: `Room ${booking.room?.roomNumber} has been checked out and needs cleaning. Guest: ${booking.guest?.name}`,
        type: 'warning',
        category: 'housekeeping',
        recipientRole: 'Housekeeping',
        relatedEntity: {
          type: 'room',
          id: booking.room
        },
        priority: 'high',
        metadata: {
          roomNumber: booking.room?.roomNumber,
          guestName: booking.guest?.name,
          checkoutTime: new Date()
        }
      });

      // Notify Receptionist about checkout
      await this.createNotification({
        title: 'Guest Checked Out',
        message: `${booking.guest?.name} has checked out from Room ${booking.room?.roomNumber}`,
        type: 'info',
        category: 'booking',
        recipientRole: 'Receptionist',
        relatedEntity: {
          type: 'booking',
          id: booking._id
        },
        metadata: {
          roomNumber: booking.room?.roomNumber,
          guestName: booking.guest?.name,
          totalAmount: booking.totalAmount
        }
      });

      console.log(`Checkout notifications sent for booking ${booking._id}`);
    } catch (error) {
      console.error('Error sending checkout notifications:', error);
    }
  }

  static async notifyBookingCheckin(booking) {
    try {
      // Notify Housekeeping about occupied room
      await this.createNotification({
        title: 'Room Occupied',
        message: `Room ${booking.room?.roomNumber} is now occupied by ${booking.guest?.name}`,
        type: 'info',
        category: 'room',
        recipientRole: 'Housekeeping',
        relatedEntity: {
          type: 'room',
          id: booking.room
        },
        metadata: {
          roomNumber: booking.room?.roomNumber,
          guestName: booking.guest?.name,
          checkinTime: new Date()
        }
      });

      // Notify Receptionist about checkin
      await this.createNotification({
        title: 'Guest Checked In',
        message: `${booking.guest?.name} has checked in to Room ${booking.room?.roomNumber}`,
        type: 'success',
        category: 'booking',
        recipientRole: 'Receptionist',
        relatedEntity: {
          type: 'booking',
          id: booking._id
        },
        metadata: {
          roomNumber: booking.room?.roomNumber,
          guestName: booking.guest?.name
        }
      });

      console.log(`Checkin notifications sent for booking ${booking._id}`);
    } catch (error) {
      console.error('Error sending checkin notifications:', error);
    }
  }

  static async notifyBookingCancellation(booking) {
    try {
      // Notify Receptionist about cancellation
      await this.createNotification({
        title: 'Booking Cancelled',
        message: `Booking for Room ${booking.room?.roomNumber} has been cancelled by ${booking.guest?.name}`,
        type: 'warning',
        category: 'booking',
        recipientRole: 'Receptionist',
        relatedEntity: {
          type: 'booking',
          id: booking._id
        },
        metadata: {
          roomNumber: booking.room?.roomNumber,
          guestName: booking.guest?.name,
          cancellationReason: booking.cancellationReason
        }
      });

      // Notify Manager about cancellation
      await this.createNotification({
        title: 'Booking Cancellation',
        message: `Revenue loss: Rs:${booking.totalAmount} - Room ${booking.room?.roomNumber} booking cancelled`,
        type: 'warning',
        category: 'booking',
        recipientRole: 'Manager',
        priority: 'medium',
        metadata: {
          roomNumber: booking.room?.roomNumber,
          guestName: booking.guest?.name,
          lostRevenue: booking.totalAmount
        }
      });

      console.log(`Cancellation notifications sent for booking ${booking._id}`);
    } catch (error) {
      console.error('Error sending cancellation notifications:', error);
    }
  }

  // Room related notifications
  static async notifyRoomMaintenance(room, issue) {
    try {
      // Notify Maintenance team
      await this.createNotification({
        title: 'Room Maintenance Required',
        message: `Room ${room.roomNumber} needs maintenance: ${issue}`,
        type: 'urgent',
        category: 'maintenance',
        recipientRole: 'Maintenance',
        relatedEntity: {
          type: 'room',
          id: room._id
        },
        priority: 'high',
        metadata: {
          roomNumber: room.roomNumber,
          issue: issue,
          reportedBy: 'System'
        }
      });

      // Notify Manager
      await this.createNotification({
        title: 'Room Out of Service',
        message: `Room ${room.roomNumber} is out of service due to maintenance`,
        type: 'warning',
        category: 'room',
        recipientRole: 'Manager',
        relatedEntity: {
          type: 'room',
          id: room._id
        },
        metadata: {
          roomNumber: room.roomNumber,
          issue: issue
        }
      });

      console.log(`Maintenance notifications sent for room ${room.roomNumber}`);
    } catch (error) {
      console.error('Error sending maintenance notifications:', error);
    }
  }

  static async notifyRoomCleaned(room) {
    try {
      // Notify Receptionist that room is ready
      await this.createNotification({
        title: 'Room Ready for Guests',
        message: `Room ${room.roomNumber} has been cleaned and is ready for new guests`,
        type: 'success',
        category: 'room',
        recipientRole: 'Receptionist',
        relatedEntity: {
          type: 'room',
          id: room._id
        },
        metadata: {
          roomNumber: room.roomNumber,
          cleanedAt: new Date()
        }
      });

      console.log(`Room cleaned notification sent for room ${room.roomNumber}`);
    } catch (error) {
      console.error('Error sending room cleaned notification:', error);
    }
  }

  // User related notifications
  static async notifyNewUserRegistration(user) {
    try {
      // Notify Admin about new user
      await this.createNotification({
        title: 'New User Registered',
        message: `New ${user.role} registered: ${user.name} (${user.email})`,
        type: 'info',
        category: 'user',
        recipientRole: 'Admin',
        relatedEntity: {
          type: 'user',
          id: user._id
        },
        metadata: {
          userName: user.name,
          userEmail: user.email,
          userRole: user.role
        }
      });

      console.log(`New user notification sent for ${user.name}`);
    } catch (error) {
      console.error('Error sending new user notification:', error);
    }
  }

  // System notifications
  static async notifyLowInventory(item, quantity) {
    try {
      await this.createMultiRoleNotification({
        title: 'Low Inventory Alert',
        message: `${item} is running low. Current quantity: ${quantity}`,
        type: 'warning',
        category: 'system',
        priority: 'medium',
        metadata: {
          item: item,
          quantity: quantity
        }
      }, ['Admin', 'Manager']);

      console.log(`Low inventory notification sent for ${item}`);
    } catch (error) {
      console.error('Error sending low inventory notification:', error);
    }
  }

  // Get notifications for a role
  static async getNotificationsForRole(role, limit = 50) {
    try {
      return await NotificationModel.getNotificationsForRole(role, limit);
    } catch (error) {
      console.error('Error getting notifications:', error);
      throw error;
    }
  }

  // Get unread count
  static async getUnreadCount(role, userId = null) {
    try {
      return await NotificationModel.getUnreadCount(role, userId);
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId) {
    try {
      const notification = await NotificationModel.findById(notificationId);
      if (notification) {
        await notification.markAsRead();
        return notification;
      }
      throw new Error('Notification not found');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read for a role
  static async markAllAsRead(role) {
    try {
      await NotificationModel.updateMany(
        { recipientRole: role, isRead: false },
        { isRead: true, readAt: new Date() }
      );
      console.log(`All notifications marked as read for ${role}`);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
}

export default NotificationService;
