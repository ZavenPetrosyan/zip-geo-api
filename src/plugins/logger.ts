import { FastifyServerOptions } from 'fastify';
import { env } from '../config/env.js';

export const loggerOptions: FastifyServerOptions['logger'] = {
  level: env.LOG_LEVEL,
  transport: env.NODE_ENV === 'development'
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
};
