import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'success', 'error', 'urgent'],
    default: 'info'
  },
  category: {
    type: String,
    enum: ['booking', 'room', 'maintenance', 'housekeeping', 'guest', 'payment', 'system'],
    required: true
  },
  recipientRole: {
    type: String,
    enum: ['Admin', 'Manager', 'Receptionist', 'Housekeeping', 'Maintenance', 'Guest'],
    required: true
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional for role-based notifications
  },
  relatedEntity: {
    type: {
      type: String,
      enum: ['booking', 'room', 'user', 'maintenance'],
      required: false
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: false
    }
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  readAt: {
    type: Date,
    default: null
  },
  expiresAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for better performance
notificationSchema.index({ recipientRole: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ category: 1, type: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for time ago
notificationSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diffInSeconds = Math.floor((now - this.createdAt) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
});

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Static method to create notification
notificationSchema.statics.createNotification = function(data) {
  return this.create({
    title: data.title,
    message: data.message,
    type: data.type || 'info',
    category: data.category,
    recipientRole: data.recipientRole,
    recipientId: data.recipientId,
    relatedEntity: data.relatedEntity,
    priority: data.priority || 'medium',
    metadata: data.metadata || {},
    expiresAt: data.expiresAt
  });
};

// Static method to get notifications for role
notificationSchema.statics.getNotificationsForRole = function(role, limit = 50) {
  return this.find({
    recipientRole: role,
    isActive: true,
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } }
    ]
  })
  .sort({ createdAt: -1 })
  .limit(limit);
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = function(role, userId = null) {
  const query = {
    recipientRole: role,
    isRead: false,
    isActive: true,
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } }
    ]
  };
  
  if (userId) {
    query.$or = [
      { recipientId: userId },
      { recipientId: null }
    ];
  }
  
  return this.countDocuments(query);
};

export const NotificationModel = mongoose.model('Notification', notificationSchema);
