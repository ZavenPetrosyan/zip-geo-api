import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { LocationsService } from './locations.service.js';
import {
  forwardSearchSchema,
  reverseSearchSchema,
  radiusSearchSchema,
} from './locations.schema.js';

export class LocationsController {
  private service: LocationsService;

  constructor(service: LocationsService) {
    this.service = service;
  }

  forwardSearch = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const start = Date.now();
      const params = forwardSearchSchema.parse(request.query);

      const results = await this.service.forwardSearch({
        zip: params.q,
        state: params.state,
        limit: params.limit,
      });

      return reply.send({
        data: results,
        count: results.length,
        meta: {
          took_ms: Date.now() - start,
        },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({
          error: 'VALIDATION_ERROR',
          message: error.issues[0]?.message ?? 'Invalid request parameters',
        });
      }
      throw error;
    }
  };

  reverseSearch = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const start = Date.now();
      const params = reverseSearchSchema.parse(request.query);

      const result = await this.service.reverseSearch({
        latitude: params.lat,
        longitude: params.lng,
      });

      return reply.send({
        data: result,
        count: result ? 1 : 0,
        meta: {
          took_ms: Date.now() - start,
        },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({
          error: 'VALIDATION_ERROR',
          message: error.issues[0]?.message ?? 'Invalid request parameters',
        });
      }
      throw error;
    }
  };

  radiusSearch = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const start = Date.now();
      const params = radiusSearchSchema.parse(request.query);

      const results = await this.service.radiusSearch({
        latitude: params.lat,
        longitude: params.lng,
        radius: params.km,
        limit: params.limit,
      });

      return reply.send({
        data: results,
        count: results.length,
        meta: {
          took_ms: Date.now() - start,
        },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({
          error: 'VALIDATION_ERROR',
          message: error.issues[0]?.message ?? 'Invalid request parameters',
        });
      }
      throw error;
    }
  };
}
