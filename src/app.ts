import Fastify from 'fastify';
import { loggerOptions } from './plugins/logger.js';
import { sensiblePlugin } from './plugins/sensible.js';
import errorHandlerPlugin from './plugins/error-handler.js';
import swaggerPlugin from './plugins/swagger.js';
import { locationsRoutes } from './modules/locations/locations.routes.js';

export async function buildApp() {
  const app = Fastify({ logger: loggerOptions });

  app.setSchemaErrorFormatter((errors, dataVar) => {
    const first = errors[0];
    return new Error(
      JSON.stringify({
        error: 'VALIDATION_ERROR',
        message: first?.message ?? 'Invalid request parameters',
      })
    );
  });

  await app.register(swaggerPlugin);
  await app.register(errorHandlerPlugin);
  await app.register(sensiblePlugin);

  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      error: 'NOT_FOUND',
      message: `Route ${request.method} ${request.url} not found`,
    });
  });

  await app.register(locationsRoutes, { prefix: '/api/v1' });

  return app;
}
