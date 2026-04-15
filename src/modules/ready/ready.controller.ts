import { FastifyRequest, FastifyReply } from 'fastify';
import mongoose from 'mongoose';

const DB_STATES: Record<number, string> = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

export class ReadyController {
  checkHealth = async (_request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({ status: 'ok', timestamp: new Date().toISOString() });
  };

  checkReadiness = async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const isConnected = mongoose.connection.readyState === 1;

      if (!isConnected) {
        return reply.status(503).send({
          error: 'SERVICE_UNAVAILABLE',
          message: `Database is not ready. Current state: ${DB_STATES[mongoose.connection.readyState]}`,
        });
      }

      return reply.send({ status: 'ready', timestamp: new Date().toISOString() });
    } catch (error) {
      return reply.status(503).send({
        error: 'SERVICE_UNAVAILABLE',
        message: 'Service is not ready',
      });
    }
  };
}
