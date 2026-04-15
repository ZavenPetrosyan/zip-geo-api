import { FastifyInstance } from 'fastify';
import { ReadyController } from './ready.controller.js';

export async function readyRoutes(fastify: FastifyInstance) {
  const controller = new ReadyController();

  fastify.get('/health', {
    schema: {
      tags: ['Health'],
      summary: 'Health check endpoint',
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  }, controller.checkHealth);

  fastify.get('/ready', {
    schema: {
      tags: ['Health'],
      summary: 'Readiness check endpoint',
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        503: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },
    },
  }, controller.checkReadiness);
}
