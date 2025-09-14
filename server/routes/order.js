import express from 'express';
import { 
    addOrder, 
    cancelProductRequest, 
    getMyBorrowingHistory,
    acceptOrder,      // <-- Import new function
    declineOrder      // <-- Import new function
} from '../controllers/order.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

router.post('/add', auth, addOrder);
router.delete('/cancel', auth, cancelProductRequest);
router.get('/my-borrowing', auth, getMyBorrowingHistory);

// --- ADD THESE NEW ROUTES ---
router.patch('/accept/:orderId', auth, acceptOrder);
router.patch('/decline/:orderId', auth, declineOrder);
// --- END OF NEW ROUTES ---

export default router;