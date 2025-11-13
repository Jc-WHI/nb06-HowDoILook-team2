import express from 'express';
import { createCurating } from '../controllers/curateController.js';

const curateRouter = express.Router();

curateRouter.post('styles/styleId/curations', createCurating);

export default curateRouter;
