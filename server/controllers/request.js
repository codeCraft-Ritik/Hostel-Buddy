import Request from '../models/request.js';
import mongoose from 'mongoose';

// Controller to add a new request
export const addRequest = async (req, res) => {
    try {
        const { requestData } = req.body;
        // --- UPDATE THIS LINE ---
        const { itemName, description, imageUrl } = requestData;

        if (!itemName || !description) {
            return res.status(400).json({ success: false, error: "Item name and description are required." });
        }

        const newRequest = await Request.create({
            itemName,
            description,
            imageUrl, 
            requester: req.user._id 
        });

        res.status(201).json({
            success: true,
            message: 'Request added successfully!',
            request: newRequest
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

// ... (keep getAllRequests and fulfillRequest functions as they are)
// ...
export const getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find({ isFulfilled: false })
            .populate('requester', 'name profileImage') 
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            requests
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export const fulfillRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const fulfilledByUserId = req.user._id;

        const request = await Request.findById(id);

        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found.' });
        }

        if (request.requester.toString() === fulfilledByUserId.toString()) {
            return res.status(400).json({ success: false, message: "You cannot fulfill your own request." });
        }
        
        request.isFulfilled = true;
        request.fulfilledBy = fulfilledByUserId;
        await request.save();

        res.status(200).json({
            success: true,
            message: 'Thank you for offering to help!',
            request
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};