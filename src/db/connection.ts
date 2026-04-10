import mongoose from 'mongoose';
import { env } from '../config/env.js';
import pino from 'pino';

const logger = pino({ level: env.LOG_LEVEL });

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info({ uri: env.MONGODB_URI }, 'MongoDB connected');
  } catch (error) {
    logger.error({ error }, 'MongoDB connection failed');
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected');
  } catch (error) {
    logger.error({ error }, 'MongoDB disconnect failed');
    throw error;
  }
}
