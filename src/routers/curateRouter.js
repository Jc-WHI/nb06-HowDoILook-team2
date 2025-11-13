import express from 'express';
import {
  createCurating,
  deleteCurating,
  getCuratingList,
  updateCurating,
} from '../controllers/curateController.js';

const curateRouter = express.Router();

curateRouter.post('styles/styleId/curations', createCurating);
curateRouter.get('styles/styleId/curations', getCuratingList);
curateRouter.put('curations/curationId', updateCurating);
curateRouter.delete('curations/curationId', deleteCurating);

export default curateRouter;
