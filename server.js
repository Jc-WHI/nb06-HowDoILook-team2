import express from 'express';
import cors from 'cors';
import { PORT } from './src/lib/constants.js';
import styleRegistration from './src/controllers/styleRegistration.js';

const app = express();

app.use(express.json());
app.use(cors());

// Route for testing styleRegistration
app.post('/style-registration', styleRegistration);

app.listen(PORT, () => {
  console.log('Server Start');
});
