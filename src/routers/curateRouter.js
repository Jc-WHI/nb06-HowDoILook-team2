import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import {
  createCurating,
  deleteCurating,
  getCuratingList,
  updateCurating,
} from '../controllers/curateController.js';

const curateRouter = express.Router();

curateRouter.post('/styles/:styleId/curations', withAsync(createCurating));
curateRouter.delete('/curations/:curationId', withAsync(deleteCurating));
curateRouter.get('/styles/:styleId/curations', withAsync(getCuratingList));
curateRouter.put('/curations/:curationId', withAsync(updateCurating));

export default curateRouter;
