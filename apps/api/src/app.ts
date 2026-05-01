import express from 'express';
import cors from 'cors';
import router from './routes/index';
import { errorHandler } from './middlewares/error';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.use(errorHandler);

export default app;
