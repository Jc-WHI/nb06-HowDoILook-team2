
import express from 'express';
import styleRegistration from '../controllers/styleRegistration.js';

const StyleRegistrationRouter = express.Router();

StyleRegistrationRouter.post('/styles', styleRegistration);

export default StyleRegistrationRouter;