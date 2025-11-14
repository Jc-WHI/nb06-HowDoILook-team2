import express from 'express';
import cors from 'cors';
import { PORT } from './src/lib/constants.js';
import styleRegistration from './src/controllers/styleRegistration.js';
import dotenv from 'dotenv';
import styleUpdate from './src/controllers/styleUpdate.js';

dotenv.config();

const app = express();

// MUST be before routes
app.use(express.json());
app.use(cors());

// New REST-conventional create route
app.post('/styles', styleRegistration);

// Legacy (kept)
app.post('/style-registration', styleRegistration);

// Update routes (PUT and PATCH use same controller)
app.put('/styles/:id', styleUpdate);
app.patch('/styles/:id', styleUpdate);

app.listen(PORT, () => {
  console.log('Server Start');
});
