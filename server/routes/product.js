import express from 'express';
import {
    addProduct,
    deleteProduct,
    getProductsMetadata,
    getProductDesc,
    getProductRequested,
    getMyLendingProducts
} from '../controllers/product.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

router.get('/all', getProductsMetadata);
router.post('/add', auth, addProduct);
router.get('/desc', getProductDesc);
router.get('/getRequests', auth, getProductRequested);
router.get('/my-lending', auth, getMyLendingProducts);
router.delete('/:productId', auth, deleteProduct);

export default router;