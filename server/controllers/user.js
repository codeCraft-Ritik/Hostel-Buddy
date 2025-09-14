import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';


export const checkUserExists = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required." });
        }
        const user = await User.findOne({ email }).lean();
        return res.status(200).json({
            success: true,
            exists: !!user,
        });
    } catch (error) {
        console.error('Error checking user:', error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const signup = async (req, res) => {
    try {
        const { userData } = req.body;
        const requiredFields = ['email', 'name', 'batchYear', 'hostel', 'phone', 'room'];
        for (const field of requiredFields) {
            if (!userData[field]) {
                return res.status(400).json({ success: false, message: `Missing required field: ${field}` });
            }
        }
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "A user with this email already exists. Please Sign In." });
        }
        const user = await User.create({ ...userData, batchYear: parseInt(userData.batchYear, 10) });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        const userResponse = {
            _id: user._id, name: user.name, email: user.email, profileImage: user.profileImage,
            batchYear: user.batchYear, hostel: user.hostel, room: user.room,
        };
        return res.status(201).json({ success: true, token, user: userResponse, message: `User created successfully` });
    } catch (error) {
        console.error("Error in signup:", error);
        return res.status(500).json({ success: false, message: "An unexpected error occurred on the server.", error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required." });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "No account found with this email. Please Sign Up first." });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        const userResponse = {
            _id: user._id, name: user.name, email: user.email, profileImage: user.profileImage,
            batchYear: user.batchYear, hostel: user.hostel, room: user.room,
        };
        return res.status(200).json({ success: true, token, user: userResponse, message: `User Login Success` });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, batchYear, hostel, phone, room, profileImage } = req.body;

        const updateData = {
            name,
            batchYear,
            hostel,
            phone,
            room,
            profileImage
        };
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const userResponse = {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            profileImage: updatedUser.profileImage,
            batchYear: updatedUser.batchYear,
            hostel: updatedUser.hostel,
            room: updatedUser.room,
        };

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully!',
            user: userResponse
        });

    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};