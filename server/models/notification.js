import mongoose from 'mongoose';

const { Schema } = mongoose;

const notificationSchema = new Schema({
    // The user who should receive the notification
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // The user who triggered the notification (e.g., the item owner)
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // The order this notification is about
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    // The type of notification
    type: {
        type: String,
        enum: ['REQUEST_ACCEPTED', 'REQUEST_DECLINED'],
        required: true,
    },
    // The message that will be displayed
    message: {
        type: String,
        required: true,
    },
    // To track if the user has seen the notification
    isRead: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;