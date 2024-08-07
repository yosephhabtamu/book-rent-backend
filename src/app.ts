import express from 'express';
import bookRoutes from './routes/bookRoutes';
import authRoutes from './routes/authRoute';
import dotenv from 'dotenv';
import cors from 'cors';
import { authenticate } from './middleware/auth';
import { PrismaClient } from '@prisma/client';

dotenv.config();


const prisma = new PrismaClient();



const app = express();


app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use('/api/books',authenticate, bookRoutes);
app.use('/api/auth', authRoutes);

export {prisma}
export default app;
