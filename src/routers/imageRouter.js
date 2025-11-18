import { Router } from 'express';
import upload from '../middlewares/upload.js';
import { uploadSingleImage } from '../controllers/imageController.js';

const imageRouter = Router();

imageRouter.post('/images', upload.single('image'), uploadSingleImage);

export default imageRouter;
