import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';

async function errorHandlerPlugin(fastify: FastifyInstance) {
  fastify.setErrorHandler((error, request, reply) => {
    if (error.code === 'FST_ERR_VALIDATION') {
      try {
        const parsed = JSON.parse(error.message);
        return reply.status(400).send(parsed);
      } catch {
        return reply.status(400).send({
          error: 'VALIDATION_ERROR',
          message: error.message,
        });
      }
    }

    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: 'VALIDATION_ERROR',
        message: error.issues[0]?.message ?? 'Invalid request parameters',
      });
    }

    if (error.name === 'ZodError') {
      return reply.status(400).send({
        error: 'VALIDATION_ERROR',
        message: (error as unknown as ZodError).issues?.[0]?.message
          ?? 'Invalid request parameters',
      });
    }

    if (error.statusCode === 404) {
      return reply.status(404).send({
        error: 'NOT_FOUND',
        message: 'Route not found',
      });
    }

    request.log.error(error);
    return reply.status(error.statusCode ?? 500).send({
      error: 'INTERNAL_ERROR',
      message: 'Something went wrong',
    });
  });
}

export default fp(errorHandlerPlugin);
