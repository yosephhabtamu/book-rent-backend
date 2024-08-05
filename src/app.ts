import express from 'express';
import bookRoutes from './routes/bookRoutes';
import authRoutes from './routes/authRoute';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);

export default app;
