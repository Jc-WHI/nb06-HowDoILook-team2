
import express from 'express';
import styleRegistration from '../controllers/styleRegistration.js';

const router = express.Router();

router.post('/styles', styleRegistration);

export default StyleRegistrationRouter;