import { FastifyInstance } from 'fastify';
import { LocationsController } from './locations.controller.js';
import { LocationsService } from './locations.service.js';
import { LocationsRepository } from './locations.repository.js';

export async function locationsRoutes(fastify: FastifyInstance) {
  const repository = new LocationsRepository();
  const service = new LocationsService(repository);
  const controller = new LocationsController(service);

  fastify.get('/locations/search', {
    schema: {
      tags: ['Locations'],
      summary: 'Forward lookup by city, state or ZIP code',
      querystring: {
        type: 'object',
        required: ['q'],
        properties: {
          q: { type: 'string', description: 'City name, ZIP code, or partial address' },
          state: { type: 'string', description: 'State abbreviation e.g. CA' },
          limit: { type: 'number', default: 10, description: 'Max results to return' },
        },
      },
    },
  }, controller.forwardSearch);

  fastify.get('/locations/reverse', {
    schema: {
      tags: ['Locations'],
      summary: 'Reverse geocoding — find nearest location by coordinates',
      querystring: {
        type: 'object',
        required: ['lat', 'lng'],
        properties: {
          lat: { type: 'number', minimum: -90, maximum: 90, description: 'Latitude' },
          lng: { type: 'number', minimum: -180, maximum: 180, description: 'Longitude' },
        },
      },
    },
  }, controller.reverseSearch);

  fastify.get('/locations/radius', {
    schema: {
      tags: ['Locations'],
      summary: 'Find all locations within a radius',
      querystring: {
        type: 'object',
        required: ['lat', 'lng', 'km'],
        properties: {
          lat: { type: 'number', minimum: -90, maximum: 90, description: 'Latitude' },
          lng: { type: 'number', minimum: -180, maximum: 180, description: 'Longitude' },
          km: { type: 'number', minimum: 0.1, description: 'Search radius in kilometers' },
          limit: { type: 'number', default: 20, description: 'Max results to return' },
        },
      },
    },
  }, controller.radiusSearch);
}
