import { FastifyInstance } from 'fastify';
import sensible from '@fastify/sensible';

export async function sensiblePlugin(fastify: FastifyInstance) {
  await fastify.register(sensible);
}
