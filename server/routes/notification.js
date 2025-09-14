import express from 'express';
import { getUnreadNotifications, markNotificationsAsRead } from '../controllers/notification.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

// Get all unread notifications for the logged-in user
router.get('/', auth, getUnreadNotifications);

// Mark notifications as read
router.patch('/mark-read', auth, markNotificationsAsRead);

export default router;