import Fastify from 'fastify';
import { loggerOptions } from './plugins/logger.js';
import { sensiblePlugin } from './plugins/sensible.js';
import errorHandlerPlugin from './plugins/error-handler.js';
import swaggerPlugin from './plugins/swagger.js';
import { locationsRoutes } from './modules/locations/locations.routes.js';

export async function buildApp() {
  const app = Fastify({
    logger: loggerOptions,
    ajv: {
      customOptions: {
        removeAdditional: false,
        useDefaults: true,
        coerceTypes: false,
        allErrors: true,
      },
    },
  });

  app.setValidatorCompiler(({ schema }) => {
    return (data) => ({ value: data });
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
