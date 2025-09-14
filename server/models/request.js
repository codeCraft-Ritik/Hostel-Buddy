import mongoose from 'mongoose';

const { Schema } = mongoose;

const requestSchema = new Schema({
    itemName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requester: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // --- ADD THIS FIELD ---
    imageUrl: {
        type: String,
        default: null
    },
    // --- END ---
    isFulfilled: {
        type: Boolean,
        default: false
    },
    fulfilledBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, { timestamps: true });

const Request = mongoose.model('Request', requestSchema);

export default Request;