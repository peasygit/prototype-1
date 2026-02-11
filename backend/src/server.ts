import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './utils/prisma';
import authRouter from './routes/auth';
import employersRouter from './routes/employers';
import helpersRouter from './routes/helpers';
import matchesRouter from './routes/matches';
import adminRouter from './routes/admin';
import uploadRouter from './routes/upload';

dotenv.config();

const app = express();
// const prisma = new PrismaClient(); // Removed

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/employers', employersRouter);
app.use('/api/helpers', helpersRouter);
app.use('/api/matches', matchesRouter);
app.use('/api/admin', adminRouter);
app.use('/api/upload', uploadRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

export { prisma };