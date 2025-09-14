import express from 'express';
import multer from 'multer';
import { uploadImages } from '../controllers/images.js';

const router = express.Router();

// Use memory storage to handle the file buffer
const upload = multer({ storage: multer.memoryStorage() });

// Change from upload.any('image') to upload.single('image')
router.post('/upload', upload.single('image'), uploadImages);

export default router;