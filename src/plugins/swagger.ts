import fp from 'fastify-plugin';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';

async function swaggerPlugin(fastify: FastifyInstance) {
  await fastify.register(swagger, {
    swagger: {
      info: {
        title: 'ZIP Geo API',
        description: 'US ZIP code geocoding service',
        version: '1.0.0',
      },
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
  });
}

export default fp(swaggerPlugin);
