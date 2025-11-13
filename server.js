import express from 'express';
import cors from 'cors';
import { PORT } from './src/lib/constants.js';
import styleRegistration from './src/controllers/styleRegistration.js';
import styleUpdate from './src/controllers/styleUpdate.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// MUST be before routes
app.use(express.json());
app.use(cors());

// Route for testing styleRegistration
app.post('/style-registration', styleRegistration);

// Normalized route
app.patch('/styles/:id', styleUpdate);

// Compatibility routes for current tests/legacy
app.patch('/style/:id', styleUpdate);
app.put('/styleUpdate/:id', styleUpdate);
app.post('/style-update', styleUpdate);

app.listen(PORT, () => {
  console.log('Server Start');
});
