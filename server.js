import express from 'express';
import cors from 'cors';
import { PORT } from './src/lib/constants.js';
import styleRegistration from './src/controllers/styleRegistration.js';
import dotenv from 'dotenv';
import styleUpdate from './src/controllers/styleUpdate.js';
import styleRegistrationRouter from './src/routers/styleRegistrationRouter.js';

dotenv.config();

const app = express();

// MUST be before routes
app.use(express.json());
app.use(cors());

// New REST-conventional create route
// app.post('/styles', styleRegistration); // removed
app.use(styleRegistrationRouter);

// Legacy (kept)
app.post('/style-registration', styleRegistration);

// Update routes (PUT and PATCH use same controller)

app.listen(PORT, () => {
  console.log('Server Start');
});
