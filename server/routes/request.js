import express from 'express';
import { addRequest, getAllRequests, fulfillRequest } from '../controllers/request.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

// Route to add a new request (requires user to be logged in)
router.post('/add', auth, addRequest);

// Route to get all active requests
router.get('/all', getAllRequests);

// Route to mark a request as fulfilled (requires user to be logged in)
router.patch('/fulfill/:id', auth, fulfillRequest);

export default router;