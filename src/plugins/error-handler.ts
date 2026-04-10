import fp from 'fastify-plugin';
import { FastifyInstance, FastifyError } from 'fastify';
import { ZodError } from 'zod';

async function errorHandlerPlugin(fastify: FastifyInstance) {
  fastify.setErrorHandler((error: FastifyError, request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: 'VALIDATION_ERROR',
        message: error.issues[0]?.message ?? 'Invalid request parameters',
      });
    }

    if ((error as Error).name === 'ZodError') {
      return reply.status(400).send({
        error: 'VALIDATION_ERROR',
        message: (error as unknown as ZodError).issues?.[0]?.message
          ?? 'Invalid request parameters',
      });
    }

    if ((error as FastifyError).statusCode === 404) {
      return reply.status(404).send({
        error: 'NOT_FOUND',
        message: 'Route not found',
      });
    }

    request.log.error(error);
    return reply.status((error as FastifyError).statusCode ?? 500).send({
      error: 'INTERNAL_ERROR',
      message: 'Something went wrong',
    });
  });
}

export default fp(errorHandlerPlugin);
