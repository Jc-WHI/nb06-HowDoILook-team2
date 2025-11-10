import {Router} from 'express';
import styleUpdate from '../lib/styleUpdate.js';

const styleRouter = Router();

//style update 
styleRouter.put('/styles/:styleId',styleUpdate)
    



export default styleRouter;